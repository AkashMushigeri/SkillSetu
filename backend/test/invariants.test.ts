import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { getPool, setupTestContext, teardownTestContext } from './harness';

/**
 * Database-level invariants that must hold no matter what the application layer
 * does. These complement the API tests: they assert the *shape* of the data rather
 * than one request's outcome.
 */
before(async () => {
  await setupTestContext();
});

after(async () => {
  await teardownTestContext();
});

describe('schema invariants for Phase 1', () => {
  it('user_role contains exactly the four application roles', async () => {
    const values = await getPool().query(
      `SELECT e.enumlabel
         FROM pg_type t
         JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'user_role'
        ORDER BY e.enumsortorder`,
    );

    assert.deepEqual(
      values.rows.map((r) => r.enumlabel),
      ['student', 'industry', 'college', 'admin'],
    );
    assert.ok(
      !values.rows.some((r) => r.enumlabel === 'recruiter'),
      'recruiter must never be a role; it is only a persona email',
    );
    assert.ok(!values.rows.some((r) => r.enumlabel === 'teacher'), 'teacher is not a top-level role');
  });

  it('no user carries a recruiter role', async () => {
    const rows = await getPool().query("SELECT count(*)::int AS n FROM users WHERE role::text = 'recruiter'");
    assert.equal(rows.rows[0].n, 0);
  });

  it('no active privileged user is missing its organization FK', async () => {
    const rows = await getPool().query(
      `SELECT count(*)::int AS n
         FROM users
        WHERE role IN ('industry','college')
          AND status = 'active'
          AND (CASE WHEN role = 'industry' THEN company_id IS NULL ELSE college_id IS NULL END)`,
    );
    assert.equal(rows.rows[0].n, 0, 'approval must never leave a privileged role with a NULL org FK');
  });

  it('every users row has a non-empty firebase_uid', async () => {
    const rows = await getPool().query(
      "SELECT count(*)::int AS n FROM users WHERE firebase_uid IS NULL OR btrim(firebase_uid) = ''",
    );
    assert.equal(rows.rows[0].n, 0);
  });

  it('firebase_uid is unique', async () => {
    const dupes = await getPool().query(
      'SELECT firebase_uid, count(*)::int AS n FROM users GROUP BY firebase_uid HAVING count(*) > 1',
    );
    assert.equal(dupes.rows.length, 0);
  });

  it('the database blocks requested_role=admin even if the app layer is bypassed', async () => {
    const user = await getPool().query(
      `INSERT INTO users (firebase_uid, email, role, status)
       VALUES ($1,$2,'student','active') RETURNING id`,
      [`invariants-${Date.now()}`, `invariants-${Date.now()}@dev.skillsetu.test`],
    );

    await assert.rejects(
      () =>
        getPool().query(
          `INSERT INTO role_requests (user_id, requested_role, status, organization_snapshot)
           VALUES ($1,'admin','pending','{}'::jsonb)`,
          [user.rows[0].id],
        ),
      /role_requests_role_is_requestable/,
      'the CHECK constraint must reject admin as a requested role',
    );
  });

  it('the database blocks a second pending request per user', async () => {
    const user = await getPool().query(
      `INSERT INTO users (firebase_uid, email, role, status)
       VALUES ($1,$2,'student','active') RETURNING id`,
      [`pending-guard-${Date.now()}`, `pending-guard-${Date.now()}@dev.skillsetu.test`],
    );

    const insert = () =>
      getPool().query(
        `INSERT INTO role_requests (user_id, requested_role, status, organization_snapshot)
         VALUES ($1,'industry','pending','{"name":"Guard Co"}'::jsonb)`,
        [user.rows[0].id],
      );

    await insert();
    await assert.rejects(insert, /role_requests_one_pending_per_user/);
  });

  it('users.status defaults to active when omitted', async () => {
    const row = await getPool().query(
      `INSERT INTO users (firebase_uid, email) VALUES ($1,$2) RETURNING role, status`,
      [`default-status-${Date.now()}`, `default-status-${Date.now()}@dev.skillsetu.test`],
    );

    assert.equal(row.rows[0].role, 'student');
    assert.equal(row.rows[0].status, 'active');
  });
});
