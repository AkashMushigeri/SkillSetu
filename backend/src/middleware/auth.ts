import type { NextFunction, Request, Response } from 'express';
import type { Pool } from 'pg';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

export const APPLICATION_ROLES = ['student', 'industry', 'college', 'admin'] as const;

export type ApplicationRole = (typeof APPLICATION_ROLES)[number];
export type UserStatus = 'pending' | 'active' | 'suspended';
export type RoleRequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

/**
 * The trusted request identity.
 *
 * Every field is read from the PostgreSQL `users` row. The Firebase token's claims
 * are never copied in here — a token carrying a forged `role: "admin"` claim must
 * not be able to change a single field below.
 */
export type TrustedUser = {
  firebaseUid: string;
  userId: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  phone: string | null;
  title: string | null;
  role: ApplicationRole;
  status: UserStatus;
  companyId: string | null;
  collegeId: string | null;
  onboardingCompleted: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TrustedUser;
      firebaseIdentity?: FirebaseIdentity;
    }
  }
}

/**
 * Claims read off a verified Firebase token. Authoritative for identity only —
 * nothing here is ever treated as a role.
 */
export type FirebaseIdentity = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
};

export type UserRow = {
  id: string;
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  phone: string | null;
  /** Recruiter title or college officer designation. Added by migration 0013. */
  title: string | null;
  role: ApplicationRole;
  status: UserStatus;
  company_id: string | null;
  college_id: string | null;
  onboarding_completed: boolean;
};

export const USER_COLUMNS = `
  id, firebase_uid, email, display_name, photo_url, phone, title,
  role, status, company_id, college_id, onboarding_completed
`;

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

export function isApplicationRole(value: unknown): value is ApplicationRole {
  return typeof value === 'string' && (APPLICATION_ROLES as readonly string[]).includes(value);
}

function toTrustedUser(row: UserRow): TrustedUser {
  return {
    firebaseUid: row.firebase_uid,
    userId: row.id,
    email: row.email,
    displayName: row.display_name,
    photoUrl: row.photo_url,
    phone: row.phone,
    title: row.title,
    role: row.role,
    status: row.status,
    companyId: row.company_id,
    collegeId: row.college_id,
    onboardingCompleted: row.onboarding_completed,
  };
}

export function toUserRow(user: TrustedUser): UserRow {
  return {
    id: user.userId,
    firebase_uid: user.firebaseUid,
    email: user.email,
    display_name: user.displayName,
    photo_url: user.photoUrl,
    phone: user.phone,
    title: user.title,
    role: user.role,
    status: user.status,
    company_id: user.companyId,
    college_id: user.collegeId,
    onboarding_completed: user.onboardingCompleted,
  };
}

/**
 * firebase_uid is the identity key. Email is synced but never used to find or
 * reassign an account, so a user changing their Firebase email keeps the same
 * application identity.
 */
export async function findUserByFirebaseUid(pool: Pool, firebaseUid: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE firebase_uid = $1 LIMIT 1`,
    [firebaseUid],
  );
  return result.rows[0] ?? null;
}

/**
 * Precise 403 bodies. A pending request and a rejected one are very different
 * outcomes for the person reading the error, so they must not collapse into a
 * generic "forbidden".
 */
export async function resolveAccessDenial(
  pool: Pool,
  user: TrustedUser,
): Promise<AppError> {
  if (user.status !== 'active') {
    const newest = await pool.query<{ status: RoleRequestStatus }>(
      'SELECT status FROM role_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user.userId],
    );

    const newestStatus = newest.rows[0]?.status;

    if (newestStatus === 'pending') {
      return AppError.forbidden(
        'Your account is awaiting administrator approval.',
        'awaiting_approval',
      );
    }

    if (newestStatus === 'rejected') {
      return AppError.forbidden(
        'Your most recent role request was rejected.',
        'role_request_rejected',
      );
    }

    return AppError.forbidden('This account is not active.', 'account_suspended');
  }

  return AppError.forbidden('You do not have access to this resource.', 'forbidden');
}

export type AuthDependencies = {
  pool: Pool;
  resolveAuth: () => Auth;
};

function extractBearerToken(req: Request): string {
  const header = req.header('authorization');

  if (!header) {
    throw AppError.unauthorized('Authorization header is required.', 'missing_authorization');
  }

  const match = BEARER_PATTERN.exec(header.trim());

  if (!match || !match[1]) {
    throw AppError.unauthorized('Authorization header must be "Bearer <token>".', 'malformed_authorization');
  }

  return match[1];
}

/**
 * Turns any token-verification failure into a 401.
 *
 * Without this the Firebase error object would reach the generic error handler and
 * become a 500, which would tell a client with an expired token to retry forever.
 * The underlying message is logged but never returned.
 */
async function verifyToken(resolveAuth: () => Auth, token: string): Promise<DecodedIdToken> {
  try {
    return await resolveAuth().verifyIdToken(token, true);
  } catch (error) {
    logger.warn(
      { err: error, code: (error as { code?: string }).code },
      'firebase id token rejected',
    );
    throw AppError.unauthorized('The provided token is invalid or has expired.', 'invalid_token');
  }
}

export function createAuthMiddleware({ pool, resolveAuth }: AuthDependencies) {
  /**
   * Verifies the token only. `POST /api/auth/register` needs this: the caller has a
   * perfectly valid Firebase identity but, by definition, no `users` row yet, so
   * requiring one first would make registration unreachable.
   */
  function requireFirebaseToken(req: Request, _res: Response, next: NextFunction): void {
    void (async () => {
      const token = extractBearerToken(req);
      const decoded = await verifyToken(resolveAuth, token);

      if (!decoded.uid) {
        throw AppError.unauthorized('Token did not contain a subject.', 'invalid_token');
      }

      req.firebaseIdentity = {
        uid: decoded.uid,
        email: typeof decoded.email === 'string' ? decoded.email : null,
        displayName: typeof decoded.name === 'string' ? decoded.name : null,
        photoUrl: typeof decoded.picture === 'string' ? decoded.picture : null,
      };

      next();
    })().catch(next);
  }

  /**
   * The only token-validation path into the application.
   *
   * Deliberately does NOT gate on `status`: students are created active and pass
   * straight through, and `requireRole` is where approval is enforced.
   */
  function requireAuth(req: Request, res: Response, next: NextFunction): void {
    requireFirebaseToken(req, res, (tokenError?: unknown) => {
      if (tokenError) {
        next(tokenError);
        return;
      }

      void (async () => {
        const identity = req.firebaseIdentity!;
        const row = await findUserByFirebaseUid(pool, identity.uid);

        if (!row) {
          throw AppError.forbidden(
            'This Firebase account has no application profile yet.',
            'registration_required',
          );
        }

        req.user = toTrustedUser(row);
        next();
      })().catch(next);
    });
  }

  function requireUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      next(AppError.unauthorized('Authentication is required.', 'unauthenticated'));
      return;
    }
    next();
  }

  async function deny(poolRef: Pool, user: TrustedUser): Promise<never> {
    throw await resolveAccessDenial(poolRef, user);
  }

  /** Requires `users.status = 'active'`. */
  function requireActive(req: Request, _res: Response, next: NextFunction): void {
    void (async () => {
      if (!req.user) {
        next(AppError.unauthorized('Authentication is required.', 'unauthenticated'));
        return;
      }

      if (req.user.status !== 'active') {
        await deny(pool, req.user);
      }

      next();
    })().catch(next);
  }

  /**
   * Accepts only the roles given. Composed with requireActive so a pending user is
   * told `awaiting_approval` rather than a bare `forbidden`.
   */
  function requireRole(...roles: ApplicationRole[]) {
    return function roleGuard(req: Request, res: Response, next: NextFunction): void {
      requireUser(req, res, (userError?: unknown) => {
        if (userError) {
          next(userError);
          return;
        }

        if (!roles.includes(req.user!.role)) {
          void deny(pool, req.user!).catch(next);
          return;
        }

        requireActive(req, res, next);
      });
    };
  }

  /**
   * Fails closed when a privileged user has no organization FK yet, so a pending
   * account can never reach a portal that scopes its data by company or college.
   */
  function requireOrganization(...roles: ApplicationRole[]) {
    return function organizationGuard(req: Request, res: Response, next: NextFunction): void {
      requireRole(...roles)(req, res, (roleError?: unknown) => {
        if (roleError) {
          next(roleError);
          return;
        }

        const user = req.user!;
        const missing =
          (user.role === 'industry' && !user.companyId) || (user.role === 'college' && !user.collegeId);

        if (missing) {
          next(
            AppError.forbidden(
              'Your account is not linked to an organization yet.',
              'organization_required',
            ),
          );
          return;
        }

        next();
      });
    };
  }

  return { requireFirebaseToken, requireAuth, requireUser, requireRole, requireActive, requireOrganization };
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;

/**
 * Fires after the transaction commits. A claim failure must never undo a
 * committed authorization change, and authorization never reads the claim.
 */
export async function mirrorRoleClaims(
  auth: Auth,
  firebaseUid: string,
  role: ApplicationRole,
  status: UserStatus,
): Promise<void> {
  try {
    await auth.setCustomUserClaims(firebaseUid, { role, status });
    logger.info({ role, status }, 'custom claims mirrored');
  } catch (error) {
    logger.warn({ err: error }, 'custom claim sync failed; database remains authoritative');
  }
}
