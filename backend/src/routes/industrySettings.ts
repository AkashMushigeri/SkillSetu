import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { readQuery, readUuidParam, requestId } from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  listTalentPoolSchema,
  upsertHiringPreferencesSchema,
  upsertTalentPoolEntrySchema,
  type ListTalentPoolQuery,
  type UpsertHiringPreferencesBody,
  type UpsertTalentPoolEntryBody,
} from '../middleware/domainSchemas';

/**
 * Industry-side persistent settings: hiring preferences and the talent pool.
 *
 * Both lived only in the browser. `preferences` in IndustryContext was never
 * persisted at all, and `savedToTalentPool` was a boolean flag on a
 * localStorage array, so neither survived a reload or a second device.
 *
 * Also reads the college-company partnership table, which is what the client
 * modelled as "MoUs" in a localStorage array. No new table was needed for that.
 */

export type IndustrySettingsRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createIndustrySettingsRouter({ pool, authMiddleware }: IndustrySettingsRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireOrganization } = authMiddleware;
  const recruiter = requireOrganization('industry');

  /* --------------------------------------------------- hiring preferences */

  /**
   * GET returns the caller's own preferences, or defaults when they have never
   * saved. Defaults are produced by the database rather than the client so the
   * two cannot disagree about what an unset preference is.
   */
  router.get('/api/industry/hiring-preferences', requireAuth, recruiter, (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const existing = await pool.query(
        // work_modes is cast to text[] because pg only auto-parses arrays whose
        // element type it knows; a custom enum array otherwise arrives as the raw
        // string '{hybrid}' instead of ['hybrid'].
        `SELECT user_id, company_id, preferred_departments, preferred_degrees,
                preferred_graduation_years, preferred_locations, work_modes::text[] AS work_modes,
                minimum_cgpa, prioritize_verified_skills, prioritize_startup_experience,
                search_radius_km, created_at, updated_at
         FROM hiring_preferences WHERE user_id = $1`,
        [userId],
      );

      if (existing.rows[0]) {
        res.status(200).json({ preferences: existing.rows[0], requestId: requestId(res) });
        return;
      }

      res.status(200).json({
        preferences: {
          user_id: userId,
          company_id: req.user!.companyId,
          preferred_departments: [],
          preferred_degrees: [],
          preferred_graduation_years: [],
          preferred_locations: [],
          work_modes: [],
          minimum_cgpa: null,
          prioritize_verified_skills: false,
          prioritize_startup_experience: false,
          search_radius_km: 25,
          is_default: true,
        },
        requestId: requestId(res),
      });
    })().catch(next);
  });

  /**
   * PUT upserts. `company_id` is always `req.user.companyId` and is never read
   * from the body, so a recruiter cannot write preferences under a tenant they
   * do not belong to.
   */
  router.put('/api/industry/hiring-preferences', requireAuth, recruiter, validateBody(upsertHiringPreferencesSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as UpsertHiringPreferencesBody;

      const saved = await pool.query(
        `INSERT INTO hiring_preferences
           (user_id, company_id, preferred_departments, preferred_degrees,
            preferred_graduation_years, preferred_locations, work_modes, minimum_cgpa,
            prioritize_verified_skills, prioritize_startup_experience, search_radius_km)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (user_id) DO UPDATE SET
           preferred_departments = EXCLUDED.preferred_departments,
           preferred_degrees = EXCLUDED.preferred_degrees,
           preferred_graduation_years = EXCLUDED.preferred_graduation_years,
           preferred_locations = EXCLUDED.preferred_locations,
           work_modes = EXCLUDED.work_modes,
           minimum_cgpa = EXCLUDED.minimum_cgpa,
           prioritize_verified_skills = EXCLUDED.prioritize_verified_skills,
           prioritize_startup_experience = EXCLUDED.prioritize_startup_experience,
           search_radius_km = EXCLUDED.search_radius_km
           RETURNING user_id, company_id, preferred_departments, preferred_degrees,
                    preferred_graduation_years, preferred_locations, work_modes::text[] AS work_modes,
                    minimum_cgpa, prioritize_verified_skills, prioritize_startup_experience,
                    search_radius_km, updated_at`,
        [
          user.userId,
          user.companyId,
          body.preferredDepartments,
          body.preferredDegrees,
          body.preferredGraduationYears,
          body.preferredLocations,
          body.workModes,
          body.minimumCgpa ?? null,
          body.prioritizeVerifiedSkills,
          body.prioritizeStartupExperience,
          body.searchRadiusKm,
        ],
      );

      res.status(200).json({ preferences: saved.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /* ----------------------------------------------------------- talent pool */

  router.get('/api/industry/talent-pool', requireAuth, recruiter, validateQuery(listTalentPoolSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListTalentPoolQuery>(res);
      const companyId = req.user!.companyId;

      const result = await pool.query(
        `SELECT l.candidate_user_id, l.category, l.note, l.shortlisted_at,
                u.display_name, u.email, u.photo_url,
                sp.degree, sp.academic_year, sp.cgpa, sp.location, sp.bio
         FROM company_candidate_lists l
         JOIN users u ON u.id = l.candidate_user_id
         LEFT JOIN student_profiles sp ON sp.user_id = u.id
         WHERE l.company_id = $1
           AND ($2::text IS NULL OR l.category = $2)
         ORDER BY l.shortlisted_at DESC
         LIMIT $3 OFFSET $4`,
        [companyId, query.category ?? null, query.limit, query.offset],
      );

      // Verified skills per shortlisted candidate, so the recruiter list can show
      // the same signal the client previously read from a local blob.
      const skills = await pool.query(
        `SELECT us.user_id, s.name, us.verified_level
         FROM user_skills us
         JOIN skills s ON s.id = us.skill_id
         JOIN company_candidate_lists l ON l.candidate_user_id = us.user_id
         WHERE l.company_id = $1 AND us.is_verified = true
         ORDER BY s.name`,
        [companyId],
      );

      const skillsByCandidate = new Map<string, { name: string; verified_level: string }[]>();
      for (const row of skills.rows) {
        const list = skillsByCandidate.get(row.user_id) ?? [];
        list.push({ name: row.name, verified_level: row.verified_level });
        skillsByCandidate.set(row.user_id, list);
      }

      res.status(200).json({
        entries: result.rows.map((row) => ({
          ...row,
          verified_skills: skillsByCandidate.get(row.candidate_user_id) ?? [],
        })),
        requestId: requestId(res),
      });
    })().catch(next);
  });

  router.put('/api/industry/talent-pool', requireAuth, recruiter, validateBody(upsertTalentPoolEntrySchema), (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId!;
      const body = req.body as UpsertTalentPoolEntryBody;

      // The candidate must be a real student account. This is the constraint
      // that stops the seeded mock candidates from being enrolled.
      const candidate = await pool.query<{ id: string; role: string }>(
        'SELECT id, role FROM users WHERE id = $1',
        [body.candidateUserId],
      );

      if (!candidate.rows[0]) {
        throw AppError.unprocessable('That user does not exist.', 'candidate_not_found');
      }

      if (candidate.rows[0].role !== 'student') {
        throw AppError.unprocessable('Only student accounts can be shortlisted.', 'candidate_not_student');
      }

      const saved = await pool.query(
        `INSERT INTO company_candidate_lists (company_id, candidate_user_id, category, note)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (company_id, candidate_user_id) DO UPDATE SET
           category = EXCLUDED.category,
           note = EXCLUDED.note,
           shortlisted_at = now()
         RETURNING company_id, candidate_user_id, category, note, shortlisted_at`,
        [companyId, body.candidateUserId, body.category, body.note ?? null],
      );

      res.status(200).json({ entry: saved.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.delete('/api/industry/talent-pool/:candidateUserId', requireAuth, recruiter, (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId!;
      const candidateUserId = readUuidParam(req.params, 'candidateUserId');

      const deleted = await pool.query(
        'DELETE FROM company_candidate_lists WHERE company_id = $1 AND candidate_user_id = $2 RETURNING candidate_user_id',
        [companyId, candidateUserId],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('That candidate is not in your talent pool.', 'talent_pool_entry_not_found');
      }

      res.status(204).end();
    })().catch(next);
  });

  /* ------------------------------------------------- partnerships and MoUs */

  /**
   * The client's `collegeMous` array. `college_company` already carries
   * `is_mou` and `mou_status`, so this needed no new table.
   */
  router.get('/api/industry/partnerships', requireAuth, recruiter, (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId!;

      const result = await pool.query(
        `SELECT cc.college_id, cc.company_id, cc.partnership_status, cc.is_mou, cc.mou_status,
                cc.contact_person, cc.contact_email, cc.effective_from, cc.expires_at,
                cc.key_initiatives, cc.internship_commitment_count,
                c.name AS college_name, c.short_name AS college_short_name,
                c.city AS college_city, c.state AS college_state, c.logo_url AS college_logo
         FROM college_company cc
         JOIN colleges c ON c.id = cc.college_id
         WHERE cc.company_id = $1
         ORDER BY cc.is_mou DESC, c.name ASC`,
        [companyId],
      );

      res.status(200).json({ partnerships: result.rows, requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}