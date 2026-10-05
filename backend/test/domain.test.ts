import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  api,
  bearer,
  createFirebaseUser,
  getPool,
  resetIdentityTables,
  setupTestContext,
  teardownTestContext,
  uniqueEmail,
} from './harness';

/**
 * Domain routes against Neon dev.
 *
 * Real Firebase Auth emulator for tokens, real PostgreSQL for state, no mocks.
 * The properties under test are the ones the migration has to get right:
 *
 *  - a route cannot be reached without a verified token (401)
 *  - a token with no users row cannot be reached at all (403 registration_required)
 *  - a role from localStorage or the request body is never consulted
 *  - one student cannot read or mutate another student's rows (404, not 403)
 *  - one company cannot read or mutate another company's rows
 *  - a write actually persists, and a rejected write persists nothing
 */

type Actor = { token: string; userId: string };

/** Companies and colleges created per test run, removed in after(). */
const createdCompanyIds: string[] = [];
const createdCollegeIds: string[] = [];

before(async () => {
  await setupTestContext();
});

after(async () => {
  // Deleting the users cascades to every student-owned table. Organization rows
  // are not user-owned, so they are removed explicitly.
  await resetIdentityTables();

  if (createdCollegeIds.length > 0) {
    await getPool().query('DELETE FROM colleges WHERE id = ANY($1::uuid[])', [createdCollegeIds]);
  }
  if (createdCompanyIds.length > 0) {
    await getPool().query('DELETE FROM companies WHERE id = ANY($1::uuid[])', [createdCompanyIds]);
  }

  await teardownTestContext();
});

async function registerStudent(): Promise<Actor> {
  const { token } = await createFirebaseUser(uniqueEmail('student'));
  const res = await api()
    .post('/api/auth/register')
    .set(...bearer(token))
    .send({ intentRole: 'student' });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return { token, userId: res.body.userId as string };
}

/**
 * Creates an active recruiter whose users row already points at a company.
 *
 * Written directly rather than through POST /api/role-requests + approve,
 * because the approval flow is already covered in phase1.test.ts and these tests
 * care about the domain routes.
 */
async function registerRecruiter(label = 'company'): Promise<Actor & { companyId: string }> {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const company = await getPool().query<{ id: string }>(
    `INSERT INTO companies (name, normalized_name, industry, city, country)
     VALUES ($1,$2,'technology','Bengaluru','India') RETURNING id`,
    [`Test ${label} ${suffix}`, `test ${label} ${suffix}`],
  );
  createdCompanyIds.push(company.rows[0].id);

  const { token } = await createFirebaseUser(uniqueEmail('recruiter'));
  const res = await api()
    .post('/api/auth/register')
    .set(...bearer(token))
    .send({ intentRole: 'industry', organization: { name: `Test ${label} ${suffix}` } });
  assert.equal(res.status, 201, JSON.stringify(res.body));

  const promoted = await getPool().query<{ id: string }>(
    `UPDATE users SET role = 'industry', status = 'active', company_id = $1 WHERE id = $2 RETURNING id`,
    [company.rows[0].id, res.body.userId],
  );

  return { token, userId: promoted.rows[0].id, companyId: company.rows[0].id };
}

async function registerOfficer(): Promise<Actor & { collegeId: string }> {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const college = await getPool().query<{ id: string }>(
    `INSERT INTO colleges (name, normalized_name, code) VALUES ($1,$2,$3) RETURNING id`,
    [`Test College ${suffix}`, `test college ${suffix}`, `TC${suffix.slice(-8)}`],
  );
  createdCollegeIds.push(college.rows[0].id);

  const { token } = await createFirebaseUser(uniqueEmail('officer'));
  const res = await api()
    .post('/api/auth/register')
    .set(...bearer(token))
    .send({ intentRole: 'college', organization: { name: `Test College ${suffix}`, code: `TC${suffix.slice(-8)}` } });
  assert.equal(res.status, 201, JSON.stringify(res.body));

  const promoted = await getPool().query<{ id: string }>(
    `UPDATE users SET role = 'college', status = 'active', college_id = $1 WHERE id = $2 RETURNING id`,
    [college.rows[0].id, res.body.userId],
  );

  return { token, userId: promoted.rows[0].id, collegeId: college.rows[0].id };
}

async function aSeededSkillId(): Promise<string> {
  const result = await getPool().query<{ id: string }>('SELECT id FROM skills ORDER BY name LIMIT 1');
  assert.ok(result.rows[0], 'the dev seed must provide at least one skill');
  return result.rows[0].id;
}

/* ======================================================== auth boundary */

describe('domain auth boundary', () => {
  it('401 on a student route without a token', async () => {
    const res = await api().get('/api/student/profile');
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'missing_authorization');
  });

  it('403 registration_required for a valid token with no users row', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('unregistered'));
    const res = await api().get('/api/student/profile').set(...bearer(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'registration_required');
  });

  it('403 for a student reaching an industry-only route', async () => {
    const student = await registerStudent();
    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(student.token))
      .send({ title: 'Nope' });
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'forbidden');
  });

  it('400 on a malformed body before any write', async () => {
    const recruiter = await registerRecruiter('validation');
    const before = await getPool().query<{ count: string }>(
      `SELECT count(*)::text AS count FROM jobs WHERE company_id = $1`,
      [recruiter.companyId],
    );

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: '' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'validation_failed');

    const after = await getPool().query<{ count: string }>(
      `SELECT count(*)::text AS count FROM jobs WHERE company_id = $1`,
      [recruiter.companyId],
    );
    assert.equal(after.rows[0].count, before.rows[0].count, 'a rejected body must write nothing');
  });
});

/* ====================================================== student profile */

describe('student profile', () => {
  it('creates the profile row on first read', async () => {
    const student = await registerStudent();

    const res = await api().get('/api/student/profile').set(...bearer(student.token));
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.userId, student.userId);
    assert.equal(res.body.profile.profile_completion, 0);
    assert.deepEqual(res.body.projects, []);
  });

  it('persists a patch and recomputes completion server-side', async () => {
    const student = await registerStudent();

    const res = await api()
      .patch('/api/student/profile')
      .set(...bearer(student.token))
      .send({ degree: 'B.Tech', department: 'CSE', cgpa: 8.4, careerGoal: 'Platform engineering' });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.profile.degree, 'B.Tech');

    // Read it back from a second request: the value is in PostgreSQL, not in a
    // response the client happened to keep.
    const reread = await api().get('/api/student/profile').set(...bearer(student.token));
    assert.equal(reread.body.profile.cgpa, '8.40');
    assert.ok(Number(reread.body.profile.profile_completion) > 0);

    const row = await getPool().query<{ degree: string }>(
      'SELECT degree FROM student_profiles WHERE user_id = $1',
      [student.userId],
    );
    assert.equal(row.rows[0].degree, 'B.Tech');
  });

  it('rejects a cgpa outside the column range', async () => {
    const student = await registerStudent();
    const res = await api()
      .patch('/api/student/profile')
      .set(...bearer(student.token))
      .send({ cgpa: 99 });
    // The Zod range catches it before the numeric(3,2) CHECK, so this is a 400
    // rather than the 422 the database would have produced.
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'validation_failed');
  });

  it('upserts education per level rather than duplicating it', async () => {
    const student = await registerStudent();

    const first = await api()
      .put('/api/student/education')
      .set(...bearer(student.token))
      .send({ level: 'college', institutionName: 'Test University', degree: 'B.Tech' });
    assert.equal(first.status, 200, JSON.stringify(first.body));

    const second = await api()
      .put('/api/student/education')
      .set(...bearer(student.token))
      .send({ level: 'college', institutionName: 'Test University Renamed' });
    assert.equal(second.status, 200, 'the same level must update, not duplicate');

    const rows = await getPool().query<{ institution_name: string }>(
      'SELECT institution_name FROM education_records WHERE user_id = $1 AND level = $2',
      [student.userId, 'college'],
    );
    assert.equal(rows.rows.length, 1);
    assert.equal(rows.rows[0].institution_name, 'Test University Renamed');
  });

  it('hides another student project behind a 404', async () => {
    const owner = await registerStudent();
    const stranger = await registerStudent();

    const created = await api()
      .post('/api/student/projects')
      .set(...bearer(owner.token))
      .send({ title: 'Private project', techStack: ['typescript'] });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    const projectId = created.body.project.id as string;

    const patch = await api()
      .patch(`/api/student/projects/${projectId}`)
      .set(...bearer(stranger.token))
      .send({ title: 'Hijacked' });
    assert.equal(patch.status, 404, 'a foreign project id must not be disclosed');

    const remove = await api()
      .delete(`/api/student/projects/${projectId}`)
      .set(...bearer(stranger.token));
    assert.equal(remove.status, 404);

    const stillThere = await getPool().query('SELECT 1 FROM projects WHERE id = $1', [projectId]);
    assert.equal(stillThere.rows.length, 1, 'the row must be untouched');
  });

  it('recomputes completion when a project is added and deleted', async () => {
    const student = await registerStudent();

    const withProject = await api()
      .post('/api/student/projects')
      .set(...bearer(student.token))
      .send({ title: 'Counts towards completion' });
    assert.equal(withProject.status, 201);

    const afterAdd = await getPool().query<{ profile_completion: number }>(
      'SELECT profile_completion FROM student_profiles WHERE user_id = $1',
      [student.userId],
    );
    assert.ok(afterAdd.rows[0].profile_completion >= 10);

    const removed = await api()
      .delete(`/api/student/projects/${withProject.body.project.id}`)
      .set(...bearer(student.token));
    assert.equal(removed.status, 204);

    const afterRemove = await getPool().query<{ profile_completion: number }>(
      'SELECT profile_completion FROM student_profiles WHERE user_id = $1',
      [student.userId],
    );
    assert.equal(afterRemove.rows[0].profile_completion, 0);
  });

  it('stores certification metadata', async () => {
    const student = await registerStudent();

    const res = await api()
      .post('/api/student/certifications')
      .set(...bearer(student.token))
      .send({
        title: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2026-01-15',
        expiryDate: '2029-01-15',
        credentialId: 'AWS-1234',
      });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.certification.title, 'AWS Solutions Architect');
  });

  it('400 on a malformed id rather than 404 or 500', async () => {
    const student = await registerStudent();
    const res = await api()
      .patch('/api/student/projects/not-a-uuid')
      .set(...bearer(student.token))
      .send({ title: 'x' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'invalid_id');
  });
});

