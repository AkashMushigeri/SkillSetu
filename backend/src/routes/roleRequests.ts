import { Router } from 'express';
import type { Pool } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { withTransaction } from '../db/transaction';
import { mirrorRoleClaims, resolveAccessDenial, type AuthMiddleware, type ApplicationRole, type UserStatus } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  approveSchema,
  listRoleRequestsSchema,
  rejectSchema,
  roleRequestSchema,
  uuidParamSchema,
  type ApproveBody,
  type ListRoleRequestsQuery,
  type RejectBody,
  type RoleRequestBody,
} from '../middleware/schemas';
import {
  assertOrganizationLinked,
  resolveOrganization,
  validateSnapshot,
  type RequestableRole,
} from '../services/organization';
import { createPendingRoleRequest } from './auth';

export type RoleRequestRouterDependencies = {
  pool: Pool;
  auth: Auth;
  authMiddleware: AuthMiddleware;
};

type RoleRequestRow = {
  id: string;
  user_id: string;
  requested_role: RequestableRole;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  organization_snapshot: Record<string, unknown>;
  reason: string | null;
  reviewed_by: string | null;
  reviewed_at: Date | null;
  decision_note: string | null;
  created_at: Date;
  firebase_uid: string;
  applicant_email: string | null;
};

const REQUEST_SELECT = `
  SELECT r.id, r.user_id, r.requested_role, r.status, r.organization_snapshot, r.reason,
         r.reviewed_by, r.reviewed_at, r.decision_note, r.created_at,
         u.firebase_uid, u.email AS applicant_email
  FROM role_requests r
  JOIN users u ON u.id = r.user_id
`;

function shape(row: RoleRequestRow) {
  return {
    id: row.id,
    userId: row.user_id,
    requestedRole: row.requested_role,
    status: row.status,
    organizationSnapshot: row.organization_snapshot,
    reason: row.reason,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    decisionNote: row.decision_note,
    createdAt: row.created_at,
    applicant: { firebaseUid: row.firebase_uid, email: row.applicant_email },
  };
}

function readId(params: Record<string, string>): string {
  const parsed = uuidParamSchema.safeParse(params);

  if (!parsed.success) {
    throw AppError.badRequest('Role request id must be a UUID.', 'invalid_id');
  }

  return parsed.data.id;
}

type LockedRequest = RoleRequestRow;

async function loadPendingForUpdate(
  client: import('pg').PoolClient,
  id: string,
): Promise<LockedRequest> {
  const locked = await client.query<RoleRequestRow>(`${REQUEST_SELECT} WHERE r.id = $1 FOR UPDATE OF r`, [id]);
  const request = locked.rows[0];

  if (!request) {
    throw AppError.notFound('Role request not found.', 'role_request_not_found');
  }

  if (request.status !== 'pending') {
    throw AppError.conflict(`This request was already ${request.status}.`, 'role_request_not_pending');
  }

  return request;
}

export function createRoleRequestRouter({ pool, auth, authMiddleware }: RoleRequestRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole } = authMiddleware;

  /**
   * Flow B — an existing active student asks for an upgrade.
   *
   * The `users` row is left completely untouched: still role='student',
   * status='active'. Only `role_requests` gains a pending row, so a rejection can
   * never cost the applicant the account they already had.
   */
  router.post('/api/role-requests', requireAuth, validateBody(roleRequestSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as RoleRequestBody;

      // Status is checked before role so a pending applicant is told they are
      // awaiting approval, which is the actionable answer, rather than being told
      // their role is wrong for an upgrade.
      if (user.status !== 'active') {
        throw await resolveAccessDenial(pool, user);
      }

      if (user.role !== 'student') {
        throw AppError.forbidden(
          'Only an active student can request a role upgrade.',
          'upgrade_not_permitted',
        );
      }

      // 400 before any write when the snapshot cannot support approval later.
      const snapshot = validateSnapshot(body.requested_role, body.organization);

      const created = await withTransaction(pool, async (client) =>
        createPendingRoleRequest(client, {
          userId: user.userId,
          requestedRole: body.requested_role,
          snapshot,
          reason: body.reason,
        }),
      );

      logger.info(
        { requestedRole: body.requested_role, roleRequestId: created.id },
        'role request created; users row intentionally unchanged',
      );

      res.status(201).json({
        id: created.id,
        requestedRole: body.requested_role,
        status: 'pending',
        currentRole: user.role,
        currentStatus: user.status,
        requestId: String(res.locals.requestId ?? ''),
      });
    })().catch(next);
  });

  /** Admin-only review queue. */
  router.get('/api/role-requests', requireAuth, requireRole('admin'), validateQuery(listRoleRequestsSchema), (req, res, next) => {
    void (async () => {
      const { status, limit } = res.locals.query as ListRoleRequestsQuery;

      const result = await pool.query<RoleRequestRow>(
        `${REQUEST_SELECT} WHERE r.status = $1 ORDER BY r.created_at ASC LIMIT $2`,
        [status, limit],
      );

      res.status(200).json({
        requests: result.rows.map(shape),
        requestId: String(res.locals.requestId ?? ''),
      });
    })().catch(next);
  });

  /**
   * Approval. Fully transactional: the decision, the organization resolution and the
   * users update either all commit or none do, so a privileged role can never end up
   * committed with a NULL organization FK.
   */
  router.post('/api/role-requests/:id/approve', requireAuth, requireRole('admin'), (req, res, next) => {
    void (async () => {
      const id = readId(req.params);
      const body = (req.body && Object.keys(req.body).length > 0 ? req.body : {}) as ApproveBody;
      const admin = req.user!;

      const outcome = await withTransaction(pool, async (client) => {
        const request = await loadPendingForUpdate(client, id);

        const resolved = await resolveOrganization(client, {
          requestedRole: request.requested_role,
          userId: request.user_id,
          snapshot: request.organization_snapshot,
          explicitCompanyId: body.companyId,
          explicitCollegeId: body.collegeId,
        });

        // Approval-time invariant 2.
        assertOrganizationLinked(request.requested_role, resolved);

        await client.query(
          `UPDATE users SET role = $1, status = 'active', company_id = $2, college_id = $3 WHERE id = $4`,
          [request.requested_role, resolved.companyId, resolved.collegeId, request.user_id],
        );

        await client.query(
          `UPDATE role_requests
           SET status = 'approved', reviewed_by = $1, reviewed_at = now(), decision_note = $2
           WHERE id = $3`,
          [admin.userId, body.decisionNote ?? null, id],
        );

        return { request, resolved };
      });

      await mirrorRoleClaims(auth, outcome.request.firebase_uid, outcome.request.requested_role, 'active');

      logger.info(
        {
          roleRequestId: id,
          requestedRole: outcome.request.requested_role,
          strategy: outcome.resolved.strategy,
        },
        'role request approved',
      );

      res.status(200).json({
        id,
        status: 'approved',
        requestedRole: outcome.request.requested_role,
        organizationStrategy: outcome.resolved.strategy,
        companyId: outcome.resolved.companyId,
        collegeId: outcome.resolved.collegeId,
        requestId: String(res.locals.requestId ?? ''),
      });
    })().catch(next);
  });

  /**
   * Rejection. One deterministic rule from the plan: always mark the request
   * rejected; touch `users` ONLY when the account is not already active. A never
   * granted Flow A applicant therefore falls back to a working student account,
   * while a Flow B student is left completely untouched.
   */
  router.post('/api/role-requests/:id/reject', requireAuth, requireRole('admin'), (req, res, next) => {
    void (async () => {
      const id = readId(req.params);
      const body = (req.body && Object.keys(req.body).length > 0 ? req.body : {}) as RejectBody;
      const admin = req.user!;

      const outcome = await withTransaction(pool, async (client) => {
        const request = await loadPendingForUpdate(client, id);

        await client.query(
          `UPDATE role_requests
           SET status = 'rejected', reviewed_by = $1, reviewed_at = now(), decision_note = $2
           WHERE id = $3`,
          [admin.userId, body.decisionNote ?? null, id],
        );

        const current = await client.query<{
          role: ApplicationRole;
          status: UserStatus;
        }>('SELECT role, status FROM users WHERE id = $1 FOR UPDATE', [request.user_id]);

        const applicant = current.rows[0];
        let fellBackToStudent = false;

        if (applicant && applicant.status !== 'active') {
          await client.query(
            `UPDATE users
             SET role = 'student', status = 'active', company_id = NULL, college_id = NULL
             WHERE id = $1`,
            [request.user_id],
          );
          fellBackToStudent = true;
        }

        return { request, applicant: applicant ?? null, fellBackToStudent };
      });

      const resultingRole: ApplicationRole = outcome.fellBackToStudent ? 'student' : (outcome.applicant?.role ?? 'student');
      const resultingStatus: UserStatus = outcome.fellBackToStudent ? 'active' : (outcome.applicant?.status ?? 'active');

      await mirrorRoleClaims(auth, outcome.request.firebase_uid, resultingRole, resultingStatus);

      logger.info({ roleRequestId: id, fellBackToStudent: outcome.fellBackToStudent }, 'role request rejected');

      res.status(200).json({
        id,
        status: 'rejected',
        fellBackToStudent: outcome.fellBackToStudent,
        role: resultingRole,
        requestId: String(res.locals.requestId ?? ''),
      });
    })().catch(next);
  });

  return router;
}
