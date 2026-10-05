import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { buildSlug, onConflict, onMissingReference, readQuery, readUuidParam, requestId } from '../lib/http';
import { withTransaction } from '../db/transaction';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createChallengeSchema,
  createCourseSchema,
  createSubmissionSchema,
  enrollInCourseSchema,
  listChallengesSchema,
  listCoursesSchema,
  updateChallengeSchema,
  updateMaterialProgressSchema,
  updateSubmissionSchema,
  type CreateChallengeBody,
  type CreateCourseBody,
  type CreateSubmissionBody,
  type ListChallengesQuery,
  type ListCoursesQuery,
  type UpdateChallengeBody,
  type UpdateMaterialProgressBody,
  type UpdateSubmissionBody,
} from '../middleware/domainSchemas';

/**
 * Learning (courses, enrolment, per-material progress) and industry challenges
 * with their submissions.
 *
 * Both features were entirely client-side. `/student/learning` derived content
 * from a hardcoded `skillsCatalog*.ts`, and every completion flag lived inside
 * that blob in React state. Challenges and submissions lived in the industry
 * context's `skillsetu_ind_challenges` / `_submissions` localStorage arrays.
 *
 * Course completion is derived on read, as migration 0007 intends, because
 * `course_progress.material_id` is NOT NULL and a stored course-level row would
 * collide under PostgreSQL's NULL-distinct UNIQUE semantics.
 */