/* ============================================================= skills */

describe('skills', () => {
  it('lists the catalogue to any active account', async () => {
    const student = await registerStudent();
    const res = await api().get('/api/skills').set(...bearer(student.token));
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.skills));
    assert.ok(res.body.skills.length > 0);
  });

  it('adds a skill, 409s on a duplicate, and persists progress', async () => {
    const student = await registerStudent();
    const skillId = await aSeededSkillId();

    const added = await api()
      .post('/api/student/skills')
      .set(...bearer(student.token))
      .send({ skillId, progress: 20, learningStatus: 'in_progress' });
    assert.equal(added.status, 201, JSON.stringify(added.body));

    const duplicate = await api()
      .post('/api/student/skills')
      .set(...bearer(student.token))
      .send({ skillId });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, 'skill_already_added');

    const progressed = await api()
      .patch(`/api/student/skills/${skillId}`)
      .set(...bearer(student.token))
      .send({ progress: 75, learningStatus: 'in_progress' });
    assert.equal(progressed.status, 200);
    assert.equal(progressed.body.skill.progress, 75);

    const stored = await getPool().query<{ progress: number }>(
      'SELECT progress FROM user_skills WHERE user_id = $1 AND skill_id = $2',
      [student.userId, skillId],
    );
    assert.equal(stored.rows[0].progress, 75);
  });

  it('422 when adding a skill id that does not exist', async () => {
    const student = await registerStudent();
    const res = await api()
      .post('/api/student/skills')
      .set(...bearer(student.token))
      .send({ skillId: '00000000-0000-4000-8000-000000000999' });
    assert.equal(res.status, 422);
    assert.equal(res.body.code, 'referenced_record_not_found');
  });

  it('verification always writes verified_at and verification_type together', async () => {
    const student = await registerStudent();
    const skillId = await aSeededSkillId();

    await api()
      .post('/api/student/skills')
      .set(...bearer(student.token))
      .send({ skillId });

    const verified = await api()
      .post(`/api/student/skills/${skillId}/verify`)
      .set(...bearer(student.token))
      .send({ verificationType: 'claimed', evidenceSource: 'self_declared' });
    assert.equal(verified.status, 200, JSON.stringify(verified.body));
    assert.equal(verified.body.skill.is_verified, true);
    assert.ok(verified.body.skill.verified_at, 'the CHECK constraint requires this');
    assert.equal(verified.body.skill.verification_type, 'claimed');
  });

  it('404s when verifying a skill that is not on the profile', async () => {
    const student = await registerStudent();
    const skillId = await aSeededSkillId();

    const res = await api()
      .post(`/api/student/skills/${skillId}/verify`)
      .set(...bearer(student.token))
      .send({});
    assert.equal(res.status, 404);
  });
});

/* ====================================================== opportunities */

