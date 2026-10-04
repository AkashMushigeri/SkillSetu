import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import {
  createFirebaseUser,
  getApp,
  getPool,
  setupTestContext,
  teardownTestContext,
  uniqueEmail,
} from './harness';

// The real client module the Next.js app calls on signup. Deliberately imported
// from the app source so this test fails if that contract drifts.
import { registerWithBackend } from '../../src/lib/backendApi';

let server: Server;
let previousApiUrl: string | undefined;
/** Rows this run created, removed afterwards so repeated runs stay clean. */
const createdUids: string[] = [];

before(async () => {
  await setupTestContext();

  // registerWithBackend uses fetch against a real origin, so the Express app
  // needs a real socket rather than supertest's in-process injection.
  server = getApp().listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;

  previousApiUrl = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = `http://127.0.0.1:${port}`;
});

after(async () => {
  if (previousApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL;
  } else {
    process.env.NEXT_PUBLIC_API_URL = previousApiUrl;
  }

  if (createdUids.length > 0) {
    // role_requests cascade from users.
    await getPool().query('DELETE FROM users WHERE firebase_uid = ANY($1)', [createdUids]);
  }

  await new Promise<void>((resolve) => server.close(() => resolve()));
  await teardownTestContext();
});

/** registerWithBackend only ever calls getIdToken() on the Firebase User. */
function fakeUser(token: string): never {
  return { getIdToken: async () => token } as never;
}

async function rowFor(uid: string) {
  const { rows } = await getPool().query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
  return rows[0];
}

describe('signup client -> POST /api/auth/register -> Neon users', () => {
  it('writes an active student row', async () => {
    const { uid, token } = await createFirebaseUser(uniqueEmail('client-student'));
    createdUids.push(uid);

    const outcome = await registerWithBackend(fakeUser(token), {
      role: 'STUDENT',
      displayName: 'Client Student',
      phone: '+919000000000',
    });

    assert.equal(outcome.status, 'created');

    const row = await rowFor(uid);
    assert.ok(row, 'expected a users row to be written');
    assert.equal(row.role, 'student', "uppercase 'STUDENT' must map to the lowercase enum");
    assert.equal(row.status, 'active');
    assert.equal(row.display_name, 'Client Student');
    assert.equal(row.phone, '+919000000000');
    assert.equal(row.onboarding_completed, false);
  });

  it('is idempotent on firebase_uid and never duplicates a row', async () => {
    const { uid, token } = await createFirebaseUser(uniqueEmail('client-idem'));
    createdUids.push(uid);

    const first = await registerWithBackend(fakeUser(token), { role: 'STUDENT' });
    const second = await registerWithBackend(fakeUser(token), { role: 'STUDENT' });

    assert.equal(first.status, 'created');
    assert.equal(second.status, 'already-registered');

    const { rows } = await getPool().query(
      'SELECT count(*)::int AS c FROM users WHERE firebase_uid = $1',
      [uid],
    );
    assert.equal(rows[0].c, 1);
  });

  it('creates a pending college row plus its role_request', async () => {
    const { uid, token } = await createFirebaseUser(uniqueEmail('client-college'));
    createdUids.push(uid);

    const outcome = await registerWithBackend(fakeUser(token), {
      role: 'COLLEGE',
      displayName: 'College Admin',
      organization: { name: 'Client Test Institute', code: 'abc123' },
    });

    assert.equal(outcome.status, 'created');

    const row = await rowFor(uid);
    assert.equal(row.role, 'college');
    assert.equal(row.status, 'pending', 'a privileged role must not be active before approval');

    const requests = await getPool().query(
      'SELECT requested_role FROM role_requests WHERE user_id = $1',
      [row.id],
    );
    assert.equal(requests.rows.length, 1);
    assert.equal(requests.rows[0].requested_role, 'college');
  });

  it('surfaces a rejected registration instead of throwing', async () => {
    const { uid, token } = await createFirebaseUser(uniqueEmail('client-nocode'));
    createdUids.push(uid);

    const outcome = await registerWithBackend(fakeUser(token), {
      role: 'COLLEGE',
      organization: { name: 'College Missing Its Code' },
    });

    assert.equal(outcome.status, 'failed');
    assert.match(outcome.reason, /organization_code_required/);
    assert.equal(await rowFor(uid), undefined, 'nothing may be written on rejection');
  });

  it('skips silently when the backend is not configured', async () => {
    const saved = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    try {
      const outcome = await registerWithBackend(fakeUser('unused'), { role: 'STUDENT' });
      assert.equal(outcome.status, 'skipped');
    } finally {
      process.env.NEXT_PUBLIC_API_URL = saved;
    }
  });
});