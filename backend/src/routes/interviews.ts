import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { onMissingReference, readUuidParam, requestId } from '../lib/http';
import { withTransaction } from '../db/transaction';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createInterviewSchema,
  createOfferSchema,
  updateInterviewSchema,
  updateOfferSchema,
  type CreateInterviewBody,
  type CreateOfferBody,
  type UpdateInterviewBody,
  type UpdateOfferBody,
} from '../middleware/domainSchemas';
import { insertNotification } from './applications';

/**
 * Interviews and offers.
 *
 * Both were previously `skillsetu_ind_interviews` and `skillsetu_ind_offers`
 * localStorage arrays. They never reached Data Connect: `createInterview` and
 * `createOffer` exist in the connector but were never wired up, so there was no
 * server-side record at all.
 *
 * The scheduling write is transactional across the interview row and its
 * notification, because a candidate who is told an interview exists must not be
 * able to see the opposite outcome on another device.
 */

export type InterviewRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

const INTERVIEW_SELECT = `
  i.id, i.application_id, i.candidate_user_id, i.company_id, i.job_id, i.internship_id,
  i.round, i.scheduled_at, i.mode, i.meeting_link, i.interviewers, i.notes,
  i.status, i.score, i.created_at, i.updated_at
`;

const OFFER_SELECT = `
  o.id, o.candidate_user_id, o.company_id, o.application_id, o.job_id, o.internship_id,
  o.offer_type, o.department, o.location, o.work_mode, o.compensation, o.base_fixed,
  o.variable_bonus, o.retention_joining_bonus, o.benefits_summary, o.joining_date,
  o.valid_until, o.status, o.authorized_signatory, o.signatory_title, o.created_at, o.updated_at
`;

export function createInterviewRouter({ pool, authMiddleware }: InterviewRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole, requireOrganization } = authMiddleware;

  const recruiter = requireOrganization('industry');

  /* ---------------------------------------------------------- interviews */

  router.get('/api/student/interviews', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT ${INTERVIEW_SELECT}, c.name AS company_name, c.logo_url AS company_logo,
                j.title AS job_title, i2.title AS internship_title
         FROM interviews i
         LEFT JOIN companies c ON c.id = i.company_id
         LEFT JOIN jobs j ON j.id = i.job_id
         LEFT JOIN internships i2 ON i2.id = i.internship_id
         WHERE i.candidate_user_id = $1
         ORDER BY i.scheduled_at ASC`,
        [userId],
      );

      res.status(200).json({ interviews: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/industry/interviews', requireAuth, recruiter, (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId;

      const result = await pool.query(
        `SELECT ${INTERVIEW_SELECT}, u.display_name AS candidate_name,
                u.email AS candidate_email, u.photo_url AS candidate_photo,
                j.title AS job_title
         FROM interviews i
         JOIN users u ON u.id = i.candidate_user_id
         LEFT JOIN jobs j ON j.id = i.job_id
         WHERE i.company_id = $1
         ORDER BY i.scheduled_at ASC`,
        [companyId],
      );

      res.status(200).json({ interviews: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/industry/interviews', requireAuth, recruiter, validateBody(createInterviewSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateInterviewBody;
      const companyId = user.companyId!;

      const created = await onMissingReference(() =>
        withTransaction(pool, async (client) => {
          // The candidate is resolved from the application when one is given,
          // and never from the request body.
          let candidateUserId: string | null = null;

          if (body.applicationId) {
            const application = await client.query<{ candidate_user_id: string; company_id: string | null }>(
              'SELECT candidate_user_id, company_id FROM applications WHERE id = $1',
              [body.applicationId],
            );

            if (!application.rows[0] || application.rows[0].company_id !== companyId) {
              throw AppError.notFound('Application not found.', 'application_not_found');
            }

            candidateUserId = application.rows[0].candidate_user_id;
          } else {
            const candidate = await client.query<{ candidate_user_id: string }>(
              `SELECT a.candidate_user_id FROM applications a
               WHERE (a.job_id = $1 OR a.internship_id = $2) AND a.company_id = $3
               ORDER BY a.applied_at DESC LIMIT 1`,
              [body.jobId ?? null, body.internshipId ?? null, companyId],
            );

            if (!candidate.rows[0]) {
              throw AppError.unprocessable(
                'No application exists for that opportunity at your company.',
                'no_application_for_opportunity',
              );
            }

            candidateUserId = candidate.rows[0].candidate_user_id;
          }

          const inserted = await client.query(
            `INSERT INTO interviews
               (application_id, candidate_user_id, company_id, job_id, internship_id,
                round, scheduled_at, mode, meeting_link, interviewers, notes, score)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             RETURNING id, candidate_user_id, round, scheduled_at, mode, status`,
            [
              body.applicationId ?? null,
              candidateUserId,
              companyId,
              body.jobId ?? null,
              body.internshipId ?? null,
              body.round,
              body.scheduledAt,
              body.mode,
              body.meetingLink ?? null,
              body.interviewers,
              body.notes ?? null,
              body.score ?? null,
            ],
          );

          // Same transaction: the candidate must never be left unaware of a
          // committed interview.
          await client.query(
            `INSERT INTO notifications (recipient_user_id, type, title, message, link, meta)
             VALUES ($1,'interview',$2,$3,'/student/applications',$4)`,
            [
              candidateUserId,
              `Interview scheduled (${body.round.replace(/_/g, ' ')})`,
              body.notes ?? null,
              JSON.stringify({ interviewId: inserted.rows[0].id }),
            ],
          );

          return inserted.rows[0];
        }),
      );

      logger.info({ userId: user.userId, interviewId: created.id }, 'interview scheduled');

      res.status(201).json({ interview: created, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/industry/interviews/:id', requireAuth, recruiter, validateBody(updateInterviewSchema), (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const companyId = req.user!.companyId;
      const body = req.body as UpdateInterviewBody;

      const updated = await pool.query(
        `UPDATE interviews SET
           status = COALESCE($3, status),
           scheduled_at = COALESCE($4, scheduled_at),
           mode = COALESCE($5, mode),
           meeting_link = COALESCE($6, meeting_link),
           notes = COALESCE($7, notes),
           score = COALESCE($8, score)
         WHERE id = $1 AND company_id = $2
         RETURNING id, round, scheduled_at, mode, status, score`,
        [
          id,
          companyId,
          body.status ?? null,
          body.scheduledAt ?? null,
          body.mode ?? null,
          body.meetingLink ?? null,
          body.notes ?? null,
          body.score ?? null,
        ],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('Interview not found.', 'interview_not_found');
      }

      if (body.status === 'cancelled' || body.scheduledAt) {
        const owner = await pool.query<{ candidate_user_id: string }>(
          'SELECT candidate_user_id FROM interviews WHERE id = $1',
          [id],
        );

        if (owner.rows[0]) {
          await insertNotification(pool, {
            recipientUserId: owner.rows[0].candidate_user_id,
            type: 'interview',
            title: body.status === 'cancelled' ? 'Interview cancelled' : 'Interview rescheduled',
            link: '/student/applications',
            meta: { interviewId: id },
          }).catch((error: unknown) => logger.warn({ err: error }, 'interview notification failed'));
        }
      }

      res.status(200).json({ interview: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /* --------------------------------------------------------------- offers */

  router.get('/api/student/offers', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT ${OFFER_SELECT}, c.name AS company_name, c.logo_url AS company_logo
         FROM offers o
         LEFT JOIN companies c ON c.id = o.company_id
         WHERE o.candidate_user_id = $1
         ORDER BY o.created_at DESC`,
        [userId],
      );

      res.status(200).json({ offers: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/industry/offers', requireAuth, recruiter, (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId;

      const result = await pool.query(
        `SELECT ${OFFER_SELECT}, u.display_name AS candidate_name, u.email AS candidate_email
         FROM offers o JOIN users u ON u.id = o.candidate_user_id
         WHERE o.company_id = $1
         ORDER BY o.created_at DESC`,
        [companyId],
      );

      res.status(200).json({ offers: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/industry/offers', requireAuth, recruiter, validateBody(createOfferSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateOfferBody;
      const companyId = user.companyId!;

      const created = await onMissingReference(() =>
        withTransaction(pool, async (client) => {
          let candidateUserId: string | null = null;

          if (body.applicationId) {
            const application = await client.query<{ candidate_user_id: string; company_id: string | null }>(
              'SELECT candidate_user_id, company_id FROM applications WHERE id = $1',
              [body.applicationId],
            );

            if (!application.rows[0] || application.rows[0].company_id !== companyId) {
              throw AppError.notFound('Application not found.', 'application_not_found');
            }

            candidateUserId = application.rows[0].candidate_user_id;
          } else {
            const candidate = await client.query<{ candidate_user_id: string }>(
              `SELECT a.candidate_user_id FROM applications a
               WHERE (a.job_id = $1 OR a.internship_id = $2) AND a.company_id = $3
               ORDER BY a.applied_at DESC LIMIT 1`,
              [body.jobId ?? null, body.internshipId ?? null, companyId],
            );

            if (!candidate.rows[0]) {
              throw AppError.unprocessable(
                'No application exists for that opportunity at your company.',
                'no_application_for_opportunity',
              );
            }

            candidateUserId = candidate.rows[0].candidate_user_id;
          }

          const inserted = await client.query(
            `INSERT INTO offers
               (candidate_user_id, company_id, application_id, job_id, internship_id,
                offer_type, department, location, work_mode, compensation, base_fixed,
                variable_bonus, retention_joining_bonus, benefits_summary, joining_date,
                valid_until, status, authorized_signatory, signatory_title)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
             RETURNING id, candidate_user_id, offer_type, status, joining_date, valid_until`,
            [
              candidateUserId,
              companyId,
              body.applicationId ?? null,
              body.jobId ?? null,
              body.internshipId ?? null,
              body.offerType,
              body.department ?? null,
              body.location ?? null,
              body.workMode,
              body.compensation ?? null,
              body.baseFixed ?? null,
              body.variableBonus ?? null,
              body.retentionJoiningBonus ?? null,
              body.benefitsSummary ?? null,
              body.joiningDate ?? null,
              body.validUntil ?? null,
              body.status,
              body.authorizedSignatory ?? null,
              body.signatoryTitle ?? null,
            ],
          );

          if (body.status !== 'draft') {
            await client.query(
              `INSERT INTO notifications (recipient_user_id, type, title, link, meta)
               VALUES ($1,'offer',$2,'/student/applications',$3)`,
              [
                candidateUserId,
                'You have received a new offer',
                JSON.stringify({ offerId: inserted.rows[0].id }),
              ],
            );
          }

          return inserted.rows[0];
        }),
      );

      logger.info({ userId: user.userId, offerId: created.id }, 'offer created');

      res.status(201).json({ offer: created, requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * Status transitions on an offer. A candidate accepts or declines their own
   * offer; a recruiter may still withdraw or revise a draft.
   */
  router.patch('/api/offers/:id', requireAuth, validateBody(updateOfferSchema), (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const user = req.user!;
      const body = req.body as UpdateOfferBody;

      const owner = await pool.query<{ candidate_user_id: string; company_id: string; status: string }>(
        'SELECT candidate_user_id, company_id, status FROM offers WHERE id = $1',
        [id],
      );

      if (!owner.rows[0]) {
        throw AppError.notFound('Offer not found.', 'offer_not_found');
      }

      const offer = owner.rows[0];
      const isCandidate = offer.candidate_user_id === user.userId;
      const isRecruiter = user.role === 'industry' && user.companyId === offer.company_id;

      if (!isCandidate && !isRecruiter) {
        throw AppError.notFound('Offer not found.', 'offer_not_found');
      }

      // A candidate may only accept or decline. Letting a candidate set an
      // offer back to 'draft' would let them withdraw a company offer.
      if (isCandidate && !isRecruiter && body.status && !['accepted', 'declined'].includes(body.status)) {
        throw AppError.forbidden(
          'You can only accept or decline an offer.',
          'offer_status_not_permitted',
        );
      }

      const updated = await pool.query(
        'UPDATE offers SET status = $2 WHERE id = $1 RETURNING id, status, joining_date, valid_until, updated_at',
        [id, body.status ?? offer.status],
      );

      res.status(200).json({ offer: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}