describe('opportunities', () => {
  it('lets a recruiter post a job scoped to their own company', async () => {
    const recruiter = await registerRecruiter('poster');

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({
        title: 'Platform Engineer',
        workMode: 'hybrid',
        employmentType: 'full_time',
        salaryRange: '₹18 - 26 LPA',
        status: 'active',
        responsibilities: ['Run services'],
        qualifications: ['Strong fundamentals'],
      });
    assert.equal(res.status, 201, JSON.stringify(res.body));

    const row = await getPool().query<{ company_id: string; posted_at: Date | null }>(
      'SELECT company_id, posted_at FROM jobs WHERE id = $1',
      [res.body.job.id],
    );
    assert.equal(row.rows[0].company_id, recruiter.companyId);
    assert.ok(row.rows[0].posted_at, 'an active job gets a posted_at');
  });

  it('keeps a draft unposted until it goes live', async () => {
    const recruiter = await registerRecruiter('draft');

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Unpublished Role', status: 'draft' });
    assert.equal(res.status, 201);

    const row = await getPool().query<{ posted_at: Date | null }>(
      'SELECT posted_at FROM jobs WHERE id = $1',
      [res.body.job.id],
    );
    assert.equal(row.rows[0].posted_at, null);
  });

  it('rejects a client-supplied companyId outright rather than ignoring it', async () => {
    const recruiter = await registerRecruiter('owner');
    const other = await registerRecruiter('other');

    const before = await getPool().query<{ count: string }>(
      'SELECT count(*)::text AS count FROM jobs WHERE company_id = ANY($1::uuid[])',
      [[recruiter.companyId, other.companyId]],
    );

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Attempted Tenant Override', status: 'active', companyId: other.companyId });
    assert.equal(res.status, 400, 'a caller-supplied tenant id is an unknown field, not a hint');
    assert.equal(res.body.code, 'validation_failed');

    const after = await getPool().query<{ count: string }>(
      'SELECT count(*)::text AS count FROM jobs WHERE company_id = ANY($1::uuid[])',
      [[recruiter.companyId, other.companyId]],
    );
    assert.equal(after.rows[0].count, before.rows[0].count);
  });

  it('404s when a recruiter edits another company job', async () => {
    const owner = await registerRecruiter('edit-owner');
    const intruder = await registerRecruiter('edit-intruder');

    const created = await api()
      .post('/api/industry/jobs')
      .set(...bearer(owner.token))
      .send({ title: 'Owned Job', status: 'active' });
    assert.equal(created.status, 201);

    const res = await api()
      .patch(`/api/industry/jobs/${created.body.job.id}`)
      .set(...bearer(intruder.token))
      .send({ title: 'Stolen' });
    assert.equal(res.status, 404);

    const unchanged = await getPool().query<{ title: string }>('SELECT title FROM jobs WHERE id = $1', [
      created.body.job.id,
    ]);
    assert.equal(unchanged.rows[0].title, 'Owned Job');
  });

  it('writes job and its required skills in one transaction', async () => {
    const recruiter = await registerRecruiter('skills-tx');
    const skillId = await aSeededSkillId();

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({
        title: 'Role With Skills',
        status: 'active',
        requiredSkills: [{ skillId, level: 'advanced', importance: 'required' }],
      });
    assert.equal(res.status, 201, JSON.stringify(res.body));

    const join = await getPool().query<{ level: string }>(
      'SELECT level FROM job_required_skills WHERE job_id = $1 AND skill_id = $2',
      [res.body.job.id, skillId],
    );
    assert.equal(join.rows[0].level, 'advanced');
  });

  it('rolls the job back when a required skill id is bogus', async () => {
    const recruiter = await registerRecruiter('rollback');

    const before = await getPool().query<{ count: string }>(
      `SELECT count(*)::text AS count FROM jobs WHERE company_id = $1`,
      [recruiter.companyId],
    );

    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({
        title: 'Doomed Job',
        status: 'active',
        requiredSkills: [{ skillId: '00000000-0000-4000-8000-000000000999' }],
      });
    assert.equal(res.status, 422);

    const after = await getPool().query<{ count: string }>(
      `SELECT count(*)::text AS count FROM jobs WHERE company_id = $1`,
      [recruiter.companyId],
    );
    assert.equal(after.rows[0].count, before.rows[0].count, 'the parent row must not survive a failed join');
  });

  it('shows an active job to a student but not a draft', async () => {
    const recruiter = await registerRecruiter('visibility');
    const student = await registerStudent();

    await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Visible To Students', status: 'active', city: 'Bengaluru' });
    await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Hidden Draft', status: 'draft', city: 'Bengaluru' });

    const res = await api()
      .get('/api/opportunities?status=active&search=Visible')
      .set(...bearer(student.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.jobs.length, 1);
    assert.equal(res.body.jobs[0].title, 'Visible To Students');
  });

  it('pins an industry listing filter to the caller company', async () => {
    const mine = await registerRecruiter('mine');
    const theirs = await registerRecruiter('theirs');

    await api().post('/api/industry/jobs').set(...bearer(mine.token)).send({ title: 'Mine Only', status: 'active' });
    await api().post('/api/industry/jobs').set(...bearer(theirs.token)).send({ title: 'Theirs Only', status: 'active' });

    const res = await api()
      .get(`/api/opportunities?status=active&companyId=${theirs.companyId}`)
      .set(...bearer(mine.token));
    assert.equal(res.status, 200);
    assert.deepEqual(
      res.body.jobs.map((j: { title: string }) => j.title),
      ['Mine Only'],
      'the filter is replaced by the caller company, so they see their own job and never theirs',
    );
  });
});

/* ======================================================= applications */

describe('applications', () => {
  async function postJobFor(recruiter: { token: string; companyId: string }, title: string) {
    const res = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title, status: 'active' });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    return res.body.job.id as string;
  }

  it('creates an application, derives company_id, and 409s on a duplicate', async () => {
    const recruiter = await registerRecruiter('apply');
    const student = await registerStudent();
    const jobId = await postJobFor(recruiter, 'Applied Role');

    const first = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId, matchScore: 82.5, matchedSkills: ['typescript'], missingSkills: ['kubernetes'] });
    assert.equal(first.status, 201, JSON.stringify(first.body));

    const stored = await getPool().query<{ company_id: string; stage: string }>(
      'SELECT company_id, stage FROM applications WHERE id = $1',
      [first.body.application.id],
    );
    assert.equal(stored.rows[0].company_id, recruiter.companyId, 'company is derived from the job');
    assert.equal(stored.rows[0].stage, 'new_application');

    const duplicate = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, 'application_already_exists');
  });

  it('writes the initial stage history row', async () => {
    const recruiter = await registerRecruiter('history');
    const student = await registerStudent();
    const jobId = await postJobFor(recruiter, 'History Role');

    const created = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId });
    assert.equal(created.status, 201);

    const history = await getPool().query<{ stage: string }>(
      'SELECT stage FROM application_stage_history WHERE application_id = $1',
      [created.body.application.id],
    );
    assert.equal(history.rows.length, 1);
    assert.equal(history.rows[0].stage, 'new_application');
  });

  it('422 when applying to a job that does not exist', async () => {
    const student = await registerStudent();
    const res = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId: '00000000-0000-4000-8000-000000000999' });
    assert.equal(res.status, 422);
    assert.equal(res.body.code, 'job_not_found');
  });

  it('400 when both jobId and internshipId are supplied', async () => {
    const student = await registerStudent();
    const res = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({
        jobId: '00000000-0000-4000-8000-000000000001',
        internshipId: '00000000-0000-4000-8000-000000000002',
      });
    assert.equal(res.status, 400);
  });

  it('never lists another student applications', async () => {
    const recruiter = await registerRecruiter('isolation');
    const owner = await registerStudent();
    const stranger = await registerStudent();
    const jobId = await postJobFor(recruiter, 'Isolation Role');

    await api().post('/api/student/applications').set(...bearer(owner.token)).send({ jobId });

    const res = await api().get('/api/student/applications').set(...bearer(stranger.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.applications.length, 0);
  });

  it('moves stage with history and notifies the candidate', async () => {
    const recruiter = await registerRecruiter('stage');
    const student = await registerStudent();
    const jobId = await postJobFor(recruiter, 'Stage Role');

    const created = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId });
    const applicationId = created.body.application.id as string;

    const moved = await api()
      .post(`/api/industry/applications/${applicationId}/stage`)
      .set(...bearer(recruiter.token))
      .send({ stage: 'shortlisted', note: 'Strong portfolio' });
    assert.equal(moved.status, 200, JSON.stringify(moved.body));
    assert.equal(moved.body.application.stage, 'shortlisted');

    const history = await api()
      .get(`/api/industry/applications/${applicationId}/history`)
      .set(...bearer(recruiter.token));
    assert.equal(history.status, 200);
    assert.deepEqual(
      history.body.history.map((h: { stage: string }) => h.stage),
      ['new_application', 'shortlisted'],
    );

    const inbox = await api().get('/api/notifications').set(...bearer(student.token));
    assert.ok(
      inbox.body.notifications.some((n: { title: string }) => n.title.includes('shortlisted')),
      'the candidate must be told on any device, not via the local sync bus',
    );
  });

  it('sets decided_at on a terminal stage only', async () => {
    const recruiter = await registerRecruiter('decided');
    const student = await registerStudent();
    const jobId = await postJobFor(recruiter, 'Decided Role');

    const created = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId });
    const applicationId = created.body.application.id as string;

    const screening = await api()
      .post(`/api/industry/applications/${applicationId}/stage`)
      .set(...bearer(recruiter.token))
      .send({ stage: 'screening' });
    assert.equal(screening.body.application.decided_at, null, 'screening is not terminal');

    const rejected = await api()
      .post(`/api/industry/applications/${applicationId}/stage`)
      .set(...bearer(recruiter.token))
      .send({ stage: 'rejected', note: 'Role filled' });
    assert.ok(rejected.body.application.decided_at, 'rejection must stamp decided_at');
  });

  it('404s a recruiter from another company moving the stage', async () => {
    const owner = await registerRecruiter('stage-owner');
    const intruder = await registerRecruiter('stage-intruder');
    const student = await registerStudent();
    const jobId = await postJobFor(owner, 'Guarded Role');

    const created = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId });

    const res = await api()
      .post(`/api/industry/applications/${created.body.application.id}/stage`)
      .set(...bearer(intruder.token))
      .send({ stage: 'hired' });
    assert.equal(res.status, 404, 'cross-tenant access must not be disclosed');

    const unchanged = await getPool().query<{ stage: string }>('SELECT stage FROM applications WHERE id = $1', [
      created.body.application.id,
    ]);
    assert.equal(unchanged.rows[0].stage, 'new_application');
  });

  it('notifies the recruiter when an application arrives', async () => {
    const recruiter = await registerRecruiter('notify');
    const student = await registerStudent();
    const jobId = await postJobFor(recruiter, 'Notify Role');

    await api().post('/api/student/applications').set(...bearer(student.token)).send({ jobId });

    const inbox = await api().get('/api/notifications').set(...bearer(recruiter.token));
    assert.ok(
      inbox.body.notifications.some((n: { type: string }) => n.type === 'application'),
      'this replaces the localStorage sync bus publishing to the industry portal',
    );
  });

  it('saves, lists and unsaves an opportunity', async () => {
    const student = await registerStudent();

    const saved = await api()
      .put('/api/student/saved')
      .set(...bearer(student.token))
      .send({ source: 'verified_api', externalId: 'ext-opp-42', title: 'Saved Role', companyName: 'Acme' });
    assert.equal(saved.status, 200, JSON.stringify(saved.body));

    const list = await api().get('/api/student/saved').set(...bearer(student.token));
    assert.equal(list.body.saved.length, 1);
    assert.equal(list.body.saved[0].external_id, 'ext-opp-42');

    const removed = await api()
      .delete('/api/student/saved/ext-opp-42')
      .set(...bearer(student.token));
    assert.equal(removed.status, 204);

    const emptied = await api().get('/api/student/saved').set(...bearer(student.token));
    assert.equal(emptied.body.saved.length, 0);
  });

  it('keeps saved items private to the owner', async () => {
    const owner = await registerStudent();
    const stranger = await registerStudent();

    await api()
      .put('/api/student/saved')
      .set(...bearer(owner.token))
      .send({ source: 'verified_api', externalId: 'ext-private' });

    const res = await api().get('/api/student/saved').set(...bearer(stranger.token));
    assert.equal(res.body.saved.length, 0);
  });
});

/* ====================================================== notifications */

describe('notifications', () => {
  it('creates only self-addressed notifications from the client', async () => {
    const owner = await registerStudent();
    const stranger = await registerStudent();

    const mine = await api()
      .post('/api/notifications')
      .set(...bearer(owner.token))
      .send({ recipientUserId: owner.userId, type: 'badge', title: 'Skill verified' });
    assert.equal(mine.status, 201, JSON.stringify(mine.body));

    const theirs = await api()
      .post('/api/notifications')
      .set(...bearer(stranger.token))
      .send({ recipientUserId: owner.userId, type: 'system', title: 'Phishing' });
    assert.equal(theirs.status, 403);
    assert.equal(theirs.body.code, 'notification_recipient_not_self');
  });

  it('marks one read and unreadCount reflects it', async () => {
    const student = await registerStudent();

    await api()
      .post('/api/notifications')
      .set(...bearer(student.token))
      .send({ recipientUserId: student.userId, type: 'system', title: 'First' });
    await api()
      .post('/api/notifications')
      .set(...bearer(student.token))
      .send({ recipientUserId: student.userId, type: 'system', title: 'Second' });

    const unread = await api().get('/api/notifications?unreadOnly=true').set(...bearer(student.token));
    assert.equal(unread.body.unreadCount, 2);

    const marked = await api()
      .post(`/api/notifications/${unread.body.notifications[0].id}/read`)
      .set(...bearer(student.token));
    assert.equal(marked.status, 200);

    const afterOne = await api().get('/api/notifications').set(...bearer(student.token));
    assert.equal(afterOne.body.unreadCount, 1);

    await api().post('/api/notifications/read-all').set(...bearer(student.token));
    const afterAll = await api().get('/api/notifications').set(...bearer(student.token));
    assert.equal(afterAll.body.unreadCount, 0);
  });

  it('404s marking a notification that belongs to someone else', async () => {
    const owner = await registerStudent();
    const stranger = await registerStudent();

    const created = await api()
      .post('/api/notifications')
      .set(...bearer(owner.token))
      .send({ recipientUserId: owner.userId, type: 'system', title: 'Private' });

    const list = await api().get('/api/notifications').set(...bearer(owner.token));
    const id = list.body.notifications[0].id as string;
    assert.ok(created.status === 201 && id);

    const res = await api().post(`/api/notifications/${id}/read`).set(...bearer(stranger.token));
    assert.equal(res.status, 404);
  });
});

/* ================================================== industry settings */