export type LearningRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createLearningRouter({ pool, authMiddleware }: LearningRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole } = authMiddleware;

  const learner = requireRole('student', 'college', 'industry');
  const curriculumAdmin = requireRole('admin', 'college');

  router.get('/api/courses', requireAuth, learner, validateQuery(listCoursesSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListCoursesQuery>(res);
      const userId = req.user!.userId;

      const courses = await pool.query(
        `SELECT c.id, c.slug, c.skill_id, c.title, c.description, c.level,
                c.estimated_hours, c.is_published,
                s.name AS skill_name,
                e.id AS enrollment_id, e.status AS enrollment_status, e.enrolled_at,
                (SELECT count(*)::int FROM course_materials m WHERE m.course_id = c.id) AS material_count,
                (SELECT count(*)::int FROM course_progress p
                  WHERE p.course_id = c.id AND p.user_id = $1 AND p.completed) AS completed_count
         FROM courses c
         LEFT JOIN skills s ON s.id = c.skill_id
         LEFT JOIN student_course_enrollments e ON e.course_id = c.id AND e.user_id = $1
         WHERE c.is_published = $2
           AND ($3::uuid IS NULL OR c.skill_id = $3)
         ORDER BY c.title ASC
         LIMIT $4`,
        [userId, query.isPublished, query.skillId ?? null, query.limit],
      );

      const withProgress = courses.rows.map((row) => ({
        ...row,
        progress_percent:
          row.material_count > 0 ? Math.round((row.completed_count / row.material_count) * 100) : 0,
      }));

      res.status(200).json({ courses: withProgress, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/courses/:id', requireAuth, learner, (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const userId = req.user!.userId;

      const course = await pool.query(
        `SELECT c.id, c.slug, c.skill_id, c.title, c.description, c.level,
                c.estimated_hours, c.is_published, s.name AS skill_name,
                e.status AS enrollment_status
         FROM courses c
         LEFT JOIN skills s ON s.id = c.skill_id
         LEFT JOIN student_course_enrollments e ON e.course_id = c.id AND e.user_id = $2
         WHERE c.id = $1`,
        [id, userId],
      );

      if (!course.rows[0]) {
        throw AppError.notFound('Course not found.', 'course_not_found');
      }

      // The per-user completion flag is joined in so the client renders check
      // marks without a second request.
      const materials = await pool.query(
        `SELECT m.id, m.title, m.type, m.position, m.url, m.duration, m.description,
                m.is_published,
                COALESCE(p.completed, false) AS completed
         FROM course_materials m
         LEFT JOIN course_progress p
           ON p.material_id = m.id AND p.course_id = m.course_id AND p.user_id = $2
         WHERE m.course_id = $1
         ORDER BY m.position ASC`,
        [id, userId],
      );

      res.status(200).json({ course: course.rows[0], materials: materials.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/courses', requireAuth, curriculumAdmin, validateBody(createCourseSchema), (req, res, next) => {
    void (async () => {
      const body = req.body as CreateCourseBody;
      const slug = buildSlug(body.title, randomUUID(), body.slug);

      const created = await onConflict(() =>
        withTransaction(pool, async (client) => {
          const inserted = await client.query(
            `INSERT INTO courses (slug, skill_id, title, description, level, estimated_hours, is_published)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING id, slug, title, level, is_published`,
            [
              slug,
              body.skillId ?? null,
              body.title,
              body.description ?? null,
              body.level,
              body.estimatedHours ?? null,
              body.isPublished,
            ],
          );

          const courseId = inserted.rows[0].id;

          // Positions come from array order; the unique (course_id, position)
          // constraint makes a duplicate order a hard error rather than a silent
          // reorder.
          let position = 0;
          for (const material of body.materials) {
            await client.query(
              `INSERT INTO course_materials
                 (course_id, title, type, position, url, duration, description, is_published)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
              [
                courseId,
                material.title,
                material.type,
                position,
                material.url ?? null,
                material.duration ?? null,
                material.description ?? null,
                material.isPublished,
              ],
            );
            position += 1;
          }

          return inserted.rows[0];
        }),
        'A course with that slug already exists.',
        'course_slug_taken',
      );

      logger.info({ courseId: created.id }, 'course created');

      res.status(201).json({ course: created, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/courses/:id/enroll', requireAuth, learner, validateBody(enrollInCourseSchema), (req, res, next) => {
    void (async () => {
      const courseId = readUuidParam(req.params);
      const userId = req.user!.userId;
      const body = req.body as { status: 'enrolled' | 'completed' | 'withdrawn' };

      const enrolled = await onConflict(() =>
        onMissingReference(() =>
          pool.query(
            `INSERT INTO student_course_enrollments (user_id, course_id, status, completed_at)
             VALUES ($1,$2,$3::enrollment_status, CASE WHEN $3 = 'completed' THEN now() ELSE NULL END)
             ON CONFLICT (user_id, course_id) DO UPDATE SET
               status = EXCLUDED.status,
               completed_at = EXCLUDED.completed_at
             RETURNING id, course_id, status, enrolled_at, completed_at`,
            [userId, courseId, body.status],
          ),
        ),
        'You are already enrolled in that course.',
        'already_enrolled',
      );

      res.status(200).json({ enrollment: enrolled.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/courses/:courseId/materials/:materialId/progress', requireAuth, learner, validateBody(updateMaterialProgressSchema), (req, res, next) => {
    void (async () => {
      const courseId = readUuidParam(req.params, 'courseId');
      const materialId = readUuidParam(req.params, 'materialId');
      const userId = req.user!.userId;
      const body = req.body as UpdateMaterialProgressBody;

      // The material must belong to the course in the path, otherwise a caller
      // could record progress against an unrelated course's material.
      const owned = await pool.query(
        'SELECT 1 FROM course_materials WHERE id = $1 AND course_id = $2',
        [materialId, courseId],
      );

      if (!owned.rows[0]) {
        throw AppError.notFound('That material is not part of this course.', 'material_not_in_course');
      }

      const saved = await pool.query(
        `INSERT INTO course_progress (user_id, course_id, material_id, completed)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id, course_id, material_id) DO UPDATE SET
           completed = EXCLUDED.completed,
           last_accessed_at = now()
         RETURNING material_id, completed, last_accessed_at`,
        [userId, courseId, materialId, body.completed],
      );

      const totals = await pool.query<{ total: number; done: number }>(
        `SELECT
           (SELECT count(*)::int FROM course_materials WHERE course_id = $1) AS total,
           (SELECT count(*)::int FROM course_progress
             WHERE user_id = $2 AND course_id = $1 AND completed) AS done`,
        [courseId, userId],
      );

      const total = totals.rows[0]?.total ?? 0;
      const done = totals.rows[0]?.done ?? 0;

      // Enrolment is implicit: completing something enrols the learner, so the
      // frontend never has to make two calls to record progress.
      if (done > 0) {
        await pool.query(
          `INSERT INTO student_course_enrollments (user_id, course_id, status, completed_at)
           VALUES ($1,$2,$3::enrollment_status, CASE WHEN $3 = 'completed' THEN now() ELSE NULL END)
           ON CONFLICT (user_id, course_id) DO NOTHING`,
          [userId, courseId, total > 0 && done >= total ? 'completed' : 'enrolled'],
        );
      }

      res.status(200).json({
        progress: saved.rows[0],
        progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
        requestId: requestId(res),
      });
    })().catch(next);
  });

  return router;
}

/* ------------------------------------------------------------- challenges */

export type ChallengeRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createChallengeRouter({ pool, authMiddleware }: ChallengeRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole, requireOrganization } = authMiddleware;

  const viewer = requireRole('student', 'industry', 'college', 'admin');
  const challenger = requireOrganization('industry');

  router.get('/api/challenges', requireAuth, viewer, validateQuery(listChallengesSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListChallengesQuery>(res);
      // Industry callers are pinned to their own challenges.
      const companyId = req.user!.role === 'industry' ? req.user!.companyId : (query.companyId ?? null);

      const result = await pool.query(
        `SELECT c.id, c.slug, c.company_id, c.title, c.description, c.difficulty, c.status,
                c.deadline, c.team_size, c.prize, c.submission_requirements,
                c.college_participation, c.participants_count, c.submissions_count,
                c.required_skills, c.created_at,
                co.name AS company_name, co.logo_url AS company_logo
         FROM challenges c
         LEFT JOIN companies co ON co.id = c.company_id
         WHERE ($1::challenge_status IS NULL OR c.status = $1)
           AND ($2::uuid IS NULL OR c.company_id = $2)
         ORDER BY c.deadline ASC NULLS LAST, c.created_at DESC
         LIMIT $3 OFFSET $4`,
        [query.status ?? null, companyId, query.limit, query.offset],
      );

      res.status(200).json({ challenges: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/challenges/:id', requireAuth, viewer, (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);

      const challenge = await pool.query(
        `SELECT c.id, c.slug, c.company_id, c.title, c.description, c.problem_statement,
                c.difficulty, c.status, c.deadline, c.team_size, c.prize,
                c.submission_requirements, c.college_participation, c.required_skills,
                c.participants_count, c.submissions_count,
                co.name AS company_name, co.logo_url AS company_logo
         FROM challenges c LEFT JOIN companies co ON co.id = c.company_id
         WHERE c.id = $1`,
        [id],
      );

      if (!challenge.rows[0]) {
        throw AppError.notFound('Challenge not found.', 'challenge_not_found');
      }

      res.status(200).json({ challenge: challenge.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/industry/challenges', requireAuth, challenger, validateBody(createChallengeSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateChallengeBody;
      const slug = buildSlug(body.title, randomUUID(), body.slug);

      const created = await onConflict(() =>
        pool.query(
          `INSERT INTO challenges
             (slug, company_id, title, description, problem_statement, difficulty, status,
              deadline, team_size, prize, submission_requirements, college_participation, required_skills)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
           RETURNING id, slug, title, difficulty, status, deadline`,
          [
            slug,
            user.companyId,
            body.title,
            body.description ?? null,
            body.problemStatement ?? null,
            body.difficulty,
            body.status,
            body.deadline ?? null,
            body.teamSize ?? null,
            body.prize ?? null,
            body.submissionRequirements ?? null,
            body.collegeParticipation ?? null,
            body.requiredSkills,
          ],
        ),
        'A challenge with that slug already exists.',
        'challenge_slug_taken',
      );

      logger.info({ userId: user.userId, challengeId: created.rows[0].id }, 'challenge created');

      res.status(201).json({ challenge: created.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/industry/challenges/:id', requireAuth, challenger, validateBody(updateChallengeSchema), (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const companyId = req.user!.companyId;
      const body = req.body as UpdateChallengeBody;

      const updated = await pool.query(
        `UPDATE challenges SET
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           problem_statement = COALESCE($5, problem_statement),
           difficulty = COALESCE($6, difficulty),
           status = COALESCE($7, status),
           deadline = COALESCE($8, deadline),
           team_size = COALESCE($9, team_size),
           prize = COALESCE($10, prize),
           submission_requirements = COALESCE($11, submission_requirements),
           college_participation = COALESCE($12, college_participation),
           required_skills = COALESCE($13, required_skills)
         WHERE id = $1 AND company_id = $2
         RETURNING id, slug, title, difficulty, status, deadline`,
        [
          id,
          companyId,
          body.title ?? null,
          body.description ?? null,
          body.problemStatement ?? null,
          body.difficulty ?? null,
          body.status ?? null,
          body.deadline ?? null,
          body.teamSize ?? null,
          body.prize ?? null,
          body.submissionRequirements ?? null,
          body.collegeParticipation ?? null,
          body.requiredSkills ?? null,
        ],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('Challenge not found.', 'challenge_not_found');
      }

      res.status(200).json({ challenge: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /* ---------------------------------------------------------- submissions */

  router.get('/api/challenges/:id/submissions', requireAuth, viewer, (req, res, next) => {
    void (async () => {
      const challengeId = readUuidParam(req.params);

      // A student only ever sees their own team's submissions; the challenge
      // owner and admins see all of them.
      const isPrivileged = req.user!.role !== 'student';
      const isOwner =
        isPrivileged &&
        (await pool.query(
          'SELECT 1 FROM challenges WHERE id = $1 AND company_id = $2',
          [challengeId, req.user!.companyId],
        )).rows.length > 0;

      const result = await pool.query(
        `SELECT s.id, s.slug, s.challenge_id, s.team_lead_user_id, s.team_name,
                s.team_lead_name, s.college_id, s.github_url, s.live_demo_url, s.video_url,
                s.score, s.test_pass_rate, s.status, s.skills_demonstrated, s.submitted_at,
                co.name AS college_name, u.display_name AS lead_display_name
         FROM challenge_submissions s
         LEFT JOIN colleges co ON co.id = s.college_id
         LEFT JOIN users u ON u.id = s.team_lead_user_id
         WHERE s.challenge_id = $1
           AND (
             $2::boolean = true
             OR s.team_lead_user_id = $3
           )
         ORDER BY s.submitted_at DESC`,
        [challengeId, isOwner, req.user!.userId],
      );

      res.status(200).json({ submissions: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/challenges/:id/submissions', requireAuth, requireRole('student'), validateBody(createSubmissionSchema), (req, res, next) => {
    void (async () => {
      const challengeId = readUuidParam(req.params);
      const userId = req.user!.userId;
      const body = req.body as CreateSubmissionBody;
      const slug = buildSlug(body.teamName, randomUUID(), body.slug);

      const created = await onConflict(() =>
        withTransaction(pool, async (client) => {
          const inserted = await client.query(
            `INSERT INTO challenge_submissions
               (slug, challenge_id, team_lead_user_id, team_name, team_lead_name,
                college_id, github_url, live_demo_url, video_url, test_pass_rate, skills_demonstrated)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             RETURNING id, slug, challenge_id, team_name, status, submitted_at`,
            [
              slug,
              challengeId,
              userId,
              body.teamName,
              body.teamLeadName ?? req.user!.displayName ?? null,
              // The college is taken from the caller's users row, never from the
              // body, so a student cannot claim another institution.
              body.collegeId ?? null,
              body.githubUrl ?? null,
              body.liveDemoUrl ?? null,
              body.videoUrl ?? null,
              body.testPassRate ?? null,
              body.skillsDemonstrated,
            ],
          );

          // Denormalised counters, as the schema intends.
          await client.query(
            'UPDATE challenges SET submissions_count = (SELECT count(*)::int FROM challenge_submissions WHERE challenge_id = $1) WHERE id = $1',
            [challengeId],
          );

          return inserted.rows[0];
        }),
        'A submission with that slug already exists.',
        'submission_slug_taken',
      );

      logger.info({ userId, submissionId: created.id, challengeId }, 'challenge submitted');

      res.status(201).json({ submission: created, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch(
    '/api/industry/challenges/:challengeId/submissions/:id',
    requireAuth,
    challenger,
    validateBody(updateSubmissionSchema),
    (req, res, next) => {
      void (async () => {
        const challengeId = readUuidParam(req.params, 'challengeId');
        const id = readUuidParam(req.params);
        const companyId = req.user!.companyId;
        const body = req.body as UpdateSubmissionBody;

        // Scoped to the caller's company through the challenge, so one company
        // cannot score another company's challenge.
        const updated = await pool.query(
          `UPDATE challenge_submissions s SET
             status = COALESCE($4, s.status),
             score = COALESCE($5, s.score),
             ai_summary = COALESCE($6, s.ai_summary)
           FROM challenges c
           WHERE s.id = $1 AND s.challenge_id = $2 AND c.id = $2 AND c.company_id = $3
           RETURNING s.id, s.status, s.score, s.ai_summary`,
          [id, challengeId, companyId, body.status ?? null, body.score ?? null, body.aiSummary ?? null],
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Submission not found.', 'submission_not_found');
        }

        res.status(200).json({ submission: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  return router;
}