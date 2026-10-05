import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { onMissingReference, readUuidParam, requestId } from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createUserSkillSchema,
  updateMaterialProgressSchema,
  updateUserSkillSchema,
  verifyUserSkillSchema,
  type CreateUserSkillBody,
  type UpdateUserSkillBody,
  type UpdateMaterialProgressBody,
  type VerifyUserSkillBody,
} from '../middleware/domainSchemas';

/**
 * Skill catalogue and per-user skill rows.
 *
 * Replaces the Data Connect `CreateSkill` loop in `saveUserProfile` (which
 * created a throwaway catalogue row per profile save), the unused
 * `UpsertUserSkill`, and the localStorage `skillsetu_<uid>_skills` array that
 * held `isVerified` and progress.
 *
 * The catalogue is reference data, so reading it is open to any active account.
 * Writes to `user_skills` are strictly the caller's own rows.
 */

export type SkillRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createSkillRouter({ pool, authMiddleware }: SkillRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole } = authMiddleware;

  router.get('/api/skills', requireAuth, requireRole('student', 'industry', 'college'), (req, res, next) => {
    void (async () => {
      const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      const limit = Math.min(Number(req.query.limit) || 100, 200);

      // ILIKE with an escaped pattern, never string interpolation.
      const result = await pool.query(
        `SELECT id, slug, name, tier, category, icon, description, estimated_time,
                learning_objectives, career_roles, aliases, related_skills
         FROM skills
         WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR slug ILIKE '%' || $1 || '%')
         ORDER BY name ASC
         LIMIT $2`,
        [query, limit],
      );

      res.status(200).json({ skills: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/skills/:id', requireAuth, requireRole('student', 'industry', 'college'), (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);

      const skill = await pool.query(
        `SELECT id, slug, name, tier, category, icon, description, estimated_time,
                learning_objectives, career_roles, aliases, related_skills
         FROM skills WHERE id = $1`,
        [id],
      );

      if (!skill.rows[0]) {
        throw AppError.notFound('Skill not found.', 'skill_not_found');
      }

      const resources = await pool.query(
          `SELECT id, source_id, title, type, duration, url, topic, description, position
         FROM skill_resources WHERE skill_id = $1 ORDER BY position`,
          [id],
        );

      res.status(200).json({ skill: skill.rows[0], resources: resources.rows, requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * GET /api/student/skills
   *
   * Returns the caller's `user_skills` rows joined to the catalogue, so the
   * frontend gets both the shared description and the per-user progress and
   * verification state in one round trip.
   *
   * Learning materials are aggregated in the same query, each carrying the
   * caller's own completion flag. They used to be omitted here, which left the
   * skill detail page with an empty resource list after a refresh: the static
   * catalogue only supplies `completed: false` defaults, so a ticked material
   * had to come from somewhere real, and this is that place. A left join keeps
   * untouched materials in the list instead of dropping them.
   */
  router.get('/api/student/skills', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT s.id AS skill_id, s.slug, s.name, s.tier, s.category, s.icon, s.description,
                s.learning_objectives, s.career_roles,
                us.progress, us.learning_status, us.assessment_status, us.is_verified,
                us.verified_at, us.verification_type, us.verified_level,
                us.evidence_source, us.best_score, us.assessment_strengths,
                us.assessment_improvements, us.created_at AS added_at,
                COALESCE(resources.aggregate, '[]'::json) AS resources
         FROM user_skills us
         JOIN skills s ON s.id = us.skill_id
         LEFT JOIN LATERAL (
           SELECT json_agg(
                    json_build_object(
                      -- The client sends this value back to the progress
                      -- endpoint, which accepts either form. Prefer the
                      -- catalogue source_id so it matches the static
                      -- catalogue's own resource ids, and fall back to the UUID
                      -- for rows seeded before migration 0014.
                      'id', COALESCE(r.source_id, r.id::text),
                      'uuid', r.id,
                      'title', r.title,
                      'type', r.type,
                      'duration', r.duration,
                      'url', r.url,
                      'topic', r.topic,
                      'position', r.position,
                      'completed', COALESCE(rp.completed, false)
                    ) ORDER BY r.position
                  ) AS aggregate
           FROM skill_resources r
           LEFT JOIN skill_resource_progress rp
             ON rp.resource_id = r.id AND rp.user_id = $1
           WHERE r.skill_id = s.id
         ) resources ON true
         WHERE us.user_id = $1
         ORDER BY us.is_verified DESC, s.name ASC`,
        [userId],
      );

      res.status(200).json({ skills: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/student/skills', requireAuth, requireRole('student'), validateBody(createUserSkillSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const body = req.body as CreateUserSkillBody;

      const inserted = await onMissingReference(async () => {
        try {
          return await pool.query(
            `INSERT INTO user_skills (user_id, skill_id, progress, learning_status)
             VALUES ($1,$2,$3,$4)
             ON CONFLICT (user_id, skill_id) DO NOTHING
             RETURNING skill_id, progress, learning_status`,
            [userId, body.skillId, body.progress ?? 0, body.learningStatus ?? 'not_started'],
          );
        } catch (error) {
          if ((error as { code?: string }).code === '23505') {
            throw AppError.conflict('That skill is already on your profile.', 'skill_already_added');
          }
          throw error;
        }
      });

      if (!inserted.rows[0]) {
        throw AppError.conflict('That skill is already on your profile.', 'skill_already_added');
      }

      res.status(201).json({ skill: inserted.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/student/skills/:id', requireAuth, requireRole('student'), validateBody(updateUserSkillSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const skillId = readUuidParam(req.params);
      const body = req.body as UpdateUserSkillBody;

      const updated = await pool.query(
        `UPDATE user_skills SET
           progress = COALESCE($3, progress),
           learning_status = COALESCE($4, learning_status),
           assessment_status = COALESCE($5, assessment_status),
           best_score = COALESCE($6, best_score)
         WHERE user_id = $1 AND skill_id = $2
         RETURNING skill_id, progress, learning_status, assessment_status, best_score`,
        [userId, skillId, body.progress ?? null, body.learningStatus ?? null, body.assessmentStatus ?? null, body.bestScore ?? null],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('That skill is not on your profile.', 'user_skill_not_found');
      }

      res.status(200).json({ skill: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * POST /api/student/skills/:id/verify
   *
   * Marks the skill verified. Note this is the *recorder*, not the decider:
   * it records a verification type the caller asserts. A future assessment
   * result is what should drive `assessment_verified`; nothing here computes a
   * score or grants verification on a student's behalf without an asserted
   * source.
   *
   * The CHECK user_skills_verified_fields_consistent requires verified_at and
   * verification_type together, so both are always written in one statement.
   */
  router.post('/api/student/skills/:id/verify', requireAuth, requireRole('student'), validateBody(verifyUserSkillSchema), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const skillId = readUuidParam(req.params);
      const body = req.body as VerifyUserSkillBody;

      const verificationType = body.verificationType ?? 'claimed';

      const updated = await pool.query(
        `UPDATE user_skills SET
           is_verified = true,
           verified_at = now(),
           verification_type = $3,
           verified_level = COALESCE($4, verified_level),
           evidence_source = COALESCE($5, evidence_source),
           verified_score = COALESCE($6, verified_score),
           assessment_strengths = COALESCE($7, assessment_strengths),
           assessment_improvements = COALESCE($8, assessment_improvements)
         WHERE user_id = $1 AND skill_id = $2
         RETURNING skill_id, is_verified, verified_at, verification_type, verified_level,
                   evidence_source, verified_score, assessment_strengths, assessment_improvements`,
        [
          userId,
          skillId,
          verificationType,
          body.verifiedLevel ?? null,
          body.evidenceSource ?? null,
          body.verifiedScore ?? null,
          body.strengths.length > 0 ? body.strengths : null,
          body.improvements.length > 0 ? body.improvements : null,
        ],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('That skill is not on your profile.', 'user_skill_not_found');
      }

      logger.info({ userId, skillId, verificationType }, 'skill marked verified');

      res.status(200).json({ skill: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.delete('/api/student/skills/:id', requireAuth, requireRole('student'), (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;
      const skillId = readUuidParam(req.params);

      const deleted = await pool.query(
        'DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING skill_id',
        [userId, skillId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('That skill is not on your profile.', 'user_skill_not_found');
      }

      res.status(204).end();
    })().catch(next);
  });

  /**
   * POST /api/student/skills/:id/resources/:resourceId/progress
   *
   * Per-material completion, which the client kept as a boolean inside each
   * learning resource in the skills blob.
   *
   * `:resourceId` accepts either the `skill_resources.id` UUID or the catalog
   * `source_id`. The second form is what the static catalog carries, and it is
   * resolved server-side rather than by the client looking up a UUID first:
   * the mapping is scoped to the skill in the path, so a source id can never
   * address a resource belonging to a different skill.
   */
  router.post(
    '/api/student/skills/:id/resources/:resourceId/progress',
    requireAuth,
    requireRole('student'),
    validateBody(updateMaterialProgressSchema),
    (req, res, next) => {
      void (async () => {
        const userId = req.user!.userId;
        const skillId = readUuidParam(req.params);
        const rawResourceId = String(req.params.resourceId ?? '');
        const body = req.body as UpdateMaterialProgressBody;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawResourceId);

        const resourceId = isUuid
          ? rawResourceId.toLowerCase()
          : await (async () => {
              const resolved = await pool.query<{ id: string }>(
                `SELECT id FROM skill_resources WHERE skill_id = $1 AND source_id = $2`,
                [skillId, rawResourceId],
              );
              if (!resolved.rows[0]) {
                throw AppError.notFound('Resource not found for that skill.', 'resource_not_found');
              }
              return resolved.rows[0].id;
            })();

        const upserted = await onMissingReference(() =>
          pool.query(
            `INSERT INTO skill_resource_progress (user_id, skill_id, resource_id, completed)
             VALUES ($1,$2,$3,$4)
             ON CONFLICT (user_id, skill_id, resource_id) DO UPDATE SET
               completed = EXCLUDED.completed,
               last_accessed_at = now()
             RETURNING resource_id, completed, last_accessed_at`,
            [userId, skillId, resourceId, body.completed],
          ),
        );

        res.status(200).json({ progress: upserted.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  return router;
}