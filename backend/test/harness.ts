import type { Pool } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import request from 'supertest';
import { createApp } from '../src/app';
import { createAuthMiddleware } from '../src/middleware/auth';
import { loadLocalEnvFile } from '../src/config/envFile';
import {
  carriesServiceAccountCredential,
  initializeFirebaseAdmin,
  resetFirebaseAdminForTests,
} from '../src/lib/firebaseAdmin';
import { loadDatabaseEnv } from '../src/config/env';
import { Pool as PgPool } from 'pg';

/**
 * Real dependencies, no mocks: the Firebase Auth emulator issues the tokens and
 * Neon PostgreSQL holds the authorization state. A mock token verifier would prove
 * nothing about the claim-vs-database behaviour these tests exist to check.
 *
 * Requires the Auth emulator on FIREBASE_AUTH_EMULATOR_HOST and a migrated
 * DATABASE_URL.
 */

export const TEST_PROJECT_ID = 'skillsetu-6e06a';
export const ALLOWED_ORIGIN = 'http://localhost:3000';

export const TEST_PASSWORD = 'Test-Passw0rd-not-a-secret';

let pool: Pool | undefined;
let auth: Auth | undefined;
let app: ReturnType<typeof createApp> | undefined;

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@dev.skillsetu.test`;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('test context not initialised; call setupTestContext() first');
  }
  return pool;
}

export function getAuth(): Auth {
  if (!auth) {
    throw new Error('test context not initialised; call setupTestContext() first');
  }
  return auth;
}

export function getApp(): ReturnType<typeof createApp> {
  if (!app) {
    throw new Error('test context not initialised; call setupTestContext() first');
  }
  return app;
}

/** Creates a real emulator user and returns a real, verifiable ID token. */
export async function createFirebaseUser(email: string): Promise<{ uid: string; token: string }> {
  const created = await getAuth().createUser({ email, password: TEST_PASSWORD, emailVerified: true });
  const token = await getAuth().createCustomToken(created.uid);
  // Exchange the custom token for an ID token exactly as a client would.
  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, returnSecureToken: true }),
    },
  );

  if (!response.ok) {
    throw new Error(`emulator signInWithCustomToken failed: ${response.status}`);
  }

  const body = (await response.json()) as { idToken: string };
  return { uid: created.uid, token: body.idToken };
}

export async function idTokenForUid(uid: string): Promise<string> {
  const customToken = await getAuth().createCustomToken(uid);
  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    },
  );
  const body = (await response.json()) as { idToken?: string; error?: { message?: string } };

  if (!body.idToken) {
    throw new Error(`could not mint ID token: ${body.error?.message ?? 'unknown'}`);
  }

  return body.idToken;
}

/** Removes every users/role_requests row so a test run starts from a known state. */
export async function resetIdentityTables(): Promise<void> {
  await getPool().query('DELETE FROM role_requests');
  await getPool().query('DELETE FROM users');
}

export async function setupTestContext(): Promise<void> {
  loadLocalEnvFile();

  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error(
      'FIREBASE_AUTH_EMULATOR_HOST is required. Start the Auth emulator before running these tests.',
    );
  }

  resetFirebaseAdminForTests();

  const admin = initializeFirebaseAdmin({
    projectId: TEST_PROJECT_ID,
    clientEmail: '',
    privateKey: '',
    emulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
  });

  auth = admin.auth;

  const { databaseUrl } = loadDatabaseEnv(process.env);
  pool = new PgPool({ connectionString: databaseUrl, max: 5 });

  // Confirm the emulator app really has no credential — the same assertion the
  // production code makes.
  if (carriesServiceAccountCredential(admin.app)) {
    throw new Error('test setup refused: emulator Admin app carries a credential');
  }

  app = createApp({
    pool,
    resolveAuth: () => auth!,
    allowedOrigins: [ALLOWED_ORIGIN],
  });
}

export async function teardownTestContext(): Promise<void> {
  await pool?.end();
  pool = undefined;
  auth = undefined;
  app = undefined;
}

export function api() {
  return request(getApp());
}

export function bearer(token: string): [string, string] {
  return ['Authorization', `Bearer ${token}`];
}

export { createAuthMiddleware };
