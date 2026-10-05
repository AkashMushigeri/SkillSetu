import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import {
  buildSlug,
  onConflict,
  onMissingReference,
  readQuery,
  readUuidParam,
  requestId,
} from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createCampusAnnouncementSchema,
  createCurriculumModuleSchema,
  createPlacementDriveSchema,
  createTrainingProgramSchema,
  listCollegeStudentsSchema,
  updateCampusAnnouncementSchema,
  updateCurriculumModuleSchema,
  updatePlacementDriveSchema,
  updatePartnershipSchema,
  updateTrainingEnrollmentSchema,
  updateTrainingProgramSchema,
  upsertPartnershipSchema,
  type CreateCampusAnnouncementBody,
  type CreateCurriculumModuleBody,
  type CreatePlacementDriveBody,
  type CreateTrainingProgramBody,
  type ListCollegeStudentsQuery,
  type UpdateCampusAnnouncementBody,
  type UpdateCurriculumModuleBody,
  type UpdatePlacementDriveBody,
  type UpdatePartnershipBody,
  type UpdateTrainingEnrollmentBody,
  type UpdateTrainingProgramBody,
  type UpsertPartnershipBody,
} from '../middleware/domainSchemas';

/**
 * The college portal backend.
 *
 * Migration 0011 created six tables for this portal and nothing ever read or
 * wrote them, because there was no router. The portal itself ran on module-level
 * `useState` arrays seeded from mock data: `addTrainingProgram` minted
 * `tp-new-${Date.now()}`, `addAnnouncement` minted `anc-${Date.now()}`, and
 * `importStudents(n)` incremented `profile.totalStudents` in memory. Every one
 * of those disappeared on refresh, and the cross-sector "sync" that fed the
 * college portal was a localStorage event bus, so nothing moved between
 * browsers either.
 *
 * Two rules govern every route here.
 *
 * 1. The owning college is `req.user.collegeId`. It is never read from the
 *    body, the query, or a path parameter, so an officer cannot write into
 *    another institution's records by supplying a different id.
 * 2. Rows are always filtered by that college in the WHERE clause, not by
 *    filtering after the fetch. A student roster is the sensitive one: it
 *    exposes other people's profile and skill data, so it is scoped in SQL.
 *
 * The cross-portal relationships stay relational. `college_company` is the
 * partnership edge, `curriculum_modules` hangs off its composite key, and
 * placement drives point at `companies`. That is what lets a single Neon
 * database enforce the integrity the sync bus could not.
 */

