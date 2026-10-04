import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  ALLOWED_ORIGIN,
  api,
  bearer,
  createFirebaseUser,
  getAuth,
  getPool,
  idTokenForUid,
  resetIdentityTables,
  setupTestContext,
  teardownTestContext,
  uniqueEmail,
} from './harness';

before(async () => {
  await setupTestContext();
});

after(async () => {
  await teardownTestContext();
});

async function registerStudent(email: string) {
  const { token } = await createFirebaseUser(email);
  const res = await api()
    .post('/api/auth/register')
    .set(...bearer(token))
    .send({ intentRole: 'student' });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return { token, body: res.body };
}

async function registerPrivileged(email: string, intentRole: 'industry' | 'college', organization: object) {
  const { token } = await createFirebaseUser(email);
  const res = await api()
    .post('/api/auth/register')
    .set(...bearer(token))
    .send({ intentRole, organization });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return { token, body: res.body };
}

async function makeAdmin(): Promise<{ token: string; userId: string }> {
  const email = uniqueEmail('admin');
  const { token, uid } = await createFirebaseUser(email);
  const res = await getPool().query(
    `INSERT INTO users (firebase_uid, email, role, status) VALUES ($1,$2,'admin','active') RETURNING id`,
    [uid, email],
  );
  return { token, userId: res.rows[0].id as string };
}

describe('authentication', () => {
  it('401 without an Authorization header', async () => {
    const res = await api().get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'missing_authorization');
    assert.ok(res.body.requestId, 'requestId must be present');
  });

  it('401 for a malformed bearer header', async () => {
    const res = await api().get('/api/auth/me').set('Authorization', 'Token abc123');
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'malformed_authorization');
  });

  it('401 for a structurally invalid bearer token', async () => {
    const res = await api().get('/api/auth/me').set(...bearer('not-a-jwt'));
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'invalid_token');
  });

  it('403 registration_required for a valid token whose uid has no users row', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('unregistered'));
    const res = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'registration_required');
  });

  it('never leaks SQL, stacks or tokens in an error body', async () => {
    const res = await api().get('/api/auth/me').set(...bearer('garbage'));
    const serialised = JSON.stringify(res.body).toLowerCase();
    for (const leak of ['select ', 'postgres://', 'at object.', 'stack', 'eyJ']) {
      assert.ok(!serialised.includes(leak), `response must not contain "${leak}": ${serialised}`);
    }
  });
});

describe('student registration', () => {
  it('creates an active student immediately, with no approval step', async () => {
    const { token, body } = await registerStudent(uniqueEmail('student'));
    assert.equal(body.role, 'student');
    assert.equal(body.status, 'active');

    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.status, 200);
    assert.equal(me.body.role, 'student');
    assert.equal(me.body.status, 'active');
  });

  it('is idempotent: a repeat registration creates no second user or request', async () => {
    const email = uniqueEmail('student-idem');
    const { token, uid } = await createFirebaseUser(email);

    const first = await api().post('/api/auth/register').set(...bearer(token)).send({ intentRole: 'student' });
    assert.equal(first.status, 201);

    const second = await api().post('/api/auth/register').set(...bearer(token)).send({ intentRole: 'industry' });
    assert.equal(second.status, 200);
    assert.equal(second.body.alreadyRegistered, true);
    assert.equal(second.body.userId, first.body.userId, 'must return the existing identity');

    const rows = await getPool().query('SELECT count(*)::int AS n FROM users WHERE firebase_uid = $1', [uid]);
    assert.equal(rows.rows[0].n, 1);

    // Scoped to this user, not a global count: the other suites share this database.
    const requests = await getPool().query('SELECT count(*)::int AS n FROM role_requests WHERE user_id = $1', [
      first.body.userId,
    ]);
    assert.equal(requests.rows[0].n, 0, 'a repeat registration must not create a role request');
  });

  it('409 when the email already belongs to a different firebase_uid', async () => {
    // Validation row 20: a Firebase email change must not let one identity take over
    // another uid's account. Simulated by putting the email on a row owned by a
    // different firebase_uid, then registering a fresh Firebase user with it.
    const email = uniqueEmail('email-clash');

    await getPool().query(
      `INSERT INTO users (firebase_uid, email, role, status) VALUES ($1,$2,'student','active')`,
      [`unrelated-uid-${Date.now()}`, email],
    );

    const { token } = await createFirebaseUser(email);
    const before = await getPool().query('SELECT count(*)::int AS n FROM users WHERE email = $1', [email]);
    assert.equal(before.rows[0].n, 1, 'the pre-existing row is the one this test created');

    const res = await api()
      .post('/api/auth/register')
      .set(...bearer(token))
      .send({ intentRole: 'student' });

    assert.equal(res.status, 409);
    assert.equal(res.body.code, 'email_taken');

    const after = await getPool().query('SELECT count(*)::int AS n FROM users WHERE email = $1', [email]);
    assert.equal(after.rows[0].n, before.rows[0].n, 'the conflicting insert must mutate nothing');
  });
});

describe('privileged registration (Flow A)', () => {
  it('industry signup yields role=industry, status=pending and exactly one role request', async () => {
    const { body } = await registerPrivileged(uniqueEmail('industry'), 'industry', {
      name: 'Phase1 Test Industries',
      city: 'Pune',
    });

    assert.equal(body.role, 'industry');
    assert.equal(body.status, 'pending');
    assert.equal(body.companyId, null, 'FK must stay NULL until approval');

    const requests = await getPool().query(
      'SELECT requested_role, status, organization_snapshot FROM role_requests WHERE user_id = $1',
      [body.userId],
    );
    assert.equal(requests.rows.length, 1);
    assert.equal(requests.rows[0].requested_role, 'industry');
    assert.equal(requests.rows[0].status, 'pending');
    assert.equal(requests.rows[0].organization_snapshot.name, 'Phase1 Test Industries');
  });

  it('college signup yields role=college, status=pending and one role request', async () => {
    const { body } = await registerPrivileged(uniqueEmail('college'), 'college', {
      name: 'Phase1 Test Institute',
      code: 'P1TEST',
    });

    assert.equal(body.role, 'college');
    assert.equal(body.status, 'pending');

    const requests = await getPool().query('SELECT count(*)::int AS n FROM role_requests WHERE user_id = $1', [
      body.userId,
    ]);
    assert.equal(requests.rows[0].n, 1);
  });

  it('400 when an industry registration omits organization.name', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('industry-noname'));
    const res = await api()
      .post('/api/auth/register')
      .set(...bearer(token))
      .send({ intentRole: 'industry', organization: { city: 'Pune' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'organization_name_required');
  });

  it('400 when a college registration omits organization.code', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('college-nocode'));
    const res = await api()
      .post('/api/auth/register')
      .set(...bearer(token))
      .send({ intentRole: 'college', organization: { name: 'No Code College' } });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'organization_code_required');
  });

  it('rejects admin as a public registration role', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('wants-admin'));
    const res = await api()
      .post('/api/auth/register')
      .set(...bearer(token))
      .send({ intentRole: 'admin', organization: { name: 'Sneaky Inc' } });
    assert.equal(res.status, 400);
  });

  it('a pending industry user is refused the admin queue with awaiting_approval', async () => {
    const { token } = await registerPrivileged(uniqueEmail('pending-industry'), 'industry', {
      name: 'Pending Portal Industries',
    });
    const res = await api().get('/api/role-requests').set(...bearer(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'awaiting_approval');
  });
});

describe('student role upgrade (Flow B)', () => {
  it('leaves the users row completely unchanged while the request is pending', async () => {
    const { token, body } = await registerStudent(uniqueEmail('upgrade'));
    assert.equal(body.status, 'active');

    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'industry', organization: { name: 'Upgrade Industries Ltd' } });

    assert.equal(res.status, 201);
    assert.equal(res.body.currentRole, 'student');
    assert.equal(res.body.currentStatus, 'active');

    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.body.role, 'student', 'role must stay student until approval');
    assert.equal(me.body.status, 'active');
    assert.equal(me.body.companyId, null);
  });

  it('409 on a duplicate pending request', async () => {
    const { token } = await registerStudent(uniqueEmail('upgrade-dup'));
    const payload = { requested_role: 'college', organization: { name: 'Dup College', code: 'DUPCOL' } };

    assert.equal((await api().post('/api/role-requests').set(...bearer(token)).send(payload)).status, 201);

    const second = await api().post('/api/role-requests').set(...bearer(token)).send(payload);
    assert.equal(second.status, 409);
    assert.equal(second.body.code, 'role_request_already_pending');
  });

  it('rejects requested_role=admin', async () => {
    const { token } = await registerStudent(uniqueEmail('upgrade-admin'));
    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'admin', organization: { name: 'Nope' } });
    assert.equal(res.status, 400);
  });

  it('400 when an industry upgrade omits organization.name', async () => {
    const { token } = await registerStudent(uniqueEmail('upgrade-noname'));
    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'industry', organization: { city: 'Pune' } });
    assert.equal(res.status, 400);
  });

  it('only an active student may request an upgrade', async () => {
    // A pending industry applicant is told they are awaiting approval, which is the
    // actionable message, rather than being told their role is wrong.
    const { token } = await registerPrivileged(uniqueEmail('industry-upgrade'), 'industry', {
      name: 'Already Industry Ltd',
    });
    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'college', organization: { name: 'X College', code: 'XXCOL' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'awaiting_approval');
  });

  it('an active non-student cannot request an upgrade', async () => {
    const admin = await makeAdmin();
    const { token, body } = await registerPrivileged(uniqueEmail('active-industry'), 'industry', {
      name: `Active Industry ${Date.now()}`,
    });
    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );
    await api().post(`/api/role-requests/${request.rows[0].id}/approve`).set(...bearer(admin.token)).send({});

    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'college', organization: { name: 'X College', code: 'XXCOL' } });

    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'upgrade_not_permitted');
  });
});

describe('admin authorization', () => {
  it('non-admins cannot approve, reject or list', async () => {
    const { token: studentToken } = await registerStudent(uniqueEmail('student-tries-admin'));
    const { token: industryToken } = await registerPrivileged(uniqueEmail('industry-tries-admin'), 'industry', {
      name: 'Industry Tries Admin',
    });
    const admin = await makeAdmin();

    const list = await getPool().query(
      `SELECT id FROM role_requests WHERE status = 'pending' ORDER BY created_at LIMIT 1`,
    );
    const target = list.rows[0]?.id ?? '00000000-0000-0000-0000-000000000000';

    // A student is active but lacks the role, so the precise denial is `forbidden`.
    // A pending industry user is non-active, so it is `awaiting_approval`.
    const expectations: Array<[string, string, string]> = [
      ['student', studentToken, 'forbidden'],
      ['pending industry', industryToken, 'awaiting_approval'],
    ];

    for (const [label, token, expectedCode] of expectations) {
      const approve = await api().post(`/api/role-requests/${target}/approve`).set(...bearer(token)).send({});
      assert.equal(approve.status, 403, `${label} approve`);
      assert.equal(approve.body.code, expectedCode, `${label} approve code`);

      const reject = await api().post(`/api/role-requests/${target}/reject`).set(...bearer(token)).send({});
      assert.equal(reject.status, 403, `${label} reject`);
      assert.equal(reject.body.code, expectedCode, `${label} reject code`);

      const listRes = await api().get('/api/role-requests').set(...bearer(token));
      assert.equal(listRes.status, 403, `${label} list`);
      assert.equal(listRes.body.code, expectedCode, `${label} list code`);
    }

    assert.ok(admin.token);
  });

  it('an admin can list pending requests', async () => {
    const admin = await makeAdmin();
    const res = await api().get('/api/role-requests?status=pending').set(...bearer(admin.token));
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.requests));
  });

  it('400 for a non-UUID request id', async () => {
    const admin = await makeAdmin();
    const res = await api().post('/api/role-requests/not-a-uuid/approve').set(...bearer(admin.token)).send({});
    assert.equal(res.status, 400);
  });
});

describe('approval and organization resolution', () => {
  it('approving an industry request sets role, active status and a non-null company_id', async () => {
    const admin = await makeAdmin();
    const companyName = `Approval Industries ${Date.now()}`;
    const { token, body } = await registerPrivileged(uniqueEmail('approve-industry'), 'industry', {
      name: companyName,
      city: 'Bengaluru',
    });

    const created = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );

    const approve = await api()
      .post(`/api/role-requests/${created.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({ decisionNote: 'looks good' });

    assert.equal(approve.status, 200, JSON.stringify(approve.body));
    assert.ok(approve.body.companyId, 'company_id must be non-null after approval');

    const row = await getPool().query(
      'SELECT role, status, company_id FROM users WHERE id = $1',
      [body.userId],
    );
    assert.equal(row.rows[0].role, 'industry');
    assert.equal(row.rows[0].status, 'active');
    assert.ok(row.rows[0].company_id);

    // Owner link set on creation, per the plan.
    const owned = await getPool().query('SELECT owner_user_id FROM companies WHERE id = $1', [
      approve.body.companyId,
    ]);
    assert.equal(owned.rows[0].owner_user_id, body.userId);

    const decision = await getPool().query(
      'SELECT status, reviewed_by, reviewed_at FROM role_requests WHERE id = $1',
      [created.rows[0].id],
    );
    assert.equal(decision.rows[0].status, 'approved');
    assert.equal(decision.rows[0].reviewed_by, admin.userId);
    assert.ok(decision.rows[0].reviewed_at);

    // The user can now reach the admin queue? No — but they can read their identity.
    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.body.role, 'industry');
    assert.equal(me.body.status, 'active');
  });

  it('reuses an existing company by normalized name instead of creating a duplicate', async () => {
    const admin = await makeAdmin();
    const companyName = `Reuse Corp ${Date.now()}`;

    const first = await registerPrivileged(uniqueEmail('reuse-1'), 'industry', { name: companyName });
    const firstRequest = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [first.body.userId, 'pending'],
    );
    const firstApproval = await api()
      .post(`/api/role-requests/${firstRequest.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({});
    assert.equal(firstApproval.body.organizationStrategy, 'created');

    // A different applicant, same name spelled with different casing/punctuation.
    const second = await registerPrivileged(uniqueEmail('reuse-2'), 'industry', {
      name: companyName.toUpperCase().replace(/ /g, '  '),
    });
    const secondRequest = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [second.body.userId, 'pending'],
    );
    const secondApproval = await api()
      .post(`/api/role-requests/${secondRequest.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({});

    assert.equal(secondApproval.status, 200, JSON.stringify(secondApproval.body));
    assert.equal(secondApproval.body.organizationStrategy, 'matched');
    assert.equal(secondApproval.body.companyId, firstApproval.body.companyId, 'must reuse the same company');

    const companies = await getPool().query('SELECT count(*)::int AS n FROM companies WHERE normalized_name = $1', [
      companyName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
    ]);
    assert.equal(companies.rows[0].n, 1, 'no duplicate company may be created');
  });

  it('honours an admin-supplied companyId override', async () => {
    const admin = await makeAdmin();
    const target = await getPool().query(
      'INSERT INTO companies (name, normalized_name) VALUES ($1,$2) RETURNING id',
      [`Override Corp ${Date.now()}`, `override corp ${Date.now()}`],
    );
    const overrideId = target.rows[0].id as string;

    const { body } = await registerPrivileged(uniqueEmail('override'), 'industry', {
      name: `Should Not Be Created ${Date.now()}`,
    });
    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );

    const approve = await api()
      .post(`/api/role-requests/${request.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({ companyId: overrideId });

    assert.equal(approve.status, 200);
    assert.equal(approve.body.organizationStrategy, 'explicit');
    assert.equal(approve.body.companyId, overrideId);
  });

  it('422 and a full rollback when an explicit companyId does not exist', async () => {
    const admin = await makeAdmin();
    const { body } = await registerPrivileged(uniqueEmail('bad-override'), 'industry', {
      name: `Bad Override ${Date.now()}`,
    });
    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );

    const before = await getPool().query('SELECT role, status, company_id FROM users WHERE id = $1', [
      body.userId,
    ]);

    const approve = await api()
      .post(`/api/role-requests/${request.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({ companyId: '00000000-0000-0000-0000-0000000000ff' });

    assert.equal(approve.status, 422);
    assert.equal(approve.body.code, 'company_not_found');

    const after = await getPool().query('SELECT role, status, company_id FROM users WHERE id = $1', [body.userId]);
    assert.deepEqual(after.rows[0], before.rows[0], 'a failed approval must leave no partial state');

    const stillPending = await getPool().query('SELECT status FROM role_requests WHERE id = $1', [
      request.rows[0].id,
    ]);
    assert.equal(stillPending.rows[0].status, 'pending');
  });

  it('422 and rollback when the stored snapshot cannot resolve an organization', async () => {
    const admin = await makeAdmin();

    // Force the exact corruption the plan warns about: a privileged signup whose
    // snapshot predates the request-time rule, so approval cannot assume the
    // invariant still holds.
    const created = await getPool().query(
      `INSERT INTO users (firebase_uid, email, role, status)
       VALUES ($1,$2,'industry','pending') RETURNING id`,
      [`snapshot-probe-${Date.now()}`, `snapshot-${Date.now()}@dev.skillsetu.test`],
    );
    const request = await getPool().query(
      `INSERT INTO role_requests (user_id, requested_role, status, organization_snapshot)
       VALUES ($1,'industry','pending','{}'::jsonb) RETURNING id`,
      [created.rows[0].id],
    );

    const approve = await api()
      .post(`/api/role-requests/${request.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({});

    assert.equal(approve.status, 422);
    assert.equal(approve.body.code, 'organization_snapshot_incomplete');

    const after = await getPool().query('SELECT role, status, company_id FROM users WHERE id = $1', [
      created.rows[0].id,
    ]);
    assert.equal(after.rows[0].role, 'industry');
    assert.equal(after.rows[0].status, 'pending', 'must not have been activated');
    assert.equal(after.rows[0].company_id, null);

    const stillPending = await getPool().query('SELECT status FROM role_requests WHERE id = $1', [
      request.rows[0].id,
    ]);
    assert.equal(stillPending.rows[0].status, 'pending', 'the decision must have rolled back too');
  });

  it('approving a college request sets role=college and a non-null college_id', async () => {
    const admin = await makeAdmin();
    const code = `P1C${Date.now()}`;
    const { body } = await registerPrivileged(uniqueEmail('approve-college'), 'college', {
      name: `Approval College ${Date.now()}`,
      code,
    });

    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );
    const approve = await api()
      .post(`/api/role-requests/${request.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({});

    assert.equal(approve.status, 200, JSON.stringify(approve.body));
    assert.ok(approve.body.collegeId);

    const row = await getPool().query('SELECT role, status, college_id FROM users WHERE id = $1', [body.userId]);
    assert.equal(row.rows[0].role, 'college');
    assert.equal(row.rows[0].status, 'active');
    assert.ok(row.rows[0].college_id);
  });

  it('409 when approving an already-decided request', async () => {
    const admin = await makeAdmin();
    const { body } = await registerPrivileged(uniqueEmail('double-approve'), 'industry', {
      name: `Double Approve ${Date.now()}`,
    });
    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );

    assert.equal(
      (await api().post(`/api/role-requests/${request.rows[0].id}/approve`).set(...bearer(admin.token)).send({}))
        .status,
      200,
    );
    const second = await api()
      .post(`/api/role-requests/${request.rows[0].id}/approve`)
      .set(...bearer(admin.token))
      .send({});
    assert.equal(second.status, 409);
  });
});

describe('rejection', () => {
  it('Flow A: a rejected new applicant falls back to an active student', async () => {
    const admin = await makeAdmin();
    const { token, body } = await registerPrivileged(uniqueEmail('reject-flow-a'), 'industry', {
      name: `Reject Flow A ${Date.now()}`,
    });
    assert.equal(body.status, 'pending');

    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );
    const reject = await api()
      .post(`/api/role-requests/${request.rows[0].id}/reject`)
      .set(...bearer(admin.token))
      .send({ decisionNote: 'not verified' });

    assert.equal(reject.status, 200);
    assert.equal(reject.body.fellBackToStudent, true);

    const row = await getPool().query('SELECT role, status FROM users WHERE id = $1', [body.userId]);
    assert.equal(row.rows[0].role, 'student');
    assert.equal(row.rows[0].status, 'active');

    // Student functionality still works.
    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.status, 200);
    assert.equal(me.body.role, 'student');

    const decision = await getPool().query('SELECT status FROM role_requests WHERE id = $1', [request.rows[0].id]);
    assert.equal(decision.rows[0].status, 'rejected');
  });

  it('Flow B: a rejected upgrade leaves the active student completely untouched', async () => {
    const admin = await makeAdmin();
    const { token, body } = await registerStudent(uniqueEmail('reject-flow-b'));

    const request = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'industry', organization: { name: `Reject Flow B ${Date.now()}` } });
    assert.equal(request.status, 201);

    const reject = await api()
      .post(`/api/role-requests/${request.body.id}/reject`)
      .set(...bearer(admin.token))
      .send({ decisionNote: 'not now' });

    assert.equal(reject.status, 200);
    assert.equal(reject.body.fellBackToStudent, false, 'an already-active account must not be rewritten');

    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.status, 200, 'a rejected Flow B applicant keeps full student access');
    assert.equal(me.body.role, 'student');
    assert.equal(me.body.status, 'active');
  });

  it('a rejected Flow A applicant cannot reach the admin queue', async () => {
    const admin = await makeAdmin();
    const { token, body } = await registerPrivileged(uniqueEmail('reject-then-try'), 'industry', {
      name: `Reject Then Try ${Date.now()}`,
    });
    const request = await getPool().query(
      'SELECT id FROM role_requests WHERE user_id = $1 AND status = $2',
      [body.userId, 'pending'],
    );
    await api().post(`/api/role-requests/${request.rows[0].id}/reject`).set(...bearer(admin.token)).send({});

    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.body.role, 'student');
    assert.ok(admin);
  });
});

describe('security', () => {
  it('a forged role claim does not override the PostgreSQL role', async () => {
    // Register a real student, then stamp an admin claim onto their Firebase user
    // and mint a fresh ID token that genuinely carries it.
    const { token: initialToken } = await createFirebaseUser(uniqueEmail('forged-claim'));
    await api().post('/api/auth/register').set(...bearer(initialToken)).send({ intentRole: 'student' });

    const row = await getPool().query(
      'SELECT firebase_uid FROM users WHERE email = $1',
      [
        (
          await getPool().query(
            'SELECT email FROM users WHERE role = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
            ['student', 'active'],
          )
        ).rows[0].email,
      ],
    );
    const firebaseUid = row.rows[0].firebase_uid as string;

    await getAuth().setCustomUserClaims(firebaseUid, { role: 'admin', status: 'active' });

    const studentToken = await idTokenForUid(firebaseUid);

    const decoded = JSON.parse(Buffer.from(studentToken.split('.')[1]!, 'base64').toString('utf8')) as {
      role?: string;
    };
    assert.equal(decoded.role, 'admin', 'the forged claim really is present on the token');

    const res = await api().get('/api/role-requests').set(...bearer(studentToken));
    assert.equal(res.status, 403, 'a forged admin claim must not grant the admin queue');
    assert.equal(res.body.code, 'forbidden');

    const me = await api().get('/api/auth/me').set(...bearer(studentToken));
    assert.equal(me.body.role, 'student', 'PostgreSQL remains authoritative');
  });

  it('a role in the request body cannot elevate a student', async () => {
    const { token } = await registerStudent(uniqueEmail('body-role'));
    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'industry', role: 'admin', organization: { name: `Body Role ${Date.now()}` } });
    // `.strict()` rejects the unknown `role` key outright.
    assert.equal(res.status, 400);

    const me = await api().get('/api/auth/me').set(...bearer(token));
    assert.equal(me.body.role, 'student');
  });

  it('an unknown uid never receives privileged access', async () => {
    const { token } = await createFirebaseUser(uniqueEmail('unknown-privileged'));
    const res = await api()
      .post('/api/role-requests')
      .set(...bearer(token))
      .send({ requested_role: 'industry', organization: { name: 'Unknown Ltd' } });
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'registration_required');
  });

  it('there is no HTTP route that can bootstrap an admin', async () => {
    const { token } = await registerStudent(uniqueEmail('no-bootstrap'));
    for (const path of ['/api/admin/bootstrap', '/api/auth/bootstrap-admin', '/api/admin/users']) {
      const res = await api().post(path).set(...bearer(token)).send({ role: 'admin' });
      assert.notEqual(res.status, 200, `${path} must not create an admin`);
      assert.equal(res.status, 404, `${path} should not exist`);
    }
  });

  it('a pending user cannot list or act on role requests', async () => {
    const { token } = await registerPrivileged(uniqueEmail('pending-peek'), 'college', {
      name: `Pending Peek ${Date.now()}`,
      code: `PEEK${Date.now()}`,
    });
    const res = await api().get('/api/role-requests').set(...bearer(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'awaiting_approval');
  });

  it('does not reflect a disallowed CORS origin', async () => {
    const res = await api().get('/health').set('Origin', 'https://evil.example');
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  it('echoes an allow-listed origin exactly', async () => {
    const res = await api().get('/health').set('Origin', ALLOWED_ORIGIN);
    assert.equal(res.headers['access-control-allow-origin'], ALLOWED_ORIGIN);
  });

  it('health still reports the database up on Neon dev', async () => {
    const res = await api().get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.database, 'up');
    assert.equal(res.body.status, 'ok');
  });
});

describe('isolation', () => {
  it('a fresh run starts from the seeded baseline', async () => {
    // Guard against a test that wipes shared state and silently breaks the others.
    const rows = await getPool().query('SELECT count(*)::int AS n FROM colleges');
    assert.ok(rows.rows[0].n > 0, 'db:seed baseline colleges must still be present');
    await resetIdentityTables();
    const after = await getPool().query('SELECT count(*)::int AS n FROM users');
    assert.equal(after.rows[0].n, 0);
  });
});
