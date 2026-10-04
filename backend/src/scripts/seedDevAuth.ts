import { randomBytes } from 'node:crypto';
import { Pool } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import { loadDatabaseEnv } from '../config/env';
import { loadLocalEnvFile } from '../config/envFile';
import { logger } from '../lib/logger';
import { carriesServiceAccountCredential, initializeFirebaseAdmin } from '../lib/firebaseAdmin';
import {
  assertDevelopmentDatabase,
  assertNotProductionMode,
  assertNotProductionTarget,
  describeTarget,
  resolveFirebaseTarget,
  TargetSafetyError,
  type FirebaseTarget,
} from '../lib/firebaseTarget';
import { normalizeOrganizationName } from '../services/organization';
import type { ApplicationRole } from '../middleware/auth';

/**
 * Deterministic development personas.
 *
 * `recruiter@dev.skillsetu.test` is a *persona name only* — its database role is
 * `industry`. There is no `recruiter` role, and the `user_role` enum in migration
 * 0000 must never gain one.
 */
const PERSONAS: ReadonlyArray<{ email: string; role: ApplicationRole; organization: { name: string; code?: string } }> = [
  { email: 'student@dev.skillsetu.test', role: 'student', organization: { name: 'Skill Setu Dev Academy' } },
  { email: 'recruiter@dev.skillsetu.test', role: 'industry', organization: { name: 'Dev TechNova Pvt Ltd' } },
  { email: 'college@dev.skillsetu.test', role: 'college', organization: { name: 'Dev AYUSH College', code: 'DEVAYUSH' } },
  { email: 'admin@dev.skillsetu.test', role: 'admin', organization: { name: 'Skill Setu Dev' } },
];

const PASSWORD_ENV = 'SKILLSETU_DEV_AUTH_PASSWORD';
const MIN_PASSWORD_LENGTH = 12;

/**
 * No password is ever hardcoded. If the environment does not supply one, a random
 * password is generated and printed exactly once — Firebase never receives a
 * password we could have predicted.
 */
export function resolveDevPassword(env: NodeJS.ProcessEnv): { password: string; generated: boolean } {
  const supplied = env[PASSWORD_ENV];

  if (supplied && supplied.length > 0) {
    if (supplied.length < MIN_PASSWORD_LENGTH) {
      throw new TargetSafetyError(
        `${PASSWORD_ENV} must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
    }
    return { password: supplied, generated: false };
  }

  return { password: `Dev-${randomBytes(18).toString('base64url')}`, generated: true };
}

async function findOrCreateCompany(pool: Pool, name: string): Promise<string> {
  const normalized = normalizeOrganizationName(name);
  const existing = await pool.query<{ id: string }>(
    'SELECT id FROM companies WHERE normalized_name = $1 LIMIT 1',
    [normalized],
  );

  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  const inserted = await pool.query<{ id: string }>(
    'INSERT INTO companies (name, normalized_name) VALUES ($1,$2) ON CONFLICT (normalized_name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
    [name, normalized],
  );

  return inserted.rows[0]!.id;
}

async function findOrCreateCollege(pool: Pool, name: string, code: string): Promise<string> {
  const normalized = normalizeOrganizationName(name);
  const existing = await pool.query<{ id: string }>(
    'SELECT id FROM colleges WHERE code = $1 LIMIT 1',
    [code],
  );

  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO colleges (name, normalized_name, code) VALUES ($1,$2,$3)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
    [name, normalized, code],
  );

  return inserted.rows[0]!.id;
}

type UidLookup = { uid: string; created: boolean };

/**
 * Upsert keyed on the Firebase UID. Email is never the lookup key: it is mutable,
 * and two identities could otherwise collide on it.
 */
async function upsertFirebaseUser(
  auth: Auth,
  email: string,
  password: string,
): Promise<UidLookup> {
  try {
    const created = await auth.createUser({ email, password, emailVerified: true, disabled: false });
    return { uid: created.uid, created: true };
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/email-already-exists') {
      const existing = await auth.getUserByEmail(email);

      // Keeps the password in step with the env var without ever being hardcoded.
      await auth.updateUser(existing.uid, { password, emailVerified: true, disabled: false });
      return { uid: existing.uid, created: false };
    }
    throw error;
  }
}

export type SeedSummary = {
  email: string;
  role: ApplicationRole;
  firebaseUid: string;
  firebaseUserCreated: boolean;
  organizationStrategy: string;
};

export async function seedDevAuth(env: NodeJS.ProcessEnv = process.env): Promise<SeedSummary[]> {
  const command = 'auth:seed:dev';

  assertNotProductionMode(env.NODE_ENV, command);

  const target: FirebaseTarget = resolveFirebaseTarget(env);

  // Gate 1: never the production Firebase project.
  assertNotProductionTarget(target, command);

  // And never a production database.
  assertDevelopmentDatabase(env, command);

  const { databaseUrl } = loadDatabaseEnv(env);

  // Structural emulator guarantee lives in createAdmin: only { projectId }, no cert.
  const admin = initializeFirebaseAdmin({
    projectId: target.resolvedProjectId,
    clientEmail: env.FIREBASE_CLIENT_EMAIL ?? '',
    privateKey: env.FIREBASE_PRIVATE_KEY ?? '',
    emulatorHost: target.emulatorHost,
  });

  if (target.kind === 'emulator' && carriesServiceAccountCredential(admin.app)) {
    throw new TargetSafetyError(
      `${command}: the Admin app carries a service-account credential while the emulator is ` +
        'targeted. Aborting rather than risk writing to a real project.',
    );
  }

  const { password, generated } = resolveDevPassword(env);

  if (generated) {
    logger.warn(
      { passwordEnv: PASSWORD_ENV },
      `${PASSWORD_ENV} was not set; generated a random development password (printed once below)`,
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const summary: SeedSummary[] = [];

  try {
    for (const persona of PERSONAS) {
      const { uid, created } = await upsertFirebaseUser(admin.auth, persona.email, password);

      let companyId: string | null = null;
      let collegeId: string | null = null;
      let organizationStrategy = 'none';

      if (persona.role === 'industry') {
        companyId = await findOrCreateCompany(pool, persona.organization.name);
        organizationStrategy = 'company';
      } else if (persona.role === 'college') {
        collegeId = await findOrCreateCollege(
          pool,
          persona.organization.name,
          persona.organization.code!,
        );
        organizationStrategy = 'college';
      }

      // Keyed on firebase_uid: the one authoritative chain
      //   Firebase Auth UID -> users.firebase_uid -> users.role
      await pool.query(
        `INSERT INTO users (firebase_uid, email, display_name, role, status, company_id, college_id)
         VALUES ($1,$2,$3,$4,'active',$5,$6)
         ON CONFLICT (firebase_uid) DO UPDATE SET
           email = EXCLUDED.email,
           display_name = EXCLUDED.display_name,
           role = EXCLUDED.role,
           status = 'active',
           company_id = EXCLUDED.company_id,
           college_id = EXCLUDED.college_id`,
        [uid, persona.email, persona.email.split('@')[0] ?? persona.email, persona.role, companyId, collegeId],
      );

      await admin.auth.setCustomUserClaims(uid, { role: persona.role, status: 'active' });

      summary.push({
        email: persona.email,
        role: persona.role,
        firebaseUid: uid,
        firebaseUserCreated: created,
        organizationStrategy,
      });
    }

    // Printed once, never logged, never persisted.
    if (generated) {
      process.stdout.write(
        `\n${PASSWORD_ENV} was not set. Generated development password (shown once):\n  ${password}\n\n`,
      );
    }

    logger.info(
      { target: describeTarget(target), personas: summary.length },
      'auth:seed:dev complete',
    );

    return summary;
  } finally {
    await pool.end();
  }
}

const isDirectRun = require.main === module;

if (isDirectRun) {
  void (async () => {
    try {
      // loadLocalEnvFile, not loadEnv: the emulator path legitimately needs no
      // service account, and demanding one here would block the safe setup the
      // target gates exist to encourage.
      loadLocalEnvFile();
      await seedDevAuth();
    } catch (error) {
      if (error instanceof TargetSafetyError) {
        process.stderr.write(`\nREFUSED — ${error.message}\n\n`);
        process.exit(1);
      }
      logger.fatal({ err: error }, 'auth:seed:dev failed');
      process.exit(1);
    }
  })();
}
