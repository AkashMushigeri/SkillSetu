import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { onConflict, onMissingReference, readUuidParam, requestId } from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createCertificationSchema,
  createProjectSchema,
  createWorkExperienceSchema,
  updateCertificationSchema,
  updateProjectSchema,
  updateStudentProfileSchema,
  upsertEducationSchema,
  type CreateCertificationBody,
  type CreateProjectBody,
  type CreateWorkExperienceBody,
  type UpdateCertificationBody,
  type UpdateProjectBody,
  type UpdateStudentProfileBody,
  type UpsertEducationBody,
} from '../middleware/domainSchemas';

/**
 * Student-owned profile data: the `student_profiles` row plus the education,
 * project, work-experience and certification children.
 *
 * Everything here is scoped by `req.user.userId`, resolved from the verified
 * Firebase token via users.firebase_uid. No route accepts a user id, so there is
 * no way to address another student's rows.
 *
 * These replace, on the client: `saveUserProfile` (Firestore users/{uid} plus
 * three Data Connect mutations), and the localStorage keys
 * `skillsetu_<uid>_profile`, `_projects` and `_certifications`.
 */

export type StudentRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

const PROFILE_COLUMNS = `
  usn, degree, department, academic_year, cgpa, career_goal, bio,
  github_url, linkedin_url, portfolio_url, location, city, state, country,
  latitude, longitude, profile_completion
`;

/**
 * Completion is computed server-side from what is actually stored rather than
 * accepted from the client. The client previously derived it from local state,
 * which meant a value persisted into Firebase could disagree with the profile
 * it described.
 */
const COMPLETION_WEIGHTS: { column: string; weight: number }[] = [
  { column: 'degree', weight: 10 },
  { column: 'department', weight: 10 },
  { column: 'academic_year', weight: 10 },
  { column: 'cgpa', weight: 10 },
  { column: 'career_goal', weight: 15 },
  { column: 'bio', weight: 15 },
  { column: 'github_url', weight: 10 },
  { column: 'linkedin_url', weight: 10 },
  { column: 'location', weight: 10 },
];

async function computeProfileCompletion(
  pool: Pool,
  userId: string,
): Promise<number> {
  const profile = await pool.query<Record<string, unknown>>(
    `SELECT ${PROFILE_COLUMNS} FROM student_profiles WHERE user_id = $1`,
    [userId],
  );

  const row = profile.rows[0];

  if (!row) {
    return 0;
  }

  let earned = 0;

  for (const { column, weight } of COMPLETION_WEIGHTS) {
    const value = row[column];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      earned += weight;
    }
  }

  const education = await pool.query<{ present: number }>(
    'SELECT count(*)::int AS present FROM education_records WHERE user_id = $1',
    [userId],
  );

  const projects = await pool.query<{ present: number }>(
    'SELECT count(*)::int AS present FROM projects WHERE user_id = $1',
    [userId],
  );

  if ((education.rows[0]?.present ?? 0) > 0) {
    earned += 10;
  }
  if ((projects.rows[0]?.present ?? 0) > 0) {
    earned += 10;
  }

  // The weights above intentionally sum above 100 so a complete profile lands
  // exactly on 100 rather than needing a final clamp to look correct.
  return Math.min(100, earned);
}

/**
 * Guarantees the `student_profiles` row exists before a completion rewrite.
 *
 * Without this, a student who creates their first project before ever opening the
 * profile page would get an UPDATE that matched zero rows, so `profile_completion`
 * would silently stay at its default while the read path reported the computed
 * value. The two would then disagree depending on which request the client made.
 */
async function ensureProfileRow(pool: Pool, userId: string): Promise<void> {
  await pool.query(
    `INSERT INTO student_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
    [userId],
  );
}

/** Recomputes completion and persists it, creating the profile row if needed. */
async function refreshProfileCompletion(pool: Pool, userId: string): Promise<void> {
  await ensureProfileRow(pool, userId);
  await pool.query('UPDATE student_profiles SET profile_completion = $1 WHERE user_id = $2', [
    await computeProfileCompletion(pool, userId),
    userId,
  ]);
}

export function createStudentRouter({ pool, authMiddleware }: StudentRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole } = authMiddleware;

  /**
   * GET /api/student/profile
   *
   * Creates the student_profiles row on first read so the caller always gets a
   * consistent shape instead of a 404 that the frontend has to special-case.
   */
  router.get('/api/student/profile', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const result = await onMissingReference(() =>
        pool.query(
          `INSERT INTO student_profiles (user_id) VALUES ($1)
           ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
           RETURNING ${PROFILE_COLUMNS}`,
          [userId],
        ),
      );

      const completion = await computeProfileCompletion(pool, userId);

      if (completion !== result.rows[0]?.profile_completion) {
        await pool.query(
          'UPDATE student_profiles SET profile_completion = $1 WHERE user_id = $2',
          [completion, userId],
        );
      }

      const education = await pool.query(
        `SELECT id, level, institution_name, degree, department, course, board,
                academic_year, score, score_text, created_at
         FROM education_records WHERE user_id = $1 ORDER BY level`,
        [userId],
      );

      const projects = await pool.query(
        `SELECT id, title, description, tech_stack, github_url, live_url, created_at
         FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );

      const experiences = await pool.query(
        `SELECT id, title, company, location, start_date, end_date, is_current, description
         FROM work_experiences WHERE user_id = $1
         ORDER BY start_date DESC NULLS LAST`,
        [userId],
      );

      const certifications = await pool.query(
        `SELECT id, title, issuer, issue_date, expiry_date, credential_id,
                credential_url, file_name, file_type, uploaded_at
         FROM certifications WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );

      res.status(200).json({
        userId,
        profile: { ...result.rows[0], profile_completion: completion },
        education: education.rows,
        projects: projects.rows,
        experiences: experiences.rows,
        certifications: certifications.rows,
        requestId: requestId(res),
      });
    })().catch(next);
  });

  /** PATCH /api/student/profile */
  router.patch('/api/student/profile', requireAuth, requireRole('student'), validateBody(updateStudentProfileSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as UpdateStudentProfileBody;

      // An explicit null clears a column; an absent key leaves it alone. That
      // distinction is why this cannot be a blanket "upsert everything" and is
      // built from the keys the client actually sent.
      const columns: Record<string, string> = {
        degree: 'degree',
        department: 'department',
        academicYear: 'academic_year',
        cgpa: 'cgpa',
        careerGoal: 'career_goal',
        bio: 'bio',
        githubUrl: 'github_url',
        linkedinUrl: 'linkedin_url',
        portfolioUrl: 'portfolio_url',
        location: 'location',
        city: 'city',
        state: 'state',
        country: 'country',
        latitude: 'latitude',
        longitude: 'longitude',
        usn: 'usn',
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

      // display_name and phone live on `users`, not `student_profiles`.
      const userSets: string[] = [];
      const userValues: unknown[] = [];

      if ('displayName' in body) {
        userValues.push(body.displayName ?? null);
        userSets.push(`display_name = $${userValues.length}`);
      }
      if ('phone' in body) {
        userValues.push(body.phone ?? null);
        userSets.push(`phone = $${userValues.length}`);
      }

      await pool.query(
        `INSERT INTO student_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [userId],
      );

      if (sets.length > 0) {
        values.push(userId);
        await pool.query(
          `UPDATE student_profiles SET ${sets.join(', ')} WHERE user_id = $${values.length}`,
          values,
        );
      }

      if (userSets.length > 0) {
        userValues.push(userId);
        await pool.query(`UPDATE users SET ${userSets.join(', ')} WHERE id = $${userValues.length}`, userValues);
      }

      const completion = await computeProfileCompletion(pool, userId);
      const updated = await pool.query(
        `UPDATE student_profiles SET profile_completion = $1 WHERE user_id = $2 RETURNING ${PROFILE_COLUMNS}`,
        [completion, userId],
      );

      logger.info({ userId, fields: Object.keys(body).length }, 'student profile updated');

      res.status(200).json({
        userId,
        profile: updated.rows[0],
        requestId: requestId(res),
      });
    })().catch(next);
  });

  /** PUT /api/student/education — one row per level, so this upserts. */
  router.put('/api/student/education', requireAuth, requireRole('student'), validateBody(upsertEducationSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as UpsertEducationBody;

      await onConflict(
        () =>
          pool.query(
            `INSERT INTO education_records
               (user_id, level, institution_name, degree, department, course, board,
                academic_year, score, score_text)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (user_id, level) DO UPDATE SET
               institution_name = EXCLUDED.institution_name,
               degree = EXCLUDED.degree,
               department = EXCLUDED.department,
               course = EXCLUDED.course,
               board = EXCLUDED.board,
               academic_year = EXCLUDED.academic_year,
               score = EXCLUDED.score,
               score_text = EXCLUDED.score_text
             RETURNING id, level, institution_name, degree, department, course, board,
                       academic_year, score, score_text`,
            [
              userId,
              body.level,
              body.institutionName,
              body.degree ?? null,
              body.department ?? null,
              body.course ?? null,
              body.board ?? null,
              body.academicYear ?? null,
              body.score ?? null,
              body.scoreText ?? null,
            ],
          ),
        'You already have an education record for that level.',
        'education_level_exists',
      );

      await refreshProfileCompletion(pool, userId);

      res.status(200).json({ userId, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/student/projects', requireAuth, requireRole('student'), validateBody(createProjectSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as CreateProjectBody;

      const inserted = await pool.query(
        `INSERT INTO projects (user_id, title, description, tech_stack, github_url, live_url)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id, title, description, tech_stack, github_url, live_url, created_at`,
        [
          userId,
          body.title,
          body.description ?? null,
          body.techStack,
          body.githubUrl ?? null,
          body.liveUrl ?? null,
        ],
      );

      await refreshProfileCompletion(pool, userId);

      res.status(201).json({ project: inserted.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/student/projects/:id', requireAuth, requireRole('student'), validateBody(updateProjectSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const id = readUuidParam(req.params);
      const body = req.body as UpdateProjectBody;

      const updated = await pool.query(
        `UPDATE projects SET
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           tech_stack = COALESCE($5, tech_stack),
           github_url = COALESCE($6, github_url),
           live_url = COALESCE($7, live_url)
         WHERE id = $1 AND user_id = $2
         RETURNING id, title, description, tech_stack, github_url, live_url, created_at`,
        [
          id,
          userId,
          body.title ?? null,
          body.description ?? null,
          body.techStack ?? null,
          body.githubUrl ?? null,
          body.liveUrl ?? null,
        ],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('Project not found.', 'project_not_found');
      }

      res.status(200).json({ project: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * The WHERE clause is `id AND user_id`, so another student's project id yields
   * a 404 rather than disclosing that the row exists.
   */
  router.delete('/api/student/projects/:id', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const id = readUuidParam(req.params);

      const deleted = await pool.query(
        'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Project not found.', 'project_not_found');
      }

      await refreshProfileCompletion(pool, userId);

      res.status(204).end();
    })().catch(next);
  });

  /**
   * POST /api/student/certifications
   *
   * Metadata only. The client used to inline a base64 PDF into the profile blob;
   * certifications.file_data/file_size still allow that, but accepting a 5 MB
   * string in a JSON body is a separate transport decision and is out of scope
   * for this migration.
   */
  router.post('/api/student/certifications', requireAuth, requireRole('student'), validateBody(createCertificationSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as CreateCertificationBody;

      const inserted = await onMissingReference(() =>
        pool.query(
          `INSERT INTO certifications
             (user_id, title, issuer, issue_date, expiry_date, credential_id, credential_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           RETURNING id, title, issuer, issue_date, expiry_date, credential_id, credential_url, created_at`,
          [
            userId,
            body.title,
            body.issuer ?? null,
            body.issueDate ?? null,
            body.expiryDate ?? null,
            body.credentialId ?? null,
            body.credentialUrl ?? null,
          ],
        ),
      );

      res.status(201).json({ certification: inserted.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/student/certifications/:id', requireAuth, requireRole('student'), validateBody(updateCertificationSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const id = readUuidParam(req.params);
      const body = req.body as UpdateCertificationBody;

      const updated = await onMissingReference(() =>
        pool.query(
          `UPDATE certifications SET
             title = COALESCE($3, title),
             issuer = COALESCE($4, issuer),
             issue_date = COALESCE($5, issue_date),
             expiry_date = COALESCE($6, expiry_date),
             credential_id = COALESCE($7, credential_id),
             credential_url = COALESCE($8, credential_url)
           WHERE id = $1 AND user_id = $2
           RETURNING id, title, issuer, issue_date, expiry_date, credential_id, credential_url, created_at`,
          [
            id,
            userId,
            body.title ?? null,
            body.issuer ?? null,
            body.issueDate ?? null,
            body.expiryDate ?? null,
            body.credentialId ?? null,
            body.credentialUrl ?? null,
          ],
        ),
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('Certification not found.', 'certification_not_found');
      }

      res.status(200).json({ certification: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.delete('/api/student/certifications/:id', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const id = readUuidParam(req.params);

      const deleted = await pool.query(
        'DELETE FROM certifications WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Certification not found.', 'certification_not_found');
      }

      res.status(204).end();
    })().catch(next);
  });

  /** POST /api/student/work-experiences */
  router.post(
    '/api/student/work-experiences',
    requireAuth,
    requireRole('student'),
    validateBody(createWorkExperienceSchema),
    (req, res, next) => {
      void (async () => {
        const userId = req.user!.userId;
        const body = req.body as CreateWorkExperienceBody;

        const inserted = await onMissingReference(() =>
          pool.query(
            `INSERT INTO work_experiences
               (user_id, title, company, location, start_date, end_date, is_current, description)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING id, title, company, location, start_date, end_date, is_current, description`,
            [
              userId,
              body.title,
              body.company ?? null,
              body.location ?? null,
              body.startDate ?? null,
              body.endDate ?? null,
              body.isCurrent,
              body.description ?? null,
            ],
          ),
        );

        res.status(201).json({ experience: inserted.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.delete('/api/student/work-experiences/:id', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const id = readUuidParam(req.params);

      const deleted = await pool.query(
        'DELETE FROM work_experiences WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Work experience not found.', 'work_experience_not_found');
      }

      res.status(204).end();
    })().catch(next);
  });

  return router;
}