import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { onMissingReference, readUuidParam, requestId } from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  updateCollegeProfileSchema,
  updateCompanyProfileSchema,
  type UpdateCollegeProfileBody,
  type UpdateCompanyProfileBody,
} from '../middleware/domainSchemas';

/**
 * Organization profile writes for the industry and college portals.
 *
 * Replaces the `upsertCompany` / `upsertCollege` Data Connect mutations and, more
 * importantly, the Firestore `setDoc(doc(db,'users',uid))` mirror that fired on
 * every profile edit. Those writes silently absorbed every Data Connect failure,
 * which is why profile data could exist in Firestore and nowhere else.
 *
 * The organization id always comes from `req.user`, so a recruiter can only
 * edit their own company and an officer only their own college.
 */

export type OrganizationRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createOrganizationRouter({ pool, authMiddleware }: OrganizationRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireOrganization } = authMiddleware;

  router.get('/api/industry/company', requireAuth, requireOrganization('industry'), (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId!;

      const company = await pool.query(
        `SELECT id, name, type, industry, location, city, state, country, latitude, longitude,
                employees, founded, website_url, tagline, about, mission, tech_stack,
                departments, hiring_domains, benefits, culture, logo_url, cover_image_url,
                created_at, updated_at
         FROM companies WHERE id = $1`,
        [companyId],
      );

      if (!company.rows[0]) {
        // requireOrganization already guaranteed users.company_id is set, so a
        // missing row means the FK points at something that was deleted.
        throw AppError.notFound('Company not found.', 'company_not_found');
      }

      // Recruiter details live on `users`, not `companies`.
      const recruiters = await pool.query(
        `SELECT id, display_name, email, photo_url, status, created_at
         FROM users WHERE company_id = $1 AND role = 'industry'
         ORDER BY created_at ASC`,
        [companyId],
      );

      res.status(200).json({ company: company.rows[0], recruiters: recruiters.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/industry/company', requireAuth, requireOrganization('industry'), validateBody(updateCompanyProfileSchema), (req, res, next) => {
    void (async () => {
      const companyId = req.user!.companyId!;
      const body = req.body as UpdateCompanyProfileBody;

      const columns: Record<string, string> = {
        name: 'name',
        type: 'type',
        industry: 'industry',
        location: 'location',
        city: 'city',
        state: 'state',
        country: 'country',
        latitude: 'latitude',
        longitude: 'longitude',
        employees: 'employees',
        founded: 'founded',
        websiteUrl: 'website_url',
        tagline: 'tagline',
        about: 'about',
        mission: 'mission',
        techStack: 'tech_stack',
        departments: 'departments',
        hiringDomains: 'hiring_domains',
        benefits: 'benefits',
        culture: 'culture',
        logoUrl: 'logo_url',
        coverImageUrl: 'cover_image_url',
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

      // companies_normalized_name_key is unique and is the natural join key, so
      // a rename has to move it too or the next registration resolves the wrong
      // company.
      if (typeof body.name === 'string' && body.name.trim() !== '') {
        sets.push(`normalized_name = $${values.length + 1}`);
        values.push(body.name.trim().toLowerCase());
      }

      if (sets.length === 0) {
        res.status(200).json({ company: null, unchanged: true, requestId: requestId(res) });
        return;
      }

      values.push(companyId);

      const updated = await onMissingReference(() =>
        pool.query(
          `UPDATE companies SET ${sets.join(', ')} WHERE id = $${values.length}
           RETURNING id, name, industry, location, about, updated_at`,
          values,
        ),
      );

      res.status(200).json({ company: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/college/profile', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const collegeId = req.user!.collegeId!;

      const college = await pool.query(
        `SELECT id, name, short_name, city, district, state, country, university,
                institution_type, affiliation, official_website, logo_url, about,
                total_students, naac_grade, placement_officer, created_at, updated_at
         FROM colleges WHERE id = $1`,
        [collegeId],
      );

      const officers = await pool.query(
        `SELECT id, display_name, email, phone, status, created_at
         FROM users WHERE college_id = $1 AND role = 'college'
         ORDER BY created_at ASC`,
        [collegeId],
      );

      res.status(200).json({ college: college.rows[0] ?? null, officers: officers.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.patch('/api/college/profile', requireAuth, requireOrganization('college'), validateBody(updateCollegeProfileSchema), (req, res, next) => {
    void (async () => {
      const collegeId = req.user!.collegeId!;
      const body = req.body as UpdateCollegeProfileBody;

      const columns: Record<string, string> = {
        name: 'name',
        shortName: 'short_name',
        city: 'city',
        district: 'district',
        state: 'state',
        country: 'country',
        university: 'university',
        institutionType: 'institution_type',
        affiliation: 'affiliation',
        officialWebsite: 'official_website',
        logoUrl: 'logo_url',
        about: 'about',
        totalStudents: 'total_students',
        naacGrade: 'naac_grade',
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

      // placement_officer is jsonb and is replaced wholesale rather than merged:
      // a partial jsonb merge would leave stale keys behind.
      if ('placementOfficer' in body) {
        values.push(body.placementOfficer === null ? null : JSON.stringify(body.placementOfficer));
        sets.push(`placement_officer = $${values.length}`);
      }

      if (typeof body.name === 'string' && body.name.trim() !== '') {
        sets.push(`normalized_name = $${values.length + 1}`);
        values.push(body.name.trim().toLowerCase());
      }

      if (sets.length === 0) {
        res.status(200).json({ college: null, unchanged: true, requestId: requestId(res) });
        return;
      }

      values.push(collegeId);

      const updated = await onMissingReference(() =>
        pool.query(
          `UPDATE colleges SET ${sets.join(', ')} WHERE id = $${values.length}
           RETURNING id, name, city, state, about, placement_officer, updated_at`,
          values,
        ),
      );

      res.status(200).json({ college: updated.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  /* -------------------------------------------------------------- lookup */

  /**
   * Company and college search used by the admin approval flow and the role
   * request snapshot. Returns ids and display names only.
   */
  router.get('/api/directory/companies', requireAuth, (req, res, next) => {
    void (async () => {
      const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

      const companies = await pool.query(
        `SELECT id, name, industry, city, state, country
         FROM companies
         WHERE ($1 = '' OR name ILIKE '%' || $1 || '%')
         ORDER BY name ASC LIMIT 50`,
        [query],
      );

      res.status(200).json({ companies: companies.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.get('/api/directory/colleges', requireAuth, (req, res, next) => {
    void (async () => {
      const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

      const colleges = await pool.query(
        `SELECT id, name, code, short_name, city, state
         FROM colleges
         WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR code ILIKE '%' || $1 || '%')
         ORDER BY name ASC LIMIT 50`,
        [query],
      );

      res.status(200).json({ colleges: colleges.rows, requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}