describe('industry hiring preferences and talent pool', () => {
  it('returns defaults before anything is saved', async () => {
    const recruiter = await registerRecruiter('prefs');

    const res = await api().get('/api/industry/hiring-preferences').set(...bearer(recruiter.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.preferences.is_default, true);
    assert.equal(res.body.preferences.search_radius_km, 25);
  });

  it('persists preferences and reloads them', async () => {
    const recruiter = await registerRecruiter('prefs-write');

    const saved = await api()
      .put('/api/industry/hiring-preferences')
      .set(...bearer(recruiter.token))
      .send({
        preferredDepartments: ['Computer Science & Engineering'],
        preferredDegrees: ['B.Tech'],
        preferredGraduationYears: ['2026'],
        preferredLocations: ['Bengaluru'],
        workModes: ['hybrid'],
        minimumCgpa: 7.5,
        prioritizeVerifiedSkills: true,
        searchRadiusKm: 40,
      });
    assert.equal(saved.status, 200, JSON.stringify(saved.body));

    const reread = await api().get('/api/industry/hiring-preferences').set(...bearer(recruiter.token));
    assert.equal(reread.body.preferences.search_radius_km, 40);
    assert.equal(reread.body.preferences.minimum_cgpa, '7.50');
    assert.deepEqual(reread.body.preferences.work_modes, ['hybrid']);
  });

  it('never lets a student reach hiring preferences', async () => {
    const student = await registerStudent();
    const res = await api()
      .put('/api/industry/hiring-preferences')
      .set(...bearer(student.token))
      .send({ searchRadiusKm: 10 });
    assert.equal(res.status, 403);
  });

  it('shortlists a real student account and refuses a non-student', async () => {
    const recruiter = await registerRecruiter('talent');
    const student = await registerStudent();

    const added = await api()
      .put('/api/industry/talent-pool')
      .set(...bearer(recruiter.token))
      .send({ candidateUserId: student.userId, category: 'Top Matches' });
    assert.equal(added.status, 200, JSON.stringify(added.body));

    const list = await api().get('/api/industry/talent-pool').set(...bearer(recruiter.token));
    assert.equal(list.body.entries.length, 1);
    assert.equal(list.body.entries[0].candidate_user_id, student.userId);

    const notAStudent = await api()
      .put('/api/industry/talent-pool')
      .set(...bearer(recruiter.token))
      .send({ candidateUserId: recruiter.userId, category: 'Nope' });
    assert.equal(notAStudent.status, 422);
    assert.equal(notAStudent.body.code, 'candidate_not_student');

    const removed = await api()
      .delete(`/api/industry/talent-pool/${student.userId}`)
      .set(...bearer(recruiter.token));
    assert.equal(removed.status, 204);
  });

  it('keeps the talent pool private per company', async () => {
    const mine = await registerRecruiter('pool-mine');
    const theirs = await registerRecruiter('pool-theirs');
    const student = await registerStudent();

    await api()
      .put('/api/industry/talent-pool')
      .set(...bearer(mine.token))
      .send({ candidateUserId: student.userId, category: 'Shortlisted' });

    const res = await api().get('/api/industry/talent-pool').set(...bearer(theirs.token));
    assert.equal(res.body.entries.length, 0);
  });
});

/* =========================================================== learning */

describe('learning', () => {
  it('lists published courses with derived progress', async () => {
    const student = await registerStudent();

    const res = await api().get('/api/courses?isPublished=true').set(...bearer(student.token));
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.ok(res.body.courses.length > 0);
    assert.equal(res.body.courses[0].progress_percent, 0);
    assert.equal(res.body.courses[0].is_default, undefined);
  });

  it('records per-material progress and derives the course percentage', async () => {
    const student = await registerStudent();

    const courses = await api().get('/api/courses?isPublished=true&limit=5').set(...bearer(student.token));
    const course = courses.body.courses.find((c: { material_count: number }) => c.material_count > 1);
    assert.ok(course, 'the seed must provide a course with several materials');

    const detail = await api().get(`/api/courses/${course.id}`).set(...bearer(student.token));
    assert.equal(detail.status, 200);
    const materialId = detail.body.materials[0].id as string;

    const marked = await api()
      .post(`/api/courses/${course.id}/materials/${materialId}/progress`)
      .set(...bearer(student.token))
      .send({ completed: true });
    assert.equal(marked.status, 200, JSON.stringify(marked.body));
    assert.ok(marked.body.progressPercent > 0 && marked.body.progressPercent < 100);

    const row = await getPool().query<{ completed: boolean }>(
      'SELECT completed FROM course_progress WHERE user_id = $1 AND material_id = $2',
      [student.userId, materialId],
    );
    assert.equal(row.rows[0].completed, true);
  });

  it('404s when a material does not belong to the course in the path', async () => {
    const student = await registerStudent();

    const courses = await api().get('/api/courses?isPublished=true&limit=2').set(...bearer(student.token));
    const [first, second] = courses.body.courses;
    if (!first || !second) {
      return;
    }

    const detail = await api().get(`/api/courses/${second.id}`).set(...bearer(student.token));
    const foreignMaterial = detail.body.materials[0]?.id;
    if (!foreignMaterial) {
      return;
    }

    const res = await api()
      .post(`/api/courses/${first.id}/materials/${foreignMaterial}/progress`)
      .set(...bearer(student.token))
      .send({ completed: true });
    assert.equal(res.status, 404);
    assert.equal(res.body.code, 'material_not_in_course');
  });

  it('enrols idempotently', async () => {
    const student = await registerStudent();
    const courses = await api().get('/api/courses?isPublished=true&limit=1').set(...bearer(student.token));
    const courseId = courses.body.courses[0].id as string;

    const first = await api()
      .post(`/api/courses/${courseId}/enroll`)
      .set(...bearer(student.token))
      .send({ status: 'enrolled' });
    assert.equal(first.status, 200);

    const second = await api()
      .post(`/api/courses/${courseId}/enroll`)
      .set(...bearer(student.token))
      .send({ status: 'completed' });

    const rows = await getPool().query<{ status: string }>(
      'SELECT status FROM student_course_enrollments WHERE user_id = $1 AND course_id = $2',
      [student.userId, courseId],
    );
    assert.equal(rows.rows.length, 1, 'enrolment is unique per user and course');
    assert.equal(rows.rows[0].status, 'completed');
    assert.equal(second.status, 200);
  });
});

/* ======================================================== challenges */

describe('challenges and submissions', () => {
  it('creates a challenge owned by the recruiter company', async () => {
    const recruiter = await registerRecruiter('challenge');

    const res = await api()
      .post('/api/industry/challenges')
      .set(...bearer(recruiter.token))
      .send({ title: 'Build Something', difficulty: 'intermediate', status: 'active', requiredSkills: ['typescript'] });
    assert.equal(res.status, 201, JSON.stringify(res.body));

    const row = await getPool().query<{ company_id: string }>('SELECT company_id FROM challenges WHERE id = $1', [
      res.body.challenge.id,
    ]);
    assert.equal(row.rows[0].company_id, recruiter.companyId);
  });

  it('records a submission and updates the denormalised counter', async () => {
    const recruiter = await registerRecruiter('challenge-sub');
    const student = await registerStudent();

    const challenge = await api()
      .post('/api/industry/challenges')
      .set(...bearer(recruiter.token))
      .send({ title: 'Counted Challenge', status: 'active' });

    const submitted = await api()
      .post(`/api/challenges/${challenge.body.challenge.id}/submissions`)
      .set(...bearer(student.token))
      .send({ teamName: 'Team Rocket', githubUrl: 'https://github.com/example/rocket' });
    assert.equal(submitted.status, 201, JSON.stringify(submitted.body));

    const counter = await getPool().query<{ submissions_count: number }>(
      'SELECT submissions_count FROM challenges WHERE id = $1',
      [challenge.body.challenge.id],
    );
    assert.equal(counter.rows[0].submissions_count, 1);
  });

  it('hides another team submissions from a student', async () => {
    const recruiter = await registerRecruiter('challenge-vis');
    const mine = await registerStudent();
    const theirs = await registerStudent();

    const challenge = await api()
      .post('/api/industry/challenges')
      .set(...bearer(recruiter.token))
      .send({ title: 'Private Teams', status: 'active' });
    const challengeId = challenge.body.challenge.id as string;

    await api()
      .post(`/api/challenges/${challengeId}/submissions`)
      .set(...bearer(mine.token))
      .send({ teamName: 'My Team' });

    const strangerView = await api()
      .get(`/api/challenges/${challengeId}/submissions`)
      .set(...bearer(theirs.token));
    assert.equal(strangerView.body.submissions.length, 0, 'students only see their own team');

    const ownerView = await api()
      .get(`/api/challenges/${challengeId}/submissions`)
      .set(...bearer(recruiter.token));
    assert.equal(ownerView.body.submissions.length, 1, 'the challenge owner sees all of them');
  });

  it('stops a recruiter scoring another company challenge', async () => {
    const owner = await registerRecruiter('score-owner');
    const intruder = await registerRecruiter('score-intruder');
    const student = await registerStudent();

    const challenge = await api()
      .post('/api/industry/challenges')
      .set(...bearer(owner.token))
      .send({ title: 'Scored Challenge', status: 'active' });
    const challengeId = challenge.body.challenge.id as string;

    const submission = await api()
      .post(`/api/challenges/${challengeId}/submissions`)
      .set(...bearer(student.token))
      .send({ teamName: 'Scored Team' });

    const res = await api()
      .patch(`/api/industry/challenges/${challengeId}/submissions/${submission.body.submission.id}`)
      .set(...bearer(intruder.token))
      .send({ status: 'winner', score: 100 });
    assert.equal(res.status, 404);

    const unchanged = await getPool().query<{ status: string }>(
      'SELECT status FROM challenge_submissions WHERE id = $1',
      [submission.body.submission.id],
    );
    assert.equal(unchanged.rows[0].status, 'under_review');
  });
});

/* ============================================== interviews and offers */

describe('interviews and offers', () => {
  it('schedules an interview for the candidate behind an application', async () => {
    const recruiter = await registerRecruiter('interview');
    const student = await registerStudent();

    const job = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Interview Role', status: 'active' });
    const application = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId: job.body.job.id });

    const scheduled = await api()
      .post('/api/industry/interviews')
      .set(...bearer(recruiter.token))
      .send({
        applicationId: application.body.application.id,
        round: 'technical',
        scheduledAt: '2026-11-01T10:00:00.000Z',
        mode: 'online',
      });
    assert.equal(scheduled.status, 201, JSON.stringify(scheduled.body));

    const stored = await getPool().query<{ candidate_user_id: string }>(
      'SELECT candidate_user_id FROM interviews WHERE id = $1',
      [scheduled.body.interview.id],
    );
    assert.equal(stored.rows[0].candidate_user_id, student.userId, 'the candidate is resolved, never supplied');

    const inbox = await api().get('/api/notifications').set(...bearer(student.token));
    assert.ok(
      inbox.body.notifications.some((n: { type: string }) => n.type === 'interview'),
      'the candidate is notified in the same transaction as the interview row',
    );
  });

  it('422 when scheduling against an opportunity with no application', async () => {
    const recruiter = await registerRecruiter('interview-empty');

    const job = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'No Applicants', status: 'active' });

    const res = await api()
      .post('/api/industry/interviews')
      .set(...bearer(recruiter.token))
      .send({ jobId: job.body.job.id, round: 'hr', scheduledAt: '2026-11-02T10:00:00.000Z' });
    assert.equal(res.status, 422);
    assert.equal(res.body.code, 'no_application_for_opportunity');
  });

  it('lets a candidate accept an offer but not rewrite it to draft', async () => {
    const recruiter = await registerRecruiter('offer');
    const student = await registerStudent();

    const job = await api()
      .post('/api/industry/jobs')
      .set(...bearer(recruiter.token))
      .send({ title: 'Offer Role', status: 'active' });
    const application = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId: job.body.job.id });

    const offer = await api()
      .post('/api/industry/offers')
      .set(...bearer(recruiter.token))
      .send({
        applicationId: application.body.application.id,
        offerType: 'full_time_employment',
        compensation: '₹24 LPA',
        status: 'sent',
      });
    assert.equal(offer.status, 201, JSON.stringify(offer.body));
    const offerId = offer.body.offer.id as string;

    const accepted = await api().patch(`/api/offers/${offerId}`).set(...bearer(student.token)).send({ status: 'accepted' });
    assert.equal(accepted.status, 200);
    assert.equal(accepted.body.offer.status, 'accepted');

    const other = await api()
      .post('/api/industry/offers')
      .set(...bearer(recruiter.token))
      .send({ applicationId: application.body.application.id, offerType: 'summer_internship', status: 'sent' });
    const forbidden = await api()
      .patch(`/api/offers/${other.body.offer.id}`)
      .set(...bearer(student.token))
      .send({ status: 'draft' });
    assert.equal(forbidden.status, 403);
    assert.equal(forbidden.body.code, 'offer_status_not_permitted');
  });

  it('404s an offer that belongs to another company', async () => {
    const owner = await registerRecruiter('offer-owner');
    const intruder = await registerRecruiter('offer-intruder');
    const student = await registerStudent();

    const job = await api()
      .post('/api/industry/jobs')
      .set(...bearer(owner.token))
      .send({ title: 'Guarded Offer', status: 'active' });
    const application = await api()
      .post('/api/student/applications')
      .set(...bearer(student.token))
      .send({ jobId: job.body.job.id });

    const offer = await api()
      .post('/api/industry/offers')
      .set(...bearer(owner.token))
      .send({ applicationId: application.body.application.id, offerType: 'full_time_employment', status: 'sent' });

    const res = await api()
      .patch(`/api/offers/${offer.body.offer.id}`)
      .set(...bearer(intruder.token))
      .send({ status: 'declined' });
    assert.equal(res.status, 404);
  });
});

/* ================================================== organization profiles */

describe('account fields (PATCH /api/auth/me)', () => {
  it('persists the person-owned fields onboarding collects', async () => {
    const student = await registerStudent();

    const res = await api()
      .patch('/api/auth/me')
      .set(...bearer(student.token))
      .send({
        displayName: 'Aarav Sharma',
        phone: '+91 90000 00000',
        title: 'Placement Coordinator',
        onboardingCompleted: true,
      });

    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.displayName, 'Aarav Sharma');
    assert.equal(res.body.title, 'Placement Coordinator');
    assert.equal(res.body.onboardingCompleted, true);

    // The point of the route: the value is in PostgreSQL, not in a Firestore blob,
    // so a fresh sign-in on another device reads the same thing back.
    const reread = await api().get('/api/auth/me').set(...bearer(student.token));
    assert.equal(reread.body.title, 'Placement Coordinator');
    assert.equal(reread.body.onboardingCompleted, true);
  });

  it('leaves absent keys alone and clears an explicit null', async () => {
    const student = await registerStudent();

    await api()
      .patch('/api/auth/me')
      .set(...bearer(student.token))
      .send({ title: 'Talent Sourcer', displayName: 'Kept Name' });

    const cleared = await api()
      .patch('/api/auth/me')
      .set(...bearer(student.token))
      .send({ title: null });

    assert.equal(cleared.status, 200);
    assert.equal(cleared.body.title, null, 'explicit null must clear');
    assert.equal(cleared.body.displayName, 'Kept Name', 'absent key must be untouched');
  });

  it('refuses to accept role, status or organization ids', async () => {
    const student = await registerStudent();

    // The single most important assertion in this file: a person editing their
    // own profile must not be able to promote themselves.
    const res = await api()
      .patch('/api/auth/me')
      .set(...bearer(student.token))
      .send({ role: 'admin', companyId: '11111111-1111-1111-1111-111111111111' });

    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'validation_failed');

    const unchanged = await api().get('/api/auth/me').set(...bearer(student.token));
    assert.equal(unchanged.body.role, 'student');
    assert.equal(unchanged.body.status, 'active');
    assert.equal(unchanged.body.companyId, null);
  });

  it('401s without a token and 403s a token with no users row', async () => {
    const anon = await api().patch('/api/auth/me').send({ displayName: 'No Token' });
    assert.equal(anon.status, 401);

    const { token } = await createFirebaseUser(uniqueEmail('unregistered-account'));
    const unregistered = await api().patch('/api/auth/me').set(...bearer(token)).send({ displayName: 'X' });
    assert.equal(unregistered.status, 403);
    assert.equal(unregistered.body.code, 'registration_required');
  });
});

describe('organization profiles', () => {
  it('updates only the caller company', async () => {
    const recruiter = await registerRecruiter('profile');

    const res = await api()
      .patch('/api/industry/company')
      .set(...bearer(recruiter.token))
      .send({ tagline: 'We build things', about: 'A test company', techStack: ['typescript', 'postgres'] });
    assert.equal(res.status, 200, JSON.stringify(res.body));

    const stored = await getPool().query<{ tagline: string }>('SELECT tagline FROM companies WHERE id = $1', [
      recruiter.companyId,
    ]);
    assert.equal(stored.rows[0].tagline, 'We build things');
  });

  it('403s a college officer reaching the industry company route', async () => {
    const officer = await registerOfficer();
    const res = await api()
      .get('/api/industry/company')
      .set(...bearer(officer.token));
    assert.equal(res.status, 403);
  });

  it('updates the caller college including the jsonb placement officer', async () => {
    const officer = await registerOfficer();

    const res = await api()
      .patch('/api/college/profile')
      .set(...bearer(officer.token))
      .send({ about: 'A test college', naacGrade: 'A++', placementOfficer: { name: 'Officer', email: 'o@x.test' } });
    assert.equal(res.status, 200, JSON.stringify(res.body));

    const stored = await getPool().query<{ naac_grade: string; placement_officer: { name: string } }>(
      'SELECT naac_grade, placement_officer FROM colleges WHERE id = $1',
      [officer.collegeId],
    );
    assert.equal(stored.rows[0].naac_grade, 'A++');
    assert.equal(stored.rows[0].placement_officer.name, 'Officer');
  });

  it('rejects an unknown company profile field', async () => {
    const recruiter = await registerRecruiter('strict');
    const res = await api()
      .patch('/api/industry/company')
    .set(...bearer(recruiter.token))
    .send({ notARealColumn: 'x' });
  assert.equal(res.status, 400, 'unknown fields must be rejected, not silently dropped');
  });
});

/* ================================================================ catalog */
/*
 * Migration 0014 added `skill_resources.source_id` because the static catalog
 * addresses resources by local id (`c-1`) while the database used UUIDs, and the
 * only previous link was the ordinal `position`. These tests cover the resolution
 * path so the frontend never has to derive a UUID itself.
 */

describe('skill catalog identity', () => {
  it('exposes source_id and resolves progress by it', async () => {
    const student = await registerStudent();

    // Any seeded skill will do; the point is the join between the catalog id the
    // client holds and the database row.
    const catalog = await api().get('/api/skills?limit=1').set(...bearer(student.token));
    assert.equal(catalog.status, 200);
    const skill = catalog.body.skills[0];
    assert.ok(skill?.slug, 'every seeded skill must carry the catalog slug');

    const detail = await api().get(`/api/skills/${skill.id}`).set(...bearer(student.token));
    assert.equal(detail.status, 200);

    const resource = detail.body.resources.find(
      (r: { source_id: string | null }) => r.source_id !== null,
    );
    assert.ok(resource, '0014 must backfill source_id on seeded resources');

    // Writing progress by source_id must hit the same row as writing by UUID.
    const bySourceId = await api()
      .post(`/api/student/skills/${skill.id}/resources/${resource.source_id}/progress`)
      .set(...bearer(student.token))
      .send({ completed: true });
    assert.equal(bySourceId.status, 200, JSON.stringify(bySourceId.body));
    assert.equal(bySourceId.body.progress.completed, true);

    const byUuid = await api()
      .post(`/api/student/skills/${skill.id}/resources/${resource.id}/progress`)
      .set(...bearer(student.token))
      .send({ completed: false });
    assert.equal(byUuid.status, 200);
    assert.equal(
      byUuid.body.progress.resource_id,
      bySourceId.body.progress.resource_id,
      'both id forms must address the same resource row',
    );
  });

  it('404s a source_id used against the wrong skill', async () => {
    const student = await registerStudent();

    const catalog = await api().get('/api/skills?limit=200').set(...bearer(student.token));
    const withResources: Array<{ id: string; slug: string }> = catalog.body.skills;

    // Find two distinct skills so a source_id from one can be tried against the other.
    let first: { skillId: string; sourceId: string } | null = null;
    for (const candidate of withResources) {
      const detail = await api().get(`/api/skills/${candidate.id}`).set(...bearer(student.token));
      const resource = detail.body.resources.find((r: { source_id: string | null }) => r.source_id);
      if (resource) {
        first = { skillId: candidate.id, sourceId: resource.source_id };
        break;
      }
    }

    assert.ok(first, 'the seed must provide at least one skill with resources');

    const other = withResources.find((s) => s.id !== first!.skillId);
    assert.ok(other, 'the seed must provide more than one skill');

    const res = await api()
      .post(`/api/student/skills/${other.id}/resources/${first!.sourceId}/progress`)
      .set(...bearer(student.token))
      .send({ completed: true });

    assert.equal(
      res.status,
      404,
      'a source_id must not resolve across skills — the unique index is per skill',
    );
  });

  it('keeps source_id unique per skill and non-null on seeded rows', async () => {
    const totals = await getPool().query<{
      total: string;
      with_source_id: string;
      dupes: string;
    }>(
      `SELECT count(*)::text AS total,
              count(source_id)::text AS with_source_id,
              (SELECT count(*)::text FROM (
                 SELECT skill_id, source_id FROM skill_resources
                  WHERE source_id IS NOT NULL
                  GROUP BY skill_id, source_id HAVING count(*) > 1
               ) d) AS dupes
         FROM skill_resources`,
    );

    assert.equal(
      Number(totals.rows[0].total),
      Number(totals.rows[0].with_source_id),
      'every seeded resource must carry a source_id',
    );
    assert.equal(totals.rows[0].dupes, '0', 'source_id must be unique within a skill');
  });
});
/*
 * The college portal had no backend at all. 0011_college.sql created six tables
 * and nothing served them, so the portal ran on useState arrays seeded from mock
 * data: `tp-new-${Date.now()}`, `anc-${Date.now()}`, and `importStudents(n)`
 * incrementing a counter in memory. These tests are the first thing to check
 * that the tables actually hold what the portal needs.
 */

describe('college portal', () => {
  it('401 without a token and 403 for a student', async () => {
    const anon = await api().get('/api/college/training-programs');
    assert.equal(anon.status, 401);

    const student = await registerStudent();
    const wrongRole = await api().get('/api/college/training-programs').set(...bearer(student.token));
    assert.equal(wrongRole.status, 403);
    assert.equal(wrongRole.body.code, 'forbidden');
  });

  it('persists a training program and lists it back with counts', async () => {
    const officer = await registerOfficer();
    const skillId = await aSeededSkillId();

    const created = await api()
      .post('/api/college/training-programs')
      .set(...bearer(officer.token))
      .send({
        name: 'Kubernetes for Platform Teams',
        skillId,
        skillName: 'Kubernetes',
        skillLevel: 'advanced',
        startDate: '2026-11-02',
        endDate: '2026-12-14',
        maxStudents: 30,
        assessmentRequired: true,
        learningResources: ['helm-basics'],
        status: 'upcoming',
      });

    assert.equal(created.status, 201, JSON.stringify(created.body));
    assert.equal(created.body.trainingProgram.name, 'Kubernetes for Platform Teams');

    // Re-read through a separate request: this is the assertion that the row
    // is in PostgreSQL and not in the response the client just built.
    const listed = await api().get('/api/college/training-programs').set(...bearer(officer.token));
    assert.equal(listed.status, 200);

    const found = listed.body.trainingPrograms.find(
      (p: { id: string }) => p.id === created.body.trainingProgram.id,
    );
    assert.ok(found, 'the created program must come back from the list endpoint');
    assert.equal(found.enrolled_students, 0);
    assert.equal(found.skill_slug !== null, true, 'the skill FK must resolve to a slug');
  });

  it('never exposes another college training programs', async () => {
    const mine = await registerOfficer();
    const theirs = await registerOfficer();

    const created = await api()
      .post('/api/college/training-programs')
      .set(...bearer(mine.token))
      .send({ name: 'Confidential Internal Batch' });
    assert.equal(created.status, 201);

    const listed = await api().get('/api/college/training-programs').set(...bearer(theirs.token));
    const leaked = listed.body.trainingPrograms.find(
      (p: { id: string }) => p.id === created.body.trainingProgram.id,
    );
    assert.equal(leaked, undefined, 'tenant isolation must hold on the college portal');
  });

  it('404s an officer editing a program owned by a different college', async () => {
    const mine = await registerOfficer();
    const theirs = await registerOfficer();

    const created = await api()
      .post('/api/college/training-programs')
      .set(...bearer(mine.token))
      .send({ name: 'Owned By Another College' });
    assert.equal(created.status, 201);

    const patched = await api()
      .patch(`/api/college/training-programs/${created.body.trainingProgram.id}`)
      .set(...bearer(theirs.token))
      .send({ description: 'hijacked' });

    assert.equal(patched.status, 404, 'a cross-tenant write must be indistinguishable from a missing row');

    const unchanged = await api().get('/api/college/training-programs').set(...bearer(mine.token));
    const found = unchanged.body.trainingPrograms.find(
      (p: { id: string; description: string | null }) => p.id === created.body.trainingProgram.id,
    );
    assert.equal(found.description, null, 'the cross-tenant patch must not have landed');
  });

  it('rejects a training program with endDate before startDate', async () => {
    const officer = await registerOfficer();
    const res = await api()
      .post('/api/college/training-programs')
      .set(...bearer(officer.token))
      .send({ name: 'Time Travel Bootcamp', startDate: '2026-12-01', endDate: '2026-11-01' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'validation_failed');
  });

  it('refuses a collegeId in the body so an officer cannot target another institution', async () => {
    const officer = await registerOfficer();
    const other = await registerOfficer();

    const res = await api()
      .post('/api/college/training-programs')
      .set(...bearer(officer.token))
      // @ts-expect-error deliberately sending a field the schema must not accept
      .send({ name: 'Cross Tenant Injection', collegeId: other.collegeId });
    assert.equal(res.status, 400, 'collegeId must be rejected, not ignored');

    const theirs = await api().get('/api/college/training-programs').set(...bearer(other.token));
    assert.equal(theirs.body.trainingPrograms.length, 0);
  });

  it('enrols the officer in their own college program and derives completed_at', async () => {
    const officer = await registerOfficer();

    const program = await api()
      .post('/api/college/training-programs')
      .set(...bearer(officer.token))
      .send({ name: 'Cloud Security Fundamentals' });
    assert.equal(program.status, 201);
    const programId = program.body.trainingProgram.id as string;

    const enrolled = await api()
      .post(`/api/college/training-programs/${programId}/enroll`)
      .set(...bearer(officer.token));
    assert.equal(enrolled.status, 201, JSON.stringify(enrolled.body));
    assert.ok(enrolled.body.enrollment, 'the enrollment row must be returned');
    assert.equal(enrolled.body.enrollment.status, 'enrolled');

    const marked = await api()
      .patch(`/api/college/training-enrollments/${enrolled.body.enrollment.id}`)
      .set(...bearer(officer.token))
      .send({ status: 'completed', score: 88.5 });
    assert.equal(marked.status, 200, JSON.stringify(marked.body));
    assert.equal(marked.body.enrollment.status, 'completed');
    assert.ok(
      marked.body.enrollment.completed_at,
      'completed_at must be derived from status, not accepted from the client',
    );
  });

  it('400s a non-UUID id instead of 404 or 500', async () => {
    const officer = await registerOfficer();
    const res = await api()
      .patch('/api/college/training-programs/tp-new-1234567890')
      .set(...bearer(officer.token))
      .send({ description: 'x' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'invalid_id');
  });

  it('publishes an announcement with a derived published_at', async () => {
    const officer = await registerOfficer();

    const created = await api()
      .post('/api/college/announcements')
      .set(...bearer(officer.token))
      .send({
        title: 'Semester 7 internship drives open',
        category: 'internship',
        content: 'Register with the placement cell before Friday.',
        status: 'published',
        important: true,
      });

    assert.equal(created.status, 201, JSON.stringify(created.body));
    assert.ok(
      created.body.announcement.published_at,
      'the CHECK constraint requires published_at for a published announcement',
    );

    const deleted = await api()
      .delete(`/api/college/announcements/${created.body.announcement.id}`)
      .set(...bearer(officer.token));
    assert.equal(deleted.status, 200);
  });

  it('scopes the student roster to the calling college', async () => {
    const mine = await registerOfficer();
    const theirs = await registerOfficer();

    const mineStudent = await createFirebaseUser(uniqueEmail('roster-mine'));
    const mineReg = await api()
      .post('/api/auth/register')
      .set(...bearer(mineStudent.token))
      .send({ intentRole: 'student' });
    assert.equal(mineReg.status, 201);
    await getPool().query(`UPDATE users SET college_id = $1 WHERE id = $2`, [
      mine.collegeId,
      mineReg.body.userId,
    ]);

    const theirStudent = await createFirebaseUser(uniqueEmail('roster-theirs'));
    const theirReg = await api()
      .post('/api/auth/register')
      .set(...bearer(theirStudent.token))
      .send({ intentRole: 'student' });
    await getPool().query(`UPDATE users SET college_id = $1 WHERE id = $2`, [
      theirs.collegeId,
      theirReg.body.userId,
    ]);

    const roster = await api().get('/api/college/students').set(...bearer(mine.token));
    assert.equal(roster.status, 200);
    const uids = roster.body.students.map((s: { firebase_uid: string }) => s.firebase_uid);
    assert.ok(uids.includes(mineStudent.uid), 'the officer must see their own student');
    assert.equal(
      uids.includes(theirStudent.uid),
      false,
      'one college roster must never contain another college student',
    );
  });

  it('requires a partnership before a curriculum module can exist', async () => {
    const officer = await registerOfficer();
    const company = await registerRecruiter('curr');

    // No partnership yet: the composite FK to college_company must reject this.
    const orphaned = await api()
      .post('/api/college/curriculum')
      .set(...bearer(officer.token))
      .send({ companyId: company.companyId, currentSubject: 'Distributed Systems', semester: '6' });
    assert.equal(orphaned.status, 422, 'a module without a partnership must be refused');
    assert.equal(orphaned.body.code, 'referenced_record_not_found');

    const partnership = await api()
      .put('/api/college/partnerships')
      .set(...bearer(officer.token))
      .send({ companyId: company.companyId, partnershipStatus: 'active', isMou: true, mouStatus: 'active' });
    assert.equal(partnership.status, 200, JSON.stringify(partnership.body));

    // Re-submitting the same company must update, not conflict.
    const again = await api()
      .put('/api/college/partnerships')
      .set(...bearer(officer.token))
      .send({ companyId: company.companyId, partnershipStatus: 'active', isMou: true, mouStatus: 'under_review' });
    assert.equal(again.status, 200, 'the partnership upsert must be idempotent');
    assert.equal(again.body.partnership.mou_status, 'under_review');

    const now = await api()
      .post('/api/college/curriculum')
      .set(...bearer(officer.token))
      .send({
        companyId: company.companyId,
        currentSubject: 'Distributed Systems',
        semester: '6',
        recommendedTechnologies: ['Kafka', 'gRPC'],
        status: 'in_review',
      });
    assert.equal(now.status, 201, JSON.stringify(now.body));

    const listed = await api().get('/api/college/curriculum').set(...bearer(officer.token));
    assert.equal(listed.body.curriculumModules.length, 1);
  });

  it('keeps college_company readable from the industry side of the same row', async () => {
    const officer = await registerOfficer();
    const company = await registerRecruiter('shared');

    const partnership = await api()
      .put('/api/college/partnerships')
      .set(...bearer(officer.token))
      .send({ companyId: company.companyId, partnershipStatus: 'active', internshipCommitmentCount: 12 });
    assert.equal(partnership.status, 200);

    // The industry portal reads the same rows, which is the relational
    // relationship replacing the localStorage sync bus.
    const fromIndustry = await api()
      .get('/api/industry/partnerships')
      .set(...bearer(company.token));
    assert.equal(fromIndustry.status, 200, JSON.stringify(fromIndustry.body));

    const row = fromIndustry.body.partnerships.find(
      (p: { college_id: string }) => p.college_id === officer.collegeId,
    );
    assert.ok(row, 'the recruiter must see the partnership the college created');
    assert.equal(row.internship_commitment_count, 12);
  });

  it('derives the overview counts in SQL so they match a refresh', async () => {
    const officer = await registerOfficer();

    await api()
      .post('/api/college/placement-drives')
      .set(...bearer(officer.token))
      .send({ title: 'Graduation Drive', openings: 40, minimumCgpa: 6.5, status: 'upcoming' });

    const overview = await api().get('/api/college/overview').set(...bearer(officer.token));
    assert.equal(overview.status, 200);
    assert.equal(overview.body.overview.upcoming_placement_drives, 1);
    assert.equal(typeof overview.body.overview.students, 'number');
  });

  it('replaces the hardcoded "42 eligible" with a real eligibility count', async () => {
    const officer = await registerOfficer();
    const recruiter = await registerRecruiter('eligibility');
    const skillId = await aSeededSkillId();

    const internship = await api()
      .post('/api/industry/internships')
      .set(...bearer(recruiter.token))
      .send({
        title: 'Backend Engineer Internship',
        slug: `be-internship-${Date.now()}`,
        status: 'active',
        requiredSkills: [{ skillId, importance: 'required', level: 'intermediate' }],
      });
    assert.equal(internship.status, 201, JSON.stringify(internship.body));
    const internshipId = internship.body.internship.id as string;

    // A student who has not claimed the required skill is not eligible.
    const unprepared = await createFirebaseUser(uniqueEmail('unprepared'));
    const unpreparedReg = await api()
      .post('/api/auth/register')
      .set(...bearer(unprepared.token))
      .send({ intentRole: 'student' });
    await getPool().query(`UPDATE users SET college_id = $1, status = 'active' WHERE id = $2`, [
      officer.collegeId,
      unpreparedReg.body.userId,
    ]);

    const before = await api()
      .get(`/api/college/internships/${internshipId}/eligible-students`)
      .set(...bearer(officer.token));
    assert.equal(before.status, 200);
    assert.equal(before.body.total, 0, 'a student without the required skill must not be counted eligible');
    assert.equal(before.body.requiredSkills, 1);

    // Claim the skill and the same query now reports them.
    await getPool().query(
      `INSERT INTO user_skills (user_id, skill_id, progress, learning_status, evidence_source)
       VALUES ($1, $2, 60, 'in_progress', 'self_declared')`,
      [unpreparedReg.body.userId, skillId],
    );

    const after = await api()
      .get(`/api/college/internships/${internshipId}/eligible-students`)
      .set(...bearer(officer.token));
    assert.equal(after.body.total, 1, 'claiming the required skill must make the student eligible');

    const recommended = await api()
      .post(`/api/college/internships/${internshipId}/recommend`)
      .set(...bearer(officer.token));
    assert.equal(recommended.status, 201, JSON.stringify(recommended.body));
    assert.equal(recommended.body.notified, 1, 'the notified count must equal the eligible count');

    // The notification has to exist on the student's side. The old
    // implementation only showed a toast claiming 42 students were reached.
    const studentNotifications = await api()
      .get('/api/notifications')
      .set(...bearer(unprepared.token));
    assert.equal(studentNotifications.status, 200);
    assert.equal(studentNotifications.body.notifications.length, 1);
    assert.match(
      String(studentNotifications.body.notifications[0].title),
      /Recommended internship/,
    );
  });

  it('lists internships with a real per-college eligible count', async () => {
    const officer = await registerOfficer();
    const recruiter = await registerRecruiter('listing');
    const skillId = await aSeededSkillId();

    const internship = await api()
      .post('/api/industry/internships')
      .set(...bearer(recruiter.token))
      .send({
        title: 'Data Analyst Internship',
        slug: `da-${Date.now()}`,
        status: 'active',
        workMode: 'remote',
        isStartupFriendly: true,
        requiredSkills: [{ skillId, importance: 'required' }],
      });
    assert.equal(internship.status, 201, JSON.stringify(internship.body));
    const internshipId = internship.body.internship.id as string;

    const student = await createFirebaseUser(uniqueEmail('listed-student'));
    const reg = await api()
      .post('/api/auth/register')
      .set(...bearer(student.token))
      .send({ intentRole: 'student' });
    await getPool().query(`UPDATE users SET college_id = $1, status = 'active' WHERE id = $2`, [
      officer.collegeId,
      reg.body.userId,
    ]);

    const listed = await api().get('/api/college/internships').set(...bearer(officer.token));
    assert.equal(listed.status, 200);

    const row = listed.body.internships.find(
      (i: { id: string; eligible_students: number; required_skills: number }) => i.id === internshipId,
    );
    assert.ok(row, 'the posted internship must appear in the college listing');
    assert.equal(row.required_skills, 1);
    assert.equal(row.eligible_students, 0, 'the student has not claimed the skill yet');

    // The count in the list and the count from the detail route are the same
    // number, because they are the same query. A client cannot show 42 and then
    // notify a different number of people.
    await getPool().query(
      `INSERT INTO user_skills (user_id, skill_id, progress, learning_status, evidence_source)
       VALUES ($1, $2, 75, 'in_progress', 'self_declared')`,
      [reg.body.userId, skillId],
    );

    const relisted = await api().get('/api/college/internships').set(...bearer(officer.token));
    const after = relisted.body.internships.find(
      (i: { id: string; eligible_students: number }) => i.id === internshipId,
    );
    assert.equal(after.eligible_students, 1);

    const detail = await api()
      .get(`/api/college/internships/${internshipId}/eligible-students`)
      .set(...bearer(officer.token));
    assert.equal(
      detail.body.total,
      after.eligible_students,
      'the list count and the detail count must agree',
    );
  });

  it('never lets one college notify another college students', async () => {
    const mine = await registerOfficer();
    const theirs = await registerOfficer();
    const recruiter = await registerRecruiter('isolation');

    const internship = await api()
      .post('/api/industry/internships')
      .set(...bearer(recruiter.token))
      .send({ title: 'Isolated Internship', slug: `iso-${Date.now()}`, status: 'active' });
    const internshipId = internship.body.internship.id as string;

    const theirStudent = await createFirebaseUser(uniqueEmail('their-student'));
    const theirReg = await api()
      .post('/api/auth/register')
      .set(...bearer(theirStudent.token))
      .send({ intentRole: 'student' });
    await getPool().query(`UPDATE users SET college_id = $1, status = 'active' WHERE id = $2`, [
      theirs.collegeId,
      theirReg.body.userId,
    ]);

    const myStudent = await createFirebaseUser(uniqueEmail('my-student'));
    const myReg = await api()
      .post('/api/auth/register')
      .set(...bearer(myStudent.token))
      .send({ intentRole: 'student' });
    await getPool().query(`UPDATE users SET college_id = $1, status = 'active' WHERE id = $2`, [
      mine.collegeId,
      myReg.body.userId,
    ]);

    // No required skills on this internship, so every student at *my* college is
    // eligible and every student at theirs is not.
    const mineStudents = await api()
      .get(`/api/college/internships/${internshipId}/eligible-students`)
      .set(...bearer(mine.token));
    assert.equal(mineStudents.status, 200);
    assert.equal(mineStudents.body.total, 1, 'only the officer own college student qualifies');

    const recommended = await api()
      .post(`/api/college/internships/${internshipId}/recommend`)
      .set(...bearer(mine.token));
    assert.equal(recommended.status, 201);
    assert.equal(recommended.body.notified, 1);

    const theirFeed = await api().get('/api/notifications').set(...bearer(theirStudent.token));
    assert.equal(
      theirFeed.body.notifications.length,
      0,
      'a recommendation must not cross a college boundary',
    );

    const myFeed = await api().get('/api/notifications').set(...bearer(myStudent.token));
    assert.equal(myFeed.body.notifications.length, 1, 'the own college student was notified');
  });
});