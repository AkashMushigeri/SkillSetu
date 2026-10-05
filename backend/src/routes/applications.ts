import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { onConflict, onMissingReference, readQuery, readUuidParam, requestId } from '../lib/http';
import { withTransaction } from '../db/transaction';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createApplicationSchema,
  listApplicationsSchema,
  updateApplicationStageSchema,
  upsertSavedJobSchema,
  type CreateApplicationBody,
  type ListApplicationsQuery,
  type UpdateApplicationStageBody,
  type UpsertSavedJobBody,
} from '../middleware/domainSchemas';

/**
 * Applications, their stage history, and saved/bookmarked opportunities.
 *
 * Replaces the Data Connect writes `createApplication` and
 * `updateApplicationStage`, plus the localStorage `skillsetu_<uid>_applications`
 * and `skillsetu_<uid>_saved_opps` arrays.
 *
 * The stage update is the interesting one. `moveApplicationStage` used to
 * optimistically mutate local state, fire a Data Connect mutation, and publish
 * onto the localStorage sync bus, so the industry portal only ever saw the
 * change on the same browser. Here the stage and its history row are written in
 * one transaction, and the student and recruiter read the same row.
 */

export type ApplicationRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

const APPLICATION_SELECT = `
  a.id, a.candidate_user_id, a.company_id, a.source, a.job_id, a.internship_id,
  a.external_id, a.external_company, a.external_title, a.stage, a.match_score,
  a.matched_skills, a.missing_skills, a.cover_note, a.recruiter_notes,
  a.applied_at, a.decided_at, a.created_at, a.updated_at
`;

/** Stages that close an application. Drives decided_at. */
const TERMINAL_STAGES = new Set(['hired', 'rejected', 'withdrawn']);

export function createApplicationRouter({ pool, authMiddleware }: ApplicationRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole, requireOrganization } = authMiddleware;

  /* ------------------------------------------------------------- student */

  router.get('/api/student/applications', requireAuth, requireRole('student'), validateQuery(listApplicationsSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListApplicationsQuery>(res);
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT ${APPLICATION_SELECT},
                j.title AS job_title, j.slug AS job_slug, j.location AS job_location,
                i.title AS internship_title, i.location AS internship_location,
                c.name AS company_name, c.logo_url AS company_logo
         FROM applications a
         LEFT JOIN jobs j ON j.id = a.job_id
         LEFT JOIN internships i ON i.id = a.internship_id
         LEFT JOIN companies c ON c.id = a.company_id
         WHERE a.candidate_user_id = $1
           AND ($2::application_stage IS NULL OR a.stage = $2)
         ORDER BY a.applied_at DESC
         LIMIT $3 OFFSET $4`,
        [userId, query.stage ?? null, query.limit, query.offset],
      );

      const total = await pool.query<{ count: string }>(
        `SELECT count(*)::text AS count FROM applications
         WHERE candidate_user_id = $1 AND ($2::application_stage IS NULL OR stage = $2)`,
        [userId, query.stage ?? null],
      );

      res.status(200).json({
        applications: result.rows,
        total: Number(total.rows[0]?.count ?? 0),
        requestId: requestId(res),
      });
    })().catch(next);
  });

  /**
   * POST /api/student/applications
   *
   * `company_id` is derived from whichever opportunity was targeted, never from
   * the body. The client previously sent its own company id and defaulted to a
   * hardcoded demo UUID when it had none.
   */
  router.post('/api/student/applications', requireAuth, requireRole('student'), validateBody(createApplicationSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as CreateApplicationBody;

      const created = await onConflict(() =>
        withTransaction(pool, async (client) => {
          let companyId: string | null = null;

          if (body.jobId) {
            const job = await client.query<{ company_id: string }>(
              'SELECT company_id FROM jobs WHERE id = $1',
              [body.jobId],
            );
            if (!job.rows[0]) {
              throw AppError.unprocessable('That job does not exist.', 'job_not_found');
            }
            companyId = job.rows[0].company_id;
          } else if (body.internshipId) {
            const internship = await client.query<{ company_id: string }>(
              'SELECT company_id FROM internships WHERE id = $1',
              [body.internshipId],
            );
            if (!internship.rows[0]) {
              throw AppError.unprocessable('That internship does not exist.', 'internship_not_found');
            }
            companyId = internship.rows[0].company_id;
          }

          const inserted = await client.query(
            `INSERT INTO applications
               (candidate_user_id, company_id, source, job_id, internship_id, external_id,
                external_company, external_title, match_score, matched_skills, missing_skills, cover_note)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             RETURNING id, stage, applied_at, created_at`,
            [
              userId,
              companyId,
              body.source,
              body.jobId ?? null,
              body.internshipId ?? null,
              body.externalId ?? null,
              body.externalCompany ?? null,
              body.externalTitle ?? null,
              body.matchScore ?? null,
              body.matchedSkills,
              body.missingSkills,
              body.coverNote ?? null,
            ],
          );

          await client.query(
            `INSERT INTO application_stage_history (application_id, stage, note, changed_by)
             VALUES ($1,'new_application',$2,$3)`,
            [inserted.rows[0].id, 'Application submitted', userId],
          );

          return { ...inserted.rows[0], companyId };
        }),
        'You have already applied to this opportunity.',
        'application_already_exists',
      );

      // The recruiter who owns the company is told an application arrived. This
      // is the server-side replacement for publishing onto the sync bus.
      if (created.companyId) {
        await notifyCompanyRecruiters(pool, created.companyId, userId, 'application', 'New application received').catch(
          (error: unknown) => logger.warn({ err: error }, 'application notification failed'),
        );
      }

      logger.info({ userId, applicationId: created.id }, 'application created');

      res.status(201).json({ application: created, requestId: requestId(res) });
    })().catch(next);
  });

  /* ------------------------------------------------------------ industry */

  /**
   * Recruiter view, scoped to their own company. There is no company_id
   * parameter, so a recruiter cannot list another tenant's applicants.
   */
  router.get('/api/industry/applications', requireAuth, requireOrganization('industry'), validateQuery(listApplicationsSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListApplicationsQuery>(res);
      const companyId = req.user!.companyId;

      const result = await pool.query(
        `SELECT ${APPLICATION_SELECT},
                u.display_name AS candidate_name, u.email AS candidate_email,
                u.photo_url AS candidate_photo,
                j.title AS job_title, i.title AS internship_title,
                sp.degree AS candidate_degree, sp.cgpa AS candidate_cgpa,
                sp.academic_year AS candidate_year
         FROM applications a
         JOIN users u ON u.id = a.candidate_user_id
         LEFT JOIN student_profiles sp ON sp.user_id = u.id
         LEFT JOIN jobs j ON j.id = a.job_id
         LEFT JOIN internships i ON i.id = a.internship_id
         WHERE a.company_id = $1
           AND ($2::application_stage IS NULL OR a.stage = $2)
         ORDER BY a.applied_at DESC
         LIMIT $3 OFFSET $4`,
        [companyId, query.stage ?? null, query.limit, query.offset],
      );

      res.status(200).json({ applications: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * POST /api/industry/applications/:id/stage
   *
   * The stage and its history row commit together, so a moved application can
   * never be visible without the audit trail that explains the move.
   */
  router.post(
    '/api/industry/applications/:id/stage',
    requireAuth,
    requireOrganization('industry'),
    validateBody(updateApplicationStageSchema),
    (req, res, next) => {
      void (async () => {
        const recruiter = req.user!;
        const id = readUuidParam(req.params);
        const body = req.body as UpdateApplicationStageBody;

        const outcome = await withTransaction(pool, async (client) => {
          const locked = await client.query<{
            id: string;
            candidate_user_id: string;
            company_id: string | null;
            stage: string;
          }>(
            'SELECT id, candidate_user_id, company_id, stage FROM applications WHERE id = $1 FOR UPDATE',
            [id],
          );

          const application = locked.rows[0];

          if (!application) {
            throw AppError.notFound('Application not found.', 'application_not_found');
          }

          // Tenant check. A recruiter from another company gets a 404 so the
          // response does not confirm the application exists.
          if (application.company_id !== recruiter.companyId) {
            throw AppError.notFound('Application not found.', 'application_not_found');
          }

          const updated = await client.query(
            `UPDATE applications SET
               stage = $2,
               decided_at = CASE WHEN $3 THEN now() ELSE decided_at END
             WHERE id = $1
             RETURNING id, stage, decided_at, updated_at`,
            [id, body.stage, TERMINAL_STAGES.has(body.stage)],
          );

          await client.query(
            `INSERT INTO application_stage_history (application_id, stage, note, changed_by)
             VALUES ($1,$2,$3,$4)`,
            [id, body.stage, body.note ?? null, recruiter.userId],
          );

          return { application: updated.rows[0], candidateUserId: application.candidate_user_id };
        });

        // The candidate sees their own stage change, on any device.
        await insertNotification(pool, {
          recipientUserId: outcome.candidateUserId,
          type: 'application',
          title: `Application moved to ${body.stage.replace(/_/g, ' ')}`,
          message: body.note ?? null,
          link: '/student/applications',
          meta: { applicationId: id },
        }).catch((error: unknown) => logger.warn({ err: error }, 'stage notification failed'));

        logger.info({ recruiterId: recruiter.userId, applicationId: id, stage: body.stage }, 'application stage updated');

        res.status(200).json({ application: outcome.application, requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.get('/api/industry/applications/:id/history', requireAuth, requireOrganization('industry'), (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const companyId = req.user!.companyId;

      const owned = await pool.query<{ id: string }>(
        'SELECT id FROM applications WHERE id = $1 AND company_id = $2',
        [id, companyId],
      );

      if (!owned.rows[0]) {
        throw AppError.notFound('Application not found.', 'application_not_found');
      }

      const history = await pool.query(
        `SELECT h.id, h.stage, h.note, h.changed_at, u.display_name AS changed_by_name
         FROM application_stage_history h
         LEFT JOIN users u ON u.id = h.changed_by
         WHERE h.application_id = $1
         ORDER BY h.changed_at ASC`,
        [id],
      );

      res.status(200).json({ history: history.rows, requestId: requestId(res) });
    })().catch(next);
  });

  /* ----------------------------------------------------------- saved jobs */

  router.get('/api/student/saved', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT s.source, s.external_id, s.job_id, s.internship_id, s.title,
                s.company_name, s.location, s.work_mode, s.salary_range, s.saved_at,
                c.name AS company_name_resolved, c.logo_url AS company_logo,
                j.title AS job_title, j.city AS job_city, j.deadline AS job_deadline,
                i.title AS internship_title, i.stipend AS internship_stipend
         FROM saved_jobs s
         LEFT JOIN jobs j ON j.id = s.job_id
         LEFT JOIN internships i ON i.id = s.internship_id
         LEFT JOIN companies c ON c.id = j.company_id
         WHERE s.user_id = $1
         ORDER BY s.saved_at DESC`,
        [userId],
      );

      res.status(200).json({ saved: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.put('/api/student/saved', requireAuth, requireRole('student'), validateBody(upsertSavedJobSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as UpsertSavedJobBody;

      // saved_jobs has no surrogate id: its primary key is
      // (user_id, source, external_id), so the natural key is what comes back.
      const saved = await onMissingReference(() =>
        pool.query(
          `INSERT INTO saved_jobs
             (user_id, source, external_id, job_id, internship_id, title, company_name, location, work_mode, salary_range)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           ON CONFLICT (user_id, source, external_id) DO UPDATE SET
             job_id = EXCLUDED.job_id,
             internship_id = EXCLUDED.internship_id,
             title = EXCLUDED.title,
             company_name = EXCLUDED.company_name,
             location = EXCLUDED.location,
             work_mode = EXCLUDED.work_mode,
             salary_range = EXCLUDED.salary_range,
             saved_at = now()
           RETURNING user_id, source, external_id, title, company_name, saved_at`,
          [
            userId,
            body.source,
            body.externalId,
            body.jobId ?? null,
            body.internshipId ?? null,
            body.title ?? null,
            body.companyName ?? null,
            body.location ?? null,
            body.workMode ?? null,
            body.salaryRange ?? null,
          ],
        ),
      );

      res.status(200).json({ saved: saved.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.delete('/api/student/saved/:externalId', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const externalId = String(req.params.externalId ?? '');

      if (externalId.trim() === '') {
        throw AppError.badRequest('externalId is required.', 'missing_external_id');
      }

      const deleted = await pool.query(
        'DELETE FROM saved_jobs WHERE user_id = $1 AND external_id = $2 RETURNING external_id',
        [userId, externalId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('That opportunity was not saved.', 'saved_job_not_found');
      }

      res.status(204).end();
    })().catch(next);
  });

  return router;
}

/* ------------------------------------------------------------- helpers */

/**
 * Shared with the notifications router; kept here so the application router does
 * not depend on router import order.
 */
export async function insertNotification(
  pool: Pool,
  input: {
    recipientUserId: string;
    type: string;
    title: string;
    message?: string | null;
    link?: string | null;
    meta?: Record<string, unknown>;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO notifications (recipient_user_id, type, title, message, link, meta)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      input.recipientUserId,
      input.type,
      input.title,
      input.message ?? null,
      input.link ?? null,
      JSON.stringify(input.meta ?? {}),
    ],
  );
}

/** Notifies every active industry user at the given company. */
export async function notifyCompanyRecruiters(
  pool: Pool,
  companyId: string,
  actorUserId: string,
  type: string,
  title: string,
): Promise<void> {
  const recruiters = await pool.query<{ id: string }>(
    `SELECT id FROM users
     WHERE company_id = $1 AND role = 'industry' AND status = 'active' AND id <> $2`,
    [companyId, actorUserId],
  );

  for (const recruiter of recruiters.rows) {
    await insertNotification(pool, {
      recipientUserId: recruiter.id,
      type,
      title,
      link: '/industry/applications',
      meta: { companyId },
    });
  }
}