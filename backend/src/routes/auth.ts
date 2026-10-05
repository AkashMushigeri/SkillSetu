import { Router } from 'express';
import type { Pool, PoolClient } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { withTransaction } from '../db/transaction';
import { mirrorRoleClaims, toUserRow, type AuthMiddleware, type UserRow } from '../middleware/auth';
import { USER_COLUMNS } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { registerSchema, updateAccountSchema, type RegisterBody, type UpdateAccountBody } from '../middleware/schemas';
import { validateSnapshot, type RequestableRole } from '../services/organization';

export type AuthRouterDependencies = {
  pool: Pool;
  auth: Auth;
  authMiddleware: AuthMiddleware;
};

function requestId(res: { locals: Record<string, unknown> }): string {
  return String(res.locals.requestId ?? '');
}

/** The minimum the frontend needs to route and render; no credentials, no claims. */
export function identityPayload(user: UserRow) {
  return {
    userId: user.id,
    firebaseUid: user.firebase_uid,
    email: user.email,
    displayName: user.display_name,
    photoUrl: user.photo_url,
    phone: user.phone,
    title: user.title,
    role: user.role,
    status: user.status,
    companyId: user.company_id,
    collegeId: user.college_id,
    onboardingCompleted: user.onboarding_completed,
  };
}

/**
 * The partial unique index `role_requests_one_pending_per_user` is the real guard;
 * this turns its violation into a clean 409 instead of a 500.
 */
export async function createPendingRoleRequest(
  client: PoolClient,
  input: { userId: string; requestedRole: 'industry' | 'college'; snapshot: unknown; reason?: string },
): Promise<{ id: string }> {
  try {
    const result = await client.query<{ id: string }>(
      `INSERT INTO role_requests (user_id, requested_role, status, organization_snapshot, reason)
       VALUES ($1,$2,'pending',$3,$4)
       RETURNING id`,
      [input.userId, input.requestedRole, JSON.stringify(input.snapshot), input.reason ?? null],
    );
    return result.rows[0]!;
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw AppError.conflict('You already have a pending role request.', 'role_request_already_pending');
    }
    throw error;
  }
}

export function createIdentityRouter({ pool, auth, authMiddleware }: AuthRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireFirebaseToken } = authMiddleware;

  router.get('/api/auth/me', requireAuth, (req, res) => {
    res.status(200).json({ ...identityPayload(toUserRow(req.user!)), requestId: requestId(res) });
  });

  /**
   * PATCH /api/auth/me
   *
   * The account fields a person owns: display name, phone, job title, avatar, and
   * the onboarding flag. This replaces the Firestore `users/{uid}` blob that
   * `saveUserProfile` wrote on every profile edit and that `getUserProfile` read
   * back — the copy of the account which routing decisions were made from while
   * authorization was decided from PostgreSQL.
   *
   * An absent key leaves a column alone; an explicit null clears it. The
   * distinction is why this is built from the keys the caller sent rather than
   * blanket-writing every field.
   *
   * `role`, `status`, `companyId` and `collegeId` are absent from the schema on
   * purpose. Those are decided by registration and admin approval, and a person
   * editing their own profile must not be able to reach them.
   */
  router.patch('/api/auth/me', requireAuth, validateBody(updateAccountSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as UpdateAccountBody;

      const columns: Record<string, string> = {
        displayName: 'display_name',
        phone: 'phone',
        title: 'title',
        avatarUrl: 'photo_url',
        onboardingCompleted: 'onboarding_completed',
      };

      const sets: string[] = [];
      const values: unknown[] = [];

      for (const [key, column] of Object.entries(columns)) {
        if (!(key in body)) {
          continue;
        }
        values.push(body[key as keyof typeof body] ?? null);
        sets.push(`${column} = $${values.length}`);
      }

      if (sets.length === 0) {
        const unchanged = await pool.query<UserRow>(
          `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
          [userId],
        );
        res.status(200).json({ ...identityPayload(unchanged.rows[0]!), requestId: requestId(res) });
        return;
      }

      values.push(userId);

      const updated = await pool.query<UserRow>(
        `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING ${USER_COLUMNS}`,
        values,
      );

      logger.info({ userId, fields: Object.keys(body).length }, 'account updated');

      res.status(200).json({ ...identityPayload(updated.rows[0]!), requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * Flow A registration.
   *
   * Idempotent on firebase_uid: a repeat call returns the existing application
   * identity rather than inserting a second user or a second pending request.
   * Identity is never keyed on email, so a user who changes their Firebase email
   * keeps the same account.
   */
  router.post('/api/auth/register', requireFirebaseToken, validateBody(registerSchema), (req, res, next) => {
    void (async () => {
      const identity = req.firebaseIdentity!;
      const body = req.body as RegisterBody;

      const outcome = await withTransaction(pool, async (client) => {
        const existing = await client.query<UserRow>(
          `SELECT ${USER_COLUMNS} FROM users WHERE firebase_uid = $1 FOR UPDATE`,
          [identity.uid],
        );

        if (existing.rows[0]) {
          return { created: existing.rows[0], alreadyRegistered: true };
        }

        if (identity.email) {
          // Validation row 20: an email already held by a different firebase_uid is a
          // 409 and must mutate nothing.
          const emailClash = await client.query(
            'SELECT 1 FROM users WHERE email = $1 AND firebase_uid <> $2',
            [identity.email, identity.uid],
          );

          if (emailClash.rowCount && emailClash.rowCount > 0) {
            throw AppError.conflict(
              'That email address is already linked to a different account.',
              'email_taken',
            );
          }
        }

        const isPrivileged = body.intentRole !== 'student';
        const requestedRole = body.intentRole as RequestableRole;

        let snapshot: unknown = {};
        if (isPrivileged) {
          // Throws 400 before anything is written when the snapshot is incomplete.
          snapshot = validateSnapshot(requestedRole, body.organization ?? {});
        }

        const inserted = await client.query<UserRow>(
          `INSERT INTO users (firebase_uid, email, display_name, photo_url, phone, role, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           RETURNING ${USER_COLUMNS}`,
          [
            identity.uid,
            identity.email,
            body.displayName ?? identity.displayName,
            identity.photoUrl,
            body.phone ?? null,
            body.intentRole,
            // A privileged signup stays pending until an admin approves it; a student
            // is usable immediately.
            isPrivileged ? 'pending' : 'active',
          ],
        );

        const created = inserted.rows[0]!;

        if (isPrivileged) {
          await createPendingRoleRequest(client, {
            userId: created.id,
            requestedRole,
            snapshot,
          });
        }

        return { created, alreadyRegistered: false };
      });

      // Post-commit and best-effort: authorization reads PostgreSQL, never this claim.
      await mirrorRoleClaims(auth, outcome.created.firebase_uid, outcome.created.role, outcome.created.status);
      if (!outcome.alreadyRegistered) {
        logger.info(
          { role: outcome.created.role, status: outcome.created.status, intentRole: body.intentRole },
          'auth: registered',
        );
      }

      res.status(outcome.alreadyRegistered ? 200 : 201).json({
        ...identityPayload(outcome.created),
        alreadyRegistered: outcome.alreadyRegistered,
        requestId: requestId(res),
      });
    })().catch(next);
  });

  return router;
}