export type CollegeRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createCollegeRouter({ pool, authMiddleware }: CollegeRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireOrganization } = authMiddleware;

  const collegeId = (req: { user?: { collegeId: string | null } | null }): string => {
    const id = req.user?.collegeId;
    if (!id) {
      // requireOrganization('college') should have caught this already; this is
      // defence in depth so no query can ever run with a null tenant.
      throw AppError.forbidden('This account is not attached to a college.', 'forbidden');
    }
    return id;
  };

  /* --------------------------------------------------------- student roster */

  /**
   * Students affiliated with the caller's college.
   *
   * The affiliation is `users.college_id`. The previous implementation returned
   * `MOCK_STUDENTS`, so this list was the same for every college and survived
   * only until refresh.
   */
  router.get(
    '/api/college/students',
    requireAuth,
    requireOrganization('college'),
    validateQuery(listCollegeStudentsSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const query = readQuery<ListCollegeStudentsQuery>(res);

        const students = await pool.query(
          `SELECT u.id, u.firebase_uid, u.email, u.display_name, u.photo_url, u.title,
                  u.status, u.onboarding_completed,
                  sp.degree, sp.department, sp.academic_year, sp.cgpa, sp.location, sp.bio,
                  (SELECT count(*)::int FROM user_skills us WHERE us.user_id = u.id) AS skill_count,
                  (SELECT count(*)::int FROM user_skills us
                     WHERE us.user_id = u.id AND us.verified_at IS NOT NULL) AS verified_skill_count
             FROM users u
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
            WHERE u.college_id = $1
              AND u.role = 'student'
              AND ($2 = '' OR u.display_name ILIKE '%' || $2 || '%' OR u.email ILIKE '%' || $2 || '%')
              AND ($3 = '' OR sp.department ILIKE '%' || $3 || '%')
              AND ($4 = '' OR EXISTS (
                    SELECT 1 FROM user_skills us2
                      JOIN skills s2 ON s2.id = us2.skill_id
                     WHERE us2.user_id = u.id AND s2.slug = $4))
            ORDER BY u.created_at DESC
            LIMIT $5 OFFSET $6`,
          [id, query.q ?? '', query.department ?? '', query.skillSlug ?? '', query.limit, query.offset],
        );

        const total = await pool.query(
          `SELECT count(*)::int AS count
             FROM users u
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
            WHERE u.college_id = $1 AND u.role = 'student'`,
          [id],
        );

        res.status(200).json({
          students: students.rows,
          total: total.rows[0]?.count ?? 0,
          requestId: requestId(res),
        });
      })().catch(next);
    },
  );

  /* ------------------------------------------------------ training programs */

  router.get('/api/college/training-programs', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const programs = await pool.query(
        `SELECT tp.id, tp.slug, tp.name, tp.skill_id, s.slug AS skill_slug, tp.skill_name,
                tp.skill_level, tp.description, tp.instructor, tp.start_date, tp.end_date,
                tp.max_students, tp.assessment_required, tp.industry_partner,
                tp.learning_resources, tp.status, tp.created_at, tp.updated_at,
                (SELECT count(*)::int FROM training_enrollments te
                  WHERE te.training_program_id = tp.id AND te.status <> 'withdrawn') AS enrolled_students,
                (SELECT count(*)::int FROM training_enrollments te
                  WHERE te.training_program_id = tp.id AND te.status = 'completed') AS completed_students,
                (SELECT round(avg(te.score), 2) FROM training_enrollments te
                  WHERE te.training_program_id = tp.id AND te.score IS NOT NULL) AS average_score
           FROM training_programs tp
           LEFT JOIN skills s ON s.id = tp.skill_id
          WHERE tp.college_id = $1
          ORDER BY tp.created_at DESC`,
        [id],
      );

      res.status(200).json({ trainingPrograms: programs.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post(
    '/api/college/training-programs',
    requireAuth,
    requireOrganization('college'),
    validateBody(createTrainingProgramSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const body = req.body as CreateTrainingProgramBody;
        const slug = buildSlug(body.name, crypto.randomUUID(), body.slug);

        const created = await onConflict(
          () =>
            onMissingReference(() =>
              pool.query(
                `INSERT INTO training_programs
                   (slug, college_id, skill_id, name, skill_name, skill_level, description,
                    instructor, start_date, end_date, max_students, assessment_required,
                    industry_partner, learning_resources, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                 RETURNING id, slug, name, status, created_at`,
                [
                  slug,
                  id,
                  body.skillId ?? null,
                  body.name,
                  body.skillName ?? null,
                  body.skillLevel,
                  body.description ?? null,
                  body.instructor ?? null,
                  body.startDate ?? null,
                  body.endDate ?? null,
                  body.maxStudents ?? null,
                  body.assessmentRequired,
                  body.industryPartner ?? null,
                  body.learningResources,
                  body.status,
                ],
              ),
            ),
          'A training program with that slug already exists.',
          'training_program_slug_conflict',
        );

        res.status(201).json({ trainingProgram: created.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/training-programs/:id',
    requireAuth,
    requireOrganization('college'),
    validateBody(updateTrainingProgramSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const programId = readUuidParam(req.params);
        const body = req.body as UpdateTrainingProgramBody;

        const columns: Record<string, string> = {
          skillId: 'skill_id',
          skillName: 'skill_name',
          skillLevel: 'skill_level',
          description: 'description',
          instructor: 'instructor',
          startDate: 'start_date',
          endDate: 'end_date',
          maxStudents: 'max_students',
          assessmentRequired: 'assessment_required',
          industryPartner: 'industry_partner',
          learningResources: 'learning_resources',
          status: 'status',
        };

        const sets: string[] = [];
        const values: unknown[] = [];

        if (typeof body.name === 'string') {
          values.push(body.name);
          sets.push(`name = $${values.length}`);
        }

        for (const [key, column] of Object.entries(columns)) {
          if (!(key in body)) continue;
          values.push(body[key as keyof typeof body] ?? null);
          sets.push(`${column} = $${values.length}`);
        }

        if (sets.length === 0) {
          res.status(200).json({ trainingProgram: null, unchanged: true, requestId: requestId(res) });
          return;
        }

        values.push(programId, id);

        // The college_id predicate is what makes this safe: a program belonging
        // to another college matches zero rows and becomes a 404, not a silent
        // no-op that would let a caller believe the edit landed.
        const updated = await onMissingReference(() =>
          pool.query(
            `UPDATE training_programs SET ${sets.join(', ')}
              WHERE id = $${values.length - 1} AND college_id = $${values.length}
              RETURNING id, slug, name, status, updated_at`,
            values,
          ),
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Training program not found.', 'training_program_not_found');
        }

        res.status(200).json({ trainingProgram: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.delete('/api/college/training-programs/:id', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);
      const programId = readUuidParam(req.params);

      const deleted = await pool.query(
        `DELETE FROM training_programs WHERE id = $1 AND college_id = $2 RETURNING id`,
        [programId, id],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Training program not found.', 'training_program_not_found');
      }

      res.status(200).json({ deleted: programId, requestId: requestId(res) });
    })().catch(next);
  });

  /* ----------------------------------------------------------- enrollments */

  /**
   * Enrolments are recorded against `users.id`, resolved from the caller's
   * Firebase UID rather than supplied by the client, so an officer can only
   * enrol themselves and the roster they see is the same set the route accepts.
   */
  router.post(
    '/api/college/training-programs/:id/enroll',
    requireAuth,
    requireOrganization('college'),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const programId = readUuidParam(req.params);

        const enrolled = await onConflict(
          () =>
            pool.query(
              `INSERT INTO training_enrollments (training_program_id, user_id)
               SELECT $1, u.id FROM users u
                WHERE u.firebase_uid = $3 AND u.college_id = $2
               ON CONFLICT (training_program_id, user_id) DO NOTHING
               RETURNING id, status, enrolled_at`,
              [programId, id, req.user!.firebaseUid],
            ),
          'Already enrolled in this training program.',
          'already_enrolled',
        );

        res.status(201).json({ enrollment: enrolled.rows[0] ?? null, requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/training-enrollments/:id',
    requireAuth,
    requireOrganization('college'),
    validateBody(updateTrainingEnrollmentSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const enrollmentId = readUuidParam(req.params);
        const body = req.body as UpdateTrainingEnrollmentBody;

        // SET targets cannot be alias-qualified in PostgreSQL, so the columns are
        // unqualified here and the join condition is what scopes the row.
        const sets = ['status = $1'];
        const values: unknown[] = [body.status];

        if ('score' in body) {
          values.push(body.score ?? null);
          sets.push(`score = $${values.length}`);
        }

        // completed_at is derived from the status rather than accepted from the
        // client, so a caller cannot claim a completion that never happened.
        sets.push(`completed_at = CASE WHEN $1::enrollment_status = 'completed' THEN COALESCE(completed_at, now()) ELSE NULL END`);

        values.push(enrollmentId, id);

        const updated = await pool.query(
          `UPDATE training_enrollments AS te SET ${sets.join(', ')}
             FROM training_programs tp
            WHERE te.id = $${values.length - 1}
              AND te.training_program_id = tp.id
              AND tp.college_id = $${values.length}
            RETURNING te.id, te.status, te.score, te.completed_at`,
          values,
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Enrollment not found.', 'enrollment_not_found');
        }

        res.status(200).json({ enrollment: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  /* ---------------------------------------------------------- announcements */

  router.get('/api/college/announcements', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const announcements = await pool.query(
        `SELECT id, slug, title, category, content, target_audience, status, important,
                published_at, created_at, updated_at
           FROM campus_announcements
          WHERE college_id = $1
          ORDER BY status ASC, COALESCE(published_at, created_at) DESC`,
        [id],
      );

      res.status(200).json({ announcements: announcements.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post(
    '/api/college/announcements',
    requireAuth,
    requireOrganization('college'),
    validateBody(createCampusAnnouncementSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const body = req.body as CreateCampusAnnouncementBody;
        const slug = buildSlug(body.title, crypto.randomUUID(), body.slug);

        // The CHECK constraint requires published_at whenever status is
        // 'published'. Setting it here rather than accepting it keeps the two
        // from disagreeing. The status is repeated as its own parameter because
        // Postgres cannot deduce one parameter as both an enum and free text.
        const created = await onConflict(
          () =>
            pool.query(
              `INSERT INTO campus_announcements
                 (slug, college_id, title, category, content, target_audience, status, important, published_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                       CASE WHEN $7::announcement_status = 'published' THEN now() ELSE NULL END)
               RETURNING id, slug, title, category, status, important, published_at`,
              [
                slug,
                id,
                body.title,
                body.category,
                body.content ?? null,
                body.targetAudience ?? null,
                body.status,
                body.important,
              ],
            ),
          'An announcement with that slug already exists.',
          'announcement_slug_conflict',
        );

        res.status(201).json({ announcement: created.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/announcements/:id',
    requireAuth,
    requireOrganization('college'),
    validateBody(updateCampusAnnouncementSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const announcementId = readUuidParam(req.params);
        const body = req.body as UpdateCampusAnnouncementBody;

        const columns: Record<string, string> = {
          title: 'title',
          category: 'category',
          content: 'content',
          targetAudience: 'target_audience',
          important: 'important',
        };

        const sets: string[] = [];
        const values: unknown[] = [];

        for (const [key, column] of Object.entries(columns)) {
          if (!(key in body)) continue;
          values.push(body[key as keyof typeof body] ?? null);
          sets.push(`${column} = $${values.length}`);
        }

        if ('status' in body) {
          values.push(body.status);
          sets.push(`status = $${values.length}`);
          if (body.status === 'published') {
            sets.push(`published_at = COALESCE(published_at, now())`);
          }
        }

        if (sets.length === 0) {
          res.status(200).json({ announcement: null, unchanged: true, requestId: requestId(res) });
          return;
        }

        values.push(announcementId, id);

        const updated = await onMissingReference(() =>
          pool.query(
            `UPDATE campus_announcements SET ${sets.join(', ')}
              WHERE id = $${values.length - 1} AND college_id = $${values.length}
              RETURNING id, slug, title, category, status, important, published_at, updated_at`,
            values,
          ),
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Announcement not found.', 'announcement_not_found');
        }

        res.status(200).json({ announcement: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.delete('/api/college/announcements/:id', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);
      const announcementId = readUuidParam(req.params);

      const deleted = await pool.query(
        `DELETE FROM campus_announcements WHERE id = $1 AND college_id = $2 RETURNING id`,
        [announcementId, id],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Announcement not found.', 'announcement_not_found');
      }

      res.status(200).json({ deleted: announcementId, requestId: requestId(res) });
    })().catch(next);
  });

  /* -------------------------------------------------------- placement drives */

  router.get('/api/college/placement-drives', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const drives = await pool.query(
        `SELECT pd.id, pd.slug, pd.college_id, pd.company_id, co.name AS company_name,
                pd.title, pd.drive_date, pd.eligible_departments, pd.minimum_cgpa,
                pd.skills_required, pd.package_offer, pd.openings, pd.status,
                pd.created_at, pd.updated_at
           FROM placement_drives pd
           LEFT JOIN companies co ON co.id = pd.company_id
          WHERE pd.college_id = $1
          ORDER BY pd.drive_date ASC NULLS LAST, pd.created_at DESC`,
        [id],
      );

      res.status(200).json({ placementDrives: drives.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post(
    '/api/college/placement-drives',
    requireAuth,
    requireOrganization('college'),
    validateBody(createPlacementDriveSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const body = req.body as CreatePlacementDriveBody;
        const slug = buildSlug(body.title, crypto.randomUUID(), body.slug);

        const created = await onConflict(
          () =>
            onMissingReference(() =>
              pool.query(
                `INSERT INTO placement_drives
                   (slug, college_id, company_id, title, drive_date, eligible_departments,
                    minimum_cgpa, skills_required, package_offer, openings, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                 RETURNING id, slug, title, drive_date, status, openings, package_offer`,
                [
                  slug,
                  id,
                  body.companyId ?? null,
                  body.title,
                  body.driveDate ?? null,
                  body.eligibleDepartments,
                  body.minimumCgpa ?? null,
                  body.skillsRequired,
                  body.packageOffer ?? null,
                  body.openings ?? null,
                  body.status,
                ],
              ),
            ),
          'A placement drive with that slug already exists.',
          'placement_drive_slug_conflict',
        );

        res.status(201).json({ placementDrive: created.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/placement-drives/:id',
    requireAuth,
    requireOrganization('college'),
    validateBody(updatePlacementDriveSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const driveId = readUuidParam(req.params);
        const body = req.body as UpdatePlacementDriveBody;

        const columns: Record<string, string> = {
          companyId: 'company_id',
          title: 'title',
          driveDate: 'drive_date',
          eligibleDepartments: 'eligible_departments',
          minimumCgpa: 'minimum_cgpa',
          skillsRequired: 'skills_required',
          packageOffer: 'package_offer',
          openings: 'openings',
          status: 'status',
        };

        const sets: string[] = [];
        const values: unknown[] = [];

        for (const [key, column] of Object.entries(columns)) {
          if (!(key in body)) continue;
          values.push(body[key as keyof typeof body] ?? null);
          sets.push(`${column} = $${values.length}`);
        }

        if (sets.length === 0) {
          res.status(200).json({ placementDrive: null, unchanged: true, requestId: requestId(res) });
          return;
        }

        values.push(driveId, id);

        const updated = await onMissingReference(() =>
          pool.query(
            `UPDATE placement_drives SET ${sets.join(', ')}
              WHERE id = $${values.length - 1} AND college_id = $${values.length}
              RETURNING id, slug, title, status, openings, updated_at`,
            values,
          ),
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Placement drive not found.', 'placement_drive_not_found');
        }

        res.status(200).json({ placementDrive: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.delete('/api/college/placement-drives/:id', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);
      const driveId = readUuidParam(req.params);

      const deleted = await pool.query(
        `DELETE FROM placement_drives WHERE id = $1 AND college_id = $2 RETURNING id`,
        [driveId, id],
      );

      if (!deleted.rows[0]) {
        throw AppError.notFound('Placement drive not found.', 'placement_drive_not_found');
      }

      res.status(200).json({ deleted: driveId, requestId: requestId(res) });
    })().catch(next);
  });

  /* ----------------------------------------------------------- partnerships */

  /**
   * The college side of the industry relationship.
   *
   * `GET /api/industry/partnerships` on the other portal reads the same rows
   * from the company side, so one partnership row serves both portals and stays
   * consistent — which is what the localStorage `writeSyncRecord` bus was
   * pretending to do.
   */
  router.get('/api/college/partnerships', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const partnerships = await pool.query(
        `SELECT cc.college_id, cc.company_id, co.name AS company_name, co.industry, co.city, co.state,
                cc.partnership_status, cc.is_mou, cc.mou_status, cc.contact_person, cc.contact_email,
                cc.effective_from, cc.expires_at, cc.key_initiatives, cc.internship_commitment_count,
                cc.joint_hackathons_count, cc.curriculum_reviews_completed,
                cc.internship_opportunities_count, cc.students_hired_count, cc.challenges_active_count,
                cc.created_at, cc.updated_at,
                (SELECT count(*)::int FROM curriculum_modules cm
                  WHERE cm.college_id = cc.college_id AND cm.company_id = cc.company_id) AS curriculum_module_count
           FROM college_company cc
           JOIN companies co ON co.id = cc.company_id
          WHERE cc.college_id = $1
          ORDER BY co.name ASC`,
        [id],
      );

      res.status(200).json({ partnerships: partnerships.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.put(
    '/api/college/partnerships',
    requireAuth,
    requireOrganization('college'),
    validateBody(upsertPartnershipSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const body = req.body as UpsertPartnershipBody;

        // Upsert rather than insert so re-submitting the same company updates
        // the existing partnership. The conflict target is the composite primary
        // key, which is what makes a second request idempotent instead of a 409.
        const saved = await onMissingReference(() =>
          pool.query(
            `INSERT INTO college_company
               (college_id, company_id, partnership_status, is_mou, mou_status, contact_person,
                contact_email, effective_from, expires_at, key_initiatives,
                internship_commitment_count, joint_hackathons_count, curriculum_reviews_completed,
                internship_opportunities_count, students_hired_count, challenges_active_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
             ON CONFLICT (college_id, company_id) DO UPDATE SET
                partnership_status = EXCLUDED.partnership_status,
                is_mou = EXCLUDED.is_mou,
                mou_status = EXCLUDED.mou_status,
                contact_person = EXCLUDED.contact_person,
                contact_email = EXCLUDED.contact_email,
                effective_from = EXCLUDED.effective_from,
                expires_at = EXCLUDED.expires_at,
                key_initiatives = EXCLUDED.key_initiatives,
                internship_commitment_count = EXCLUDED.internship_commitment_count,
                joint_hackathons_count = EXCLUDED.joint_hackathons_count,
                curriculum_reviews_completed = EXCLUDED.curriculum_reviews_completed,
                internship_opportunities_count = EXCLUDED.internship_opportunities_count,
                students_hired_count = EXCLUDED.students_hired_count,
                challenges_active_count = EXCLUDED.challenges_active_count,
                updated_at = now()
             RETURNING college_id, company_id, partnership_status, is_mou, mou_status, updated_at`,
            [
              id,
              body.companyId,
              body.partnershipStatus,
              body.isMou,
              body.mouStatus ?? null,
              body.contactPerson ?? null,
              body.contactEmail ?? null,
              body.effectiveFrom ?? null,
              body.expiresAt ?? null,
              body.keyInitiatives,
              body.internshipCommitmentCount,
              body.jointHackathonsCount,
              body.curriculumReviewsCompleted,
              body.internshipOpportunitiesCount,
              body.studentsHiredCount,
              body.challengesActiveCount,
            ],
          ),
        );

        res.status(200).json({ partnership: saved.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/partnerships/:companyId',
    requireAuth,
    requireOrganization('college'),
    validateBody(updatePartnershipSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const companyId = readUuidParam(req.params, 'companyId');
        const body = req.body as UpdatePartnershipBody;

        const columns: Record<string, string> = {
          partnershipStatus: 'partnership_status',
          isMou: 'is_mou',
          mouStatus: 'mou_status',
          contactPerson: 'contact_person',
          contactEmail: 'contact_email',
          effectiveFrom: 'effective_from',
          expiresAt: 'expires_at',
          keyInitiatives: 'key_initiatives',
          internshipCommitmentCount: 'internship_commitment_count',
          jointHackathonsCount: 'joint_hackathons_count',
          curriculumReviewsCompleted: 'curriculum_reviews_completed',
          internshipOpportunitiesCount: 'internship_opportunities_count',
          studentsHiredCount: 'students_hired_count',
          challengesActiveCount: 'challenges_active_count',
        };

        const sets: string[] = [];
        const values: unknown[] = [];

        for (const [key, column] of Object.entries(columns)) {
          if (!(key in body)) continue;
          values.push(body[key as keyof typeof body] ?? null);
          sets.push(`${column} = $${values.length}`);
        }

        if (sets.length === 0) {
          res.status(200).json({ partnership: null, unchanged: true, requestId: requestId(res) });
          return;
        }

        values.push(companyId, id);

        const updated = await onMissingReference(() =>
          pool.query(
            `UPDATE college_company SET ${sets.join(', ')}
              WHERE company_id = $${values.length - 1} AND college_id = $${values.length}
            RETURNING college_id, company_id, partnership_status, is_mou, mou_status, updated_at`,
            values,
          ),
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Partnership not found.', 'partnership_not_found');
        }

        res.status(200).json({ partnership: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  /* ------------------------------------------------------ curriculum modules */

  router.get('/api/college/curriculum', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const modules = await pool.query(
        `SELECT cm.id, cm.slug, cm.college_id, cm.company_id, co.name AS company_name,
                cm.semester, cm.current_subject, cm.industry_recommendation,
                cm.recommended_technologies, cm.rationale, cm.status, cm.created_at, cm.updated_at
           FROM curriculum_modules cm
           LEFT JOIN companies co ON co.id = cm.company_id
          WHERE cm.college_id = $1
          ORDER BY cm.updated_at DESC`,
        [id],
      );

      res.status(200).json({ curriculumModules: modules.rows, requestId: requestId(res) });
    })().catch(next);
  });

  router.post(
    '/api/college/curriculum',
    requireAuth,
    requireOrganization('college'),
    validateBody(createCurriculumModuleSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const body = req.body as CreateCurriculumModuleBody;
        const slug = buildSlug(body.currentSubject ?? 'module', crypto.randomUUID(), body.slug);

        // The composite FK to college_company is doing real work here: a
        // curriculum module cannot exist for a company this college has no
        // partnership with, and the driver reports that as a 422 rather than an
        // orphan row.
        const created = await onConflict(
          () =>
            onMissingReference(() =>
              pool.query(
                `INSERT INTO curriculum_modules
                   (slug, college_id, company_id, semester, current_subject,
                    industry_recommendation, recommended_technologies, rationale, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING id, slug, company_id, status, created_at`,
                [
                  slug,
                  id,
                  body.companyId,
                  body.semester ?? null,
                  body.currentSubject ?? null,
                  body.industryRecommendation ?? null,
                  body.recommendedTechnologies,
                  body.rationale ?? null,
                  body.status,
                ],
              ),
            ),
          'A curriculum module with that slug already exists.',
          'curriculum_module_slug_conflict',
        );

        res.status(201).json({ curriculumModule: created.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  router.patch(
    '/api/college/curriculum/:id',
    requireAuth,
    requireOrganization('college'),
    validateBody(updateCurriculumModuleSchema),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const moduleId = readUuidParam(req.params);
        const body = req.body as UpdateCurriculumModuleBody;

        const columns: Record<string, string> = {
          semester: 'semester',
          currentSubject: 'current_subject',
          industryRecommendation: 'industry_recommendation',
          recommendedTechnologies: 'recommended_technologies',
          rationale: 'rationale',
          status: 'status',
        };

        const sets: string[] = [];
        const values: unknown[] = [];

        for (const [key, column] of Object.entries(columns)) {
          if (!(key in body)) continue;
          values.push(body[key as keyof typeof body] ?? null);
          sets.push(`${column} = $${values.length}`);
        }

        if (sets.length === 0) {
          res.status(200).json({ curriculumModule: null, unchanged: true, requestId: requestId(res) });
          return;
        }

        values.push(moduleId, id);

        const updated = await onMissingReference(() =>
          pool.query(
            `UPDATE curriculum_modules SET ${sets.join(', ')}
              WHERE id = $${values.length - 1} AND college_id = $${values.length}
              RETURNING id, slug, status, updated_at`,
            values,
          ),
        );

        if (!updated.rows[0]) {
          throw AppError.notFound('Curriculum module not found.', 'curriculum_module_not_found');
        }

        res.status(200).json({ curriculumModule: updated.rows[0], requestId: requestId(res) });
      })().catch(next);
    },
  );

  /**
   * Internships visible to this college, each with a real eligible-student count.
   *
   * The count is the same `internship_required_skills` match the recommend route
   * uses, computed in one pass per internship rather than by the client issuing
   * one request per card. The previous UI showed a hardcoded 42.
   */
  router.get('/api/college/internships', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const internships = await pool.query(
        `SELECT i.id, i.slug, i.title, i.department, i.location, i.city, i.state,
                i.work_mode, i.duration, i.stipend, i.eligibility, i.start_date,
                i.application_deadline, i.description, i.openings, i.is_startup_friendly,
                i.eligible_for_conversion, i.status,
                co.name AS company_name, co.logo_url AS company_logo,
                (SELECT count(*)::int FROM internship_required_skills irs
                  WHERE irs.internship_id = i.id AND irs.importance = 'required') AS required_skills,
                (SELECT count(*)::int FROM users u
                  WHERE u.college_id = $1 AND u.role = 'student' AND u.status = 'active'
                    AND NOT EXISTS (
                          SELECT 1 FROM internship_required_skills irs
                           WHERE irs.internship_id = i.id AND irs.importance = 'required'
                             AND NOT EXISTS (SELECT 1 FROM user_skills us
                                              WHERE us.user_id = u.id AND us.skill_id = irs.skill_id))) AS eligible_students
           FROM internships i
           JOIN companies co ON co.id = i.company_id
          WHERE i.status = 'active'
          ORDER BY i.created_at DESC
          LIMIT 100`,
        [id],
      );

      res.status(200).json({ internships: internships.rows, requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * Real eligibility for an internship, computed in SQL.
   *
   * The frontend previously showed a hardcoded "42 eligible students" and a
   * "Recommend" button that fired a toast reading "recommended to 42 eligible
   * students" without writing anything. Both numbers now come from the same
   * query, so the count on screen and the count that receives a notification are
   * guaranteed to be the same number.
   *
   * A student qualifies when they hold every `required` skill the internship
   * asks for. `preferred` skills widen the match rather than gate it.
   */
  router.get(
    '/api/college/internships/:id/eligible-students',
    requireAuth,
    requireOrganization('college'),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const internshipId = readUuidParam(req.params);

        const exists = await pool.query(`SELECT id FROM internships WHERE id = $1`, [internshipId]);
        if (!exists.rows[0]) {
          throw AppError.notFound('Internship not found.', 'internship_not_found');
        }

        const eligible = await pool.query(
          `SELECT u.id, u.display_name, u.email,
                  (SELECT count(*)::int FROM internship_required_skills irs
                    WHERE irs.internship_id = $1 AND irs.importance = 'required') AS required_count,
                  (SELECT count(*)::int FROM internship_required_skills irs
                    WHERE irs.internship_id = $1 AND irs.importance = 'required'
                      AND EXISTS (SELECT 1 FROM user_skills us
                                   WHERE us.user_id = u.id AND us.skill_id = irs.skill_id)) AS matched_count
             FROM users u
            WHERE u.college_id = $2 AND u.role = 'student' AND u.status = 'active'
            ORDER BY u.display_name ASC`,
          [internshipId, id],
        );

        const totalRequired = await pool.query(
          `SELECT count(*)::int AS count FROM internship_required_skills
            WHERE internship_id = $1 AND importance = 'required'`,
          [internshipId],
        );

        const required = totalRequired.rows[0]?.count ?? 0;

        // An internship with no required skills is open to everyone at the
        // college rather than to nobody, which is what a `count(*) >= 0` test
        // would otherwise produce.
        const students = eligible.rows.filter(
          (row: { matched_count: number }) => row.matched_count >= required,
        );

        res.status(200).json({
          eligibleStudents: students,
          total: students.length,
          requiredSkills: required,
          requestId: requestId(res),
        });
      })().catch(next);
    },
  );

  /**
   * Recommend an internship to the eligible cohort.
   *
   * This is a real write: one `notifications` row per matched student, so the
   * student sees it in their own portal on any device. It uses the existing
   * notifications table rather than introducing a recommendations table, because
   * a recommendation is a message to a person, not a new domain entity.
   *
   * `INSERT ... SELECT` keeps this atomic — either every eligible student is
   * notified or none is, and there is no window where a partial cohort was
   * reached.
   */
  router.post(
    '/api/college/internships/:id/recommend',
    requireAuth,
    requireOrganization('college'),
    (req, res, next) => {
      void (async () => {
        const id = collegeId(req);
        const internshipId = readUuidParam(req.params);

        const internship = await pool.query(
          `SELECT i.id, i.title, i.slug, i.application_deadline, co.name AS company_name
             FROM internships i
             JOIN companies co ON co.id = i.company_id
            WHERE i.id = $1`,
          [internshipId],
        );

        if (!internship.rows[0]) {
          throw AppError.notFound('Internship not found.', 'internship_not_found');
        }

        const [required, eligible] = await Promise.all([
          pool.query<{ count: number }>(
            `SELECT count(*)::int AS count FROM internship_required_skills
              WHERE internship_id = $1 AND importance = 'required'`,
            [internshipId],
          ),
          pool.query<{ id: string }>(
            `SELECT u.id
               FROM users u
              WHERE u.college_id = $2 AND u.role = 'student' AND u.status = 'active'
                AND NOT EXISTS (
                      SELECT 1 FROM internship_required_skills irs
                       WHERE irs.internship_id = $1 AND irs.importance = 'required'
                         AND NOT EXISTS (SELECT 1 FROM user_skills us
                                          WHERE us.user_id = u.id AND us.skill_id = irs.skill_id))`,
            [internshipId, id],
          ),
        ]);

        const requiredCount = required.rows[0]?.count ?? 0;
        const recipients = eligible.rows.map((row) => row.id);

        if (recipients.length === 0) {
          res.status(200).json({
            notified: 0,
            requiredSkills: requiredCount,
            message: 'No student at this college currently meets the required skills.',
            requestId: requestId(res),
          });
          return;
        }

        const title = internship.rows[0].title as string;
        const companyName = internship.rows[0].company_name as string;

        const notified = await pool.query(
          `INSERT INTO notifications (recipient_user_id, type, title, message, link, meta)
           SELECT u.id, 'opportunity', $1, $2, $3, $4::jsonb
             FROM users u
            WHERE u.id = ANY($5::uuid[])
         RETURNING id`,
          [
            `Recommended internship: ${title}`,
            `${companyName} posted ${title}. Your verified skills match the requirements.`,
            `/student/opportunities/${internship.rows[0].slug}`,
            JSON.stringify({
              internshipId,
              companyName,
              recommendedBy: req.user!.userId,
              requiredSkills: requiredCount,
              applicationDeadline: internship.rows[0].application_deadline,
            }),
            recipients,
          ],
        );

        res.status(201).json({
          notified: notified.rows.length,
          requiredSkills: requiredCount,
          requestId: requestId(res),
        });
      })().catch(next);
    },
  );

  /**
   * Summary counts for the college dashboard.
   *
   * Each count is computed with the caller's college in the WHERE clause rather
   * than by counting a list the client already holds, so the numbers agree with
   * what a refresh would show.
   */
  router.get('/api/college/overview', requireAuth, requireOrganization('college'), (req, res, next) => {
    void (async () => {
      const id = collegeId(req);

      const counts = await pool.query(
        `SELECT
           (SELECT count(*)::int FROM users WHERE college_id = $1 AND role = 'student') AS students,
           (SELECT count(*)::int FROM training_programs WHERE college_id = $1 AND status <> 'completed') AS active_training_programs,
           (SELECT count(*)::int FROM training_enrollments te
              JOIN training_programs tp ON tp.id = te.training_program_id
             WHERE tp.college_id = $1 AND te.status <> 'withdrawn') AS training_enrollments,
           (SELECT count(*)::int FROM campus_announcements WHERE college_id = $1 AND status = 'published') AS published_announcements,
           (SELECT count(*)::int FROM placement_drives WHERE college_id = $1 AND status <> 'completed') AS upcoming_placement_drives,
           (SELECT count(*)::int FROM college_company WHERE college_id = $1 AND partnership_status = 'active') AS active_partnerships,
           (SELECT count(*)::int FROM curriculum_modules WHERE college_id = $1 AND status = 'adopted') AS adopted_curriculum_modules`,
        [id],
      );

      res.status(200).json({ overview: counts.rows[0], requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}
