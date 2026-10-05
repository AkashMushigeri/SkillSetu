import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Pool, PoolClient } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { buildSlug, onConflict, onMissingReference, readQuery, readUuidParam, requestId } from '../lib/http';
import { withTransaction } from '../db/transaction';
import type { AuthMiddleware, TrustedUser } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createInternshipSchema,
  createJobSchema,
  listOpportunitiesSchema,
  updateInternshipSchema,
  updateJobSchema,
  type CreateInternshipBody,
  type CreateJobBody,
  type ListOpportunitiesQuery,
  type UpdateInternshipBody,
  type UpdateJobBody,
} from '../middleware/domainSchemas';

/**
 * Jobs and internships, which the client called "opportunities".
 *
 * Replaces the Data Connect reads `listJobs` / `listInternships` and the writes
 * `createJob` / `createInternship`, all of which went through
 * `src/lib/dataConnectService.ts`.
 *
 * Read access is open to any active account because the student portal browses
 * opportunities. Write access is industry-only and always writes
 * `req.user.companyId`; there is no route that accepts a company id, so a
 * recruiter cannot post a job under another tenant.
 */

export type OpportunityRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

const JOB_SELECT = `
  j.id, j.slug, j.company_id, j.title, j.department, j.location, j.city, j.state, j.country,
  j.work_mode, j.employment_type, j.salary_range, j.experience_required,
  j.education_required, j.graduation_year, j.minimum_cgpa, j.description,
  j.responsibilities, j.qualifications, j.openings, j.deadline, j.status, j.posted_at, j.created_at
`;

const INTERNSHIP_SELECT = `
  i.id, i.slug, i.company_id, i.title, i.department, i.location, i.city, i.state, i.country,
  i.work_mode, i.duration, i.stipend, i.eligibility, i.start_date, i.application_deadline,
  i.description, i.learning_outcomes, i.mentor, i.target_audience, i.openings,
  i.is_startup_friendly, i.eligible_for_conversion, i.status, i.posted_at, i.created_at
`;

/**
 * Replaces the required-skill join rows in one transaction with the parent row,
 * so a job never exists without its skills or vice versa.
 */
async function replaceRequiredSkills(
  client: PoolClient,
  table: 'job_required_skills' | 'internship_required_skills',
  fkColumn: 'job_id' | 'internship_id',
  parentId: string,
  required: { skillId: string; level: string; importance: string; minScore?: number | null }[],
): Promise<void> {
  await client.query(`DELETE FROM ${table} WHERE ${fkColumn} = $1`, [parentId]);

  for (const entry of required) {
    await client.query(
      `INSERT INTO ${table} (${fkColumn}, skill_id, level, importance, min_score)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (${fkColumn}, skill_id) DO UPDATE SET
         level = EXCLUDED.level,
         importance = EXCLUDED.importance,
         min_score = EXCLUDED.min_score`,
      [parentId, entry.skillId, entry.level, entry.importance, entry.minScore ?? null],
    );
  }
}

async function loadJobSkills(pool: Pool, jobId: string) {
  const result = await pool.query(
    `SELECT jrs.skill_id, s.name AS skill_name, s.slug AS skill_slug,
            jrs.level, jrs.importance, jrs.min_score
     FROM job_required_skills jrs
     JOIN skills s ON s.id = jrs.skill_id
     WHERE jrs.job_id = $1
     ORDER BY jrs.importance, s.name`,
    [jobId],
  );
  return result.rows;
}

async function loadInternshipSkills(pool: Pool, internshipId: string) {
  const result = await pool.query(
    `SELECT irs.skill_id, s.name AS skill_name, s.slug AS skill_slug,
            irs.level, irs.importance, irs.min_score
     FROM internship_required_skills irs
     JOIN skills s ON s.id = irs.skill_id
     WHERE irs.internship_id = $1
     ORDER BY irs.importance, s.name`,
    [internshipId],
  );
  return result.rows;
}

/**
 * A company filter coming from an industry caller is replaced with their own
 * company id. Without this a recruiter could read another tenant's postings by
 * passing ?companyId=, because listing is otherwise open to every account.
 */
function resolveCompanyFilter(user: TrustedUser, requested?: string): string | null {
  if (user.role === 'industry') {
    return user.companyId;
  }
  return requested ?? null;
}

export function createOpportunityRouter({ pool, authMiddleware }: OpportunityRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole, requireOrganization } = authMiddleware;

  const anyPortal = requireRole('student', 'industry', 'college', 'admin');
  const recruiter = requireOrganization('industry');

  /* ------------------------------------------------------------- listings */

  router.get('/api/opportunities', requireAuth, anyPortal, validateQuery(listOpportunitiesSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListOpportunitiesQuery>(res);
      const companyId = resolveCompanyFilter(req.user!, query.companyId);

      const jobs = await pool.query(
        `SELECT ${JOB_SELECT}, c.name AS company_name, c.logo_url AS company_logo
         FROM jobs j
         JOIN companies c ON c.id = j.company_id
         WHERE j.status = $1
           AND ($2::uuid IS NULL OR j.company_id = $2)
           AND ($3::text IS NULL OR j.city ILIKE $3)
           AND ($4::work_mode IS NULL OR j.work_mode = $4)
           AND ($5::text IS NULL OR j.title ILIKE '%' || $5 || '%')
         ORDER BY j.posted_at DESC NULLS LAST, j.created_at DESC
         LIMIT $6 OFFSET $7`,
        [query.status, companyId, query.city ?? null, query.workMode ?? null, query.search ?? null, query.limit, query.offset],
      );

      const internships = await pool.query(
        `SELECT ${INTERNSHIP_SELECT}, c.name AS company_name, c.logo_url AS company_logo
         FROM internships i
         JOIN companies c ON c.id = i.company_id
         WHERE i.status = $1
           AND ($2::uuid IS NULL OR i.company_id = $2)
           AND ($3::text IS NULL OR i.city ILIKE $3)
           AND ($4::work_mode IS NULL OR i.work_mode = $4)
           AND ($5::text IS NULL OR i.title ILIKE '%' || $5 || '%')
         ORDER BY i.posted_at DESC NULLS LAST, i.created_at DESC
         LIMIT $6 OFFSET $7`,
        [query.status, companyId, query.city ?? null, query.workMode ?? null, query.search ?? null, query.limit, query.offset],
      );

      res.status(200).json({
        jobs: jobs.rows,
        internships: internships.rows,
        requestId: requestId(res),
      });
    })().catch(next);
  });

  router.get('/api/opportunities/jobs/:id', requireAuth, anyPortal, (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);

      const job = await pool.query(
        `SELECT ${JOB_SELECT}, c.name AS company_name, c.logo_url AS company_logo,
                c.about AS company_about, c.industry AS company_industry
         FROM jobs j JOIN companies c ON c.id = j.company_id
         WHERE j.id = $1`,
        [id],
      );

      if (!job.rows[0]) {
        throw AppError.notFound('Job not found.', 'job_not_found');
      }

      const requiredSkills = await loadJobSkills(pool, id);

      // The candidate's own match is per-user, so it is computed on read rather
      // than stored on the job.
      let myMatch = null;
      if (req.user!.role === 'student') {
        const match = await pool.query(
          'SELECT match_score, matched_skills, missing_skills, explanation FROM job_matches WHERE user_id = $1 AND job_id = $2',
          [req.user!.userId, id],
        );
        myMatch = match.rows[0] ?? null;
      }

      res.status(200).json({ job: job.rows[0], requiredSkills, myMatch, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/opportunities/internships/:id', requireAuth, anyPortal, (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);

      const internship = await pool.query(
        `SELECT ${INTERNSHIP_SELECT}, c.name AS company_name, c.logo_url AS company_logo,
                c.about AS company_about, c.industry AS company_industry
         FROM internships i JOIN companies c ON c.id = i.company_id
         WHERE i.id = $1`,
        [id],
      );

      if (!internship.rows[0]) {
        throw AppError.notFound('Internship not found.', 'internship_not_found');
      }

      const requiredSkills = await loadInternshipSkills(pool, id);

      res.status(200).json({ internship: internship.rows[0], requiredSkills, requestId: requestId(res) });
    })().catch(next);
  });

  /* ------------------------------------------------------- job publishing */

  router.post('/api/industry/jobs', requireAuth, recruiter, validateBody(createJobSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateJobBody;
      const companyId = user.companyId!;
      const suffix = randomUUID();
      const slug = buildSlug(body.title, suffix, body.slug);

      const outcome = await onMissingReference(() =>
        onConflict(() =>
          withTransaction(pool, async (client) => {
            const inserted = await client.query(
              `INSERT INTO jobs
               (slug, company_id, title, department, location, city, state, country, work_mode,
                employment_type, salary_range, experience_required, education_required,
                graduation_year, minimum_cgpa, description, responsibilities, qualifications,
                openings, deadline, status, posted_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
               RETURNING id, slug, title, status, created_at`,
            [
              slug,
              companyId,
              body.title,
              body.department ?? null,
              body.location ?? null,
              body.city ?? null,
              body.state ?? null,
              // countries.country is NOT NULL DEFAULT 'India'; sending an explicit
              // NULL would override that default and fail the insert.
              body.country ?? 'India',
              body.workMode,
              body.employmentType,
              body.salaryRange ?? null,
              body.experienceRequired ?? null,
              body.educationRequired ?? null,
              body.graduationYear ?? null,
              body.minimumCgpa ?? null,
              body.description ?? null,
              body.responsibilities,
              body.qualifications,
              body.openings,
              body.deadline ?? null,
              body.status,
              // posted_at is set when it first becomes visible, not on a draft.
              body.status === 'active' ? new Date() : null,
            ],
          );

            await replaceRequiredSkills(client, 'job_required_skills', 'job_id', inserted.rows[0].id, body.requiredSkills);

            return inserted.rows[0];
          }),
          'A job with that slug already exists.',
          'job_slug_taken',
        ),
      );

      logger.info({ userId: user.userId, companyId, jobId: outcome.id }, 'job posted');

      res.status(201).json({ job: outcome, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/industry/jobs/:id', requireAuth, recruiter, validateBody(updateJobSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const id = readUuidParam(req.params);
      const body = req.body as UpdateJobBody;

      const updated = await onMissingReference(() =>
        withTransaction(pool, async (client) => {
          // company_id in the WHERE is the tenant check: a recruiter editing a
          // job id they do not own gets 404, not a silent no-op.
          const result = await client.query(
            `UPDATE jobs SET
               title = COALESCE($3, title),
               department = COALESCE($4, department),
               location = COALESCE($5, location),
               city = COALESCE($6, city),
               state = COALESCE($7, state),
               work_mode = COALESCE($8, work_mode),
               employment_type = COALESCE($9, employment_type),
               salary_range = COALESCE($10, salary_range),
               experience_required = COALESCE($11, experience_required),
               education_required = COALESCE($12, education_required),
               graduation_year = COALESCE($13, graduation_year),
               minimum_cgpa = COALESCE($14, minimum_cgpa),
               description = COALESCE($15, description),
               responsibilities = COALESCE($16, responsibilities),
               qualifications = COALESCE($17, qualifications),
               openings = COALESCE($18, openings),
               deadline = COALESCE($19, deadline),
               status = COALESCE($20, status),
               posted_at = CASE WHEN $20 = 'active' AND posted_at IS NULL THEN now() ELSE posted_at END
             WHERE id = $1 AND company_id = $2
             RETURNING id, slug, title, status, posted_at, created_at`,
            [
              id,
              user.companyId,
              body.title ?? null,
              body.department ?? null,
              body.location ?? null,
              body.city ?? null,
              body.state ?? null,
              body.workMode ?? null,
              body.employmentType ?? null,
              body.salaryRange ?? null,
              body.experienceRequired ?? null,
              body.educationRequired ?? null,
              body.graduationYear ?? null,
              body.minimumCgpa ?? null,
              body.description ?? null,
              body.responsibilities ?? null,
              body.qualifications ?? null,
              body.openings ?? null,
              body.deadline ?? null,
              body.status ?? null,
            ],
          );

          if (!result.rows[0]) {
            throw AppError.notFound('Job not found.', 'job_not_found');
          }

          if (body.requiredSkills) {
            await replaceRequiredSkills(client, 'job_required_skills', 'job_id', id, body.requiredSkills);
          }

          return result.rows[0];
        }),
      );

      res.status(200).json({ job: updated, requestId: requestId(res) });
    })().catch(next);
  });

  /* ------------------------------------------------ internship publishing */

  router.post('/api/industry/internships', requireAuth, recruiter, validateBody(createInternshipSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateInternshipBody;
      const companyId = user.companyId!;
      const slug = buildSlug(body.title, randomUUID(), body.slug);

      const outcome = await onMissingReference(() =>
        onConflict(() =>
          withTransaction(pool, async (client) => {
            const inserted = await client.query(
            `INSERT INTO internships
               (slug, company_id, title, department, location, city, state, country, work_mode,
                duration, stipend, eligibility, start_date, application_deadline, description,
                learning_outcomes, mentor, target_audience, openings, is_startup_friendly,
                eligible_for_conversion, status, posted_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
               RETURNING id, slug, title, status, created_at`,
            [
              slug,
              companyId,
              body.title,
              body.department ?? null,
              body.location ?? null,
              body.city ?? null,
              body.state ?? null,
              body.country ?? 'India',
              body.workMode,
              body.duration ?? null,
              body.stipend ?? null,
              body.eligibility ?? null,
              body.startDate ?? null,
              body.applicationDeadline ?? null,
              body.description ?? null,
              body.learningOutcomes,
              body.mentor ?? null,
              body.targetAudience ?? null,
              body.openings,
              body.isStartupFriendly,
              body.eligibleForConversion,
              body.status,
              body.status === 'active' ? new Date() : null,
            ],
          );

            await replaceRequiredSkills(
              client,
              'internship_required_skills',
              'internship_id',
              inserted.rows[0].id,
              body.requiredSkills,
            );

            return inserted.rows[0];
          }),
          'An internship with that slug already exists.',
          'internship_slug_taken',
        ),
      );

      logger.info({ userId: user.userId, companyId, internshipId: outcome.id }, 'internship posted');

      res.status(201).json({ internship: outcome, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/industry/internships/:id', requireAuth, recruiter, validateBody(updateInternshipSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const id = readUuidParam(req.params);
      const body = req.body as UpdateInternshipBody;

      const updated = await onMissingReference(() =>
        withTransaction(pool, async (client) => {
          const result = await client.query(
            `UPDATE internships SET
               title = COALESCE($3, title),
               department = COALESCE($4, department),
               location = COALESCE($5, location),
               city = COALESCE($6, city),
               state = COALESCE($7, state),
               work_mode = COALESCE($8, work_mode),
               duration = COALESCE($9, duration),
               stipend = COALESCE($10, stipend),
               eligibility = COALESCE($11, eligibility),
               start_date = COALESCE($12, start_date),
               application_deadline = COALESCE($13, application_deadline),
               description = COALESCE($14, description),
               learning_outcomes = COALESCE($15, learning_outcomes),
               mentor = COALESCE($16, mentor),
               target_audience = COALESCE($17, target_audience),
               openings = COALESCE($18, openings),
               is_startup_friendly = COALESCE($19, is_startup_friendly),
               eligible_for_conversion = COALESCE($20, eligible_for_conversion),
               status = COALESCE($21, status),
               posted_at = CASE WHEN $21 = 'active' AND posted_at IS NULL THEN now() ELSE posted_at END
             WHERE id = $1 AND company_id = $2
             RETURNING id, slug, title, status, posted_at, created_at`,
            [
              id,
              user.companyId,
              body.title ?? null,
              body.department ?? null,
              body.location ?? null,
              body.city ?? null,
              body.state ?? null,
              body.workMode ?? null,
              body.duration ?? null,
              body.stipend ?? null,
              body.eligibility ?? null,
              body.startDate ?? null,
              body.applicationDeadline ?? null,
              body.description ?? null,
              body.learningOutcomes ?? null,
              body.mentor ?? null,
              body.targetAudience ?? null,
              body.openings ?? null,
              body.isStartupFriendly ?? null,
              body.eligibleForConversion ?? null,
              body.status ?? null,
            ],
          );

          if (!result.rows[0]) {
            throw AppError.notFound('Internship not found.', 'internship_not_found');
          }

          if (body.requiredSkills) {
            await replaceRequiredSkills(client, 'internship_required_skills', 'internship_id', id, body.requiredSkills);
          }

          return result.rows[0];
        }),
      );

      res.status(200).json({ internship: updated, requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}