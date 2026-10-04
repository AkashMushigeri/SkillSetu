import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { resolveFirebaseTarget, TargetSafetyError } from '../src/lib/firebaseTarget';
import { parseArgs } from '../src/scripts/bootstrapAdmin';
import { setupTestContext, teardownTestContext } from './harness';
import { getPool } from './harness';
import { seedDevAuth } from '../src/scripts/seedDevAuth';
import { loadLocalEnvFile } from '../src/config/envFile';

const PRODUCTION_PROJECT = 'skillsetu-6e06a';
const EMULATOR = '127.0.0.1:9099';

before(async () => {
  await setupTestContext();
});

after(async () => {
  await teardownTestContext();
});

/**
 * Pure gate logic, asserted without touching Firebase or PostgreSQL. These are the
 * refusals that matter most, so they are exercised as a matrix rather than one at
 * a time.
 */
describe('target resolution', () => {
  it('an emulator host makes the target safe regardless of project-id equality', () => {
    const target = resolveFirebaseTarget({
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_DEV_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
    });
    assert.equal(target.kind, 'emulator');
    assert.equal(target.resolvedProjectId, PRODUCTION_PROJECT);
  });

  it('a distinct dev project id is a development target', () => {
    const target = resolveFirebaseTarget({
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_DEV_PROJECT_ID: 'skillsetu-dev-2',
    });
    assert.equal(target.kind, 'development');
    assert.equal(target.resolvedProjectId, 'skillsetu-dev-2');
  });

  it('no emulator and no dev project resolves to production', () => {
    const target = resolveFirebaseTarget({ FIREBASE_PROJECT_ID: PRODUCTION_PROJECT });
    assert.equal(target.kind, 'production');
    assert.equal(target.resolvedProjectId, PRODUCTION_PROJECT);
  });

  it('no project configured at all is refused rather than guessed', () => {
    assert.throws(() => resolveFirebaseTarget({}), TargetSafetyError);
  });
});

describe('auth:bootstrap-admin argument and gate matrix', () => {
  it('requires --email', () => {
    assert.throws(() => parseArgs(['--confirm']), TargetSafetyError);
  });

  it('rejects a malformed email', () => {
    assert.throws(() => parseArgs(['--email=not-an-email', '--confirm']), TargetSafetyError);
  });

  it('parses confirm and expect-project', () => {
    const args = parseArgs(['--email=Owner@SkillSetu.app', '--confirm', `--expect-project=${PRODUCTION_PROJECT}`]);
    assert.equal(args.email, 'owner@skillsetu.app');
    assert.equal(args.confirm, true);
    assert.equal(args.expectProject, PRODUCTION_PROJECT);
  });

  it('no hardcoded password is present in the source', async () => {
    const fs = await import('node:fs');
    const source = fs.readFileSync(require.resolve('../src/scripts/bootstrapAdmin.ts'), 'utf8');
    assert.ok(!/password\s*[:=]\s*['"][^'"]+['"]/.test(source), 'bootstrapAdmin must not hardcode a password');
  });
});

describe('auth:seed:dev target safeguards', () => {
  it('refuses when NODE_ENV=production', async () => {
    await assert.rejects(
      () =>
        seedDevAuth({
          NODE_ENV: 'production',
          FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
          FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
        }),
      TargetSafetyError,
    );
  });

  it('refuses when there is no emulator and no separate dev project', async () => {
    await assert.rejects(
      () => seedDevAuth({ NODE_ENV: 'development', FIREBASE_PROJECT_ID: PRODUCTION_PROJECT }),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /production Firebase project/);
        return true;
      },
    );
  });

  it('refuses when the Neon branch is not a development branch', async () => {
    await assert.rejects(
      () =>
        seedDevAuth({
          NODE_ENV: 'development',
          FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
          FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
          NEON_BRANCH: 'production',
        }),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /Neon branch/);
        return true;
      },
    );
  });
});

describe('auth:seed:dev execution', () => {
  it('is idempotent and maps each persona to the correct role', async () => {
    loadLocalEnvFile();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NODE_ENV: 'development',
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
      NEON_BRANCH: 'dev',
      SKILLSETU_DEV_AUTH_PASSWORD: 'Seed-Passw0rd-not-a-secret',
    };

    await getPool().query('DELETE FROM role_requests');
    await getPool().query(
      "DELETE FROM users WHERE email IN ('student@dev.skillsetu.test','recruiter@dev.skillsetu.test','college@dev.skillsetu.test','admin@dev.skillsetu.test')",
    );

    const first = await seedDevAuth(env);
    const second = await seedDevAuth(env);

    assert.equal(first.length, 4);
    assert.equal(second.length, 4);

    const expected: Record<string, string> = {
      'student@dev.skillsetu.test': 'student',
      // "recruiter" is a persona name only; the database role is industry.
      'recruiter@dev.skillsetu.test': 'industry',
      'college@dev.skillsetu.test': 'college',
      'admin@dev.skillsetu.test': 'admin',
    };

    for (const email of Object.keys(expected)) {
      const a = first.find((p) => p.email === email);
      const b = second.find((p) => p.email === email);
      assert.ok(a && b, `${email} must be seeded`);
      assert.equal(a!.role, expected[email], `${email} role`);
      assert.equal(a!.firebaseUid, b!.firebaseUid, `${email} uid must be stable across runs`);
    }

    const rows = await getPool().query(
      'SELECT email, role, status, firebase_uid, company_id, college_id FROM users WHERE email = ANY($1)',
      [Object.keys(expected)],
    );
    assert.equal(rows.rows.length, 4, 'repeated runs must not create duplicates');

    for (const row of rows.rows) {
      assert.equal(row.role, expected[row.email as keyof typeof expected]);
      assert.equal(row.status, 'active');
      assert.ok(row.firebase_uid, 'firebase_uid must be written');
    }

    const industry = rows.rows.find((r) => r.email === 'recruiter@dev.skillsetu.test');
    assert.ok(industry?.company_id, 'the industry persona needs a company_id');

    const college = rows.rows.find((r) => r.email === 'college@dev.skillsetu.test');
    assert.ok(college?.college_id, 'the college persona needs a college_id');

    // No `recruiter` role may exist anywhere.
    const recruiterRole = await getPool().query(
      "SELECT count(*)::int AS n FROM users WHERE role::text = 'recruiter'",
    );
    assert.equal(recruiterRole.rows[0].n, 0);
  });
});

describe('first-admin bootstrap against a development target', () => {
  it('succeeds once and refuses the second invocation', async () => {
    loadLocalEnvFile();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NODE_ENV: 'development',
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
      NEON_BRANCH: 'dev',
    };

    // Isolate the one-time gate from any admin the seed created.
    await getPool().query("DELETE FROM users WHERE role = 'admin'");

    const { bootstrapAdmin } = await import('../src/scripts/bootstrapAdmin');

    const first = await bootstrapAdmin(
      { email: 'bootstrap-owner@dev.skillsetu.test', confirm: true, expectProject: null, password: null },
      env,
    );
    assert.equal(first.role, 'admin');
    assert.equal(first.status, 'active');

    const row = await getPool().query('SELECT role, status FROM users WHERE firebase_uid = $1', [first.firebaseUid]);
    assert.equal(row.rows[0].role, 'admin');
    assert.equal(row.rows[0].status, 'active');

    await assert.rejects(
      () =>
        bootstrapAdmin(
          { email: 'second-owner@dev.skillsetu.test', confirm: true, expectProject: null, password: null },
          env,
        ),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /already exists/);
        return true;
      },
    );

    const admins = await getPool().query("SELECT count(*)::int AS n FROM users WHERE role = 'admin'");
    assert.equal(admins.rows[0].n, 1, 'the refusal must not have created a second admin');
  });

  it('refuses a mismatched --expect-project even on a development target', async () => {
    loadLocalEnvFile();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NODE_ENV: 'development',
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
      NEON_BRANCH: 'dev',
    };

    await getPool().query("DELETE FROM users WHERE role = 'admin'");

    const { bootstrapAdmin } = await import('../src/scripts/bootstrapAdmin');

    await assert.rejects(
      () =>
        bootstrapAdmin(
          {
            email: 'typo-owner@dev.skillsetu.test',
            confirm: true,
            expectProject: 'wrong-project-id',
            password: null,
          },
          env,
        ),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /does not match the resolved project/);
        return true;
      },
    );

    const admins = await getPool().query("SELECT count(*)::int AS n FROM users WHERE role = 'admin'");
    assert.equal(admins.rows[0].n, 0, 'a failed gate must mutate nothing');
  });

  it('refuses without --confirm', async () => {
    loadLocalEnvFile();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NODE_ENV: 'development',
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
      NEON_BRANCH: 'dev',
    };

    await getPool().query("DELETE FROM users WHERE role = 'admin'");

    const { bootstrapAdmin } = await import('../src/scripts/bootstrapAdmin');

    await assert.rejects(
      () =>
        bootstrapAdmin(
          { email: 'unconfirmed@dev.skillsetu.test', confirm: false, expectProject: null, password: null },
          env,
        ),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /--confirm is required/);
        return true;
      },
    );
  });
});

describe('first-admin bootstrap against a production target', () => {
  const prodTarget = resolveFirebaseTarget({ FIREBASE_PROJECT_ID: PRODUCTION_PROJECT });

  it('refuses when NODE_ENV=development but the resolved project is production', async () => {
    const { bootstrapAdmin } = await import('../src/scripts/bootstrapAdmin');

    await assert.rejects(
      () =>
        bootstrapAdmin(
          { email: 'dev-mode-owner@skillsetu.app', confirm: true, expectProject: PRODUCTION_PROJECT, password: null },
          { NODE_ENV: 'development', FIREBASE_PROJECT_ID: PRODUCTION_PROJECT, FIREBASE_AUTH_EMULATOR_HOST: '' },
        ),
      (error: Error) => {
        assert.ok(error instanceof TargetSafetyError);
        assert.match(error.message, /refusing to target the production Firebase project/);
        return true;
      },
    );
  });

  it('refuses a production target that is missing any one safeguard', async () => {
    const { evaluateBootstrapGates } = await import('../src/scripts/bootstrapAdmin');
    const base = { email: 'prod-owner@skillsetu.app', password: null };

    // No token.
    const noToken = evaluateBootstrapGates(
      prodTarget,
      { ...base, confirm: true, expectProject: PRODUCTION_PROJECT },
      {},
    );
    assert.equal(noToken.allowed, false);
    assert.match((noToken as { reason: string }).reason, /requires SKILLSETU_ADMIN_BOOTSTRAP_TOKEN/);

    // No --expect-project.
    const noProject = evaluateBootstrapGates(
      prodTarget,
      { ...base, confirm: true, expectProject: null },
      { SKILLSETU_ADMIN_BOOTSTRAP_TOKEN: 'x' },
    );
    assert.equal(noProject.allowed, false);
    assert.match((noProject as { reason: string }).reason, /requires --expect-project/);

    // Token present but no --confirm.
    const noConfirm = evaluateBootstrapGates(
      prodTarget,
      { ...base, confirm: false, expectProject: PRODUCTION_PROJECT },
      { SKILLSETU_ADMIN_BOOTSTRAP_TOKEN: 'x' },
    );
    assert.equal(noConfirm.allowed, false);
    assert.match((noConfirm as { reason: string }).reason, /--confirm is required/);

    // A mismatched --expect-project fails closed even with the other two present.
    const typo = evaluateBootstrapGates(
      prodTarget,
      { ...base, confirm: true, expectProject: 'skillsetu-6e06b' },
      { SKILLSETU_ADMIN_BOOTSTRAP_TOKEN: 'x' },
    );
    assert.equal(typo.allowed, false);
    assert.match((typo as { reason: string }).reason, /does not match the resolved project/);
  });

  it('allows a fully safeguarded production target (validation row 15f)', async () => {
    const { evaluateBootstrapGates } = await import('../src/scripts/bootstrapAdmin');

    // Asserted at the gate level only: actually running this would mint an admin in
    // a real Firebase project, which this task must never do.
    const verdict = evaluateBootstrapGates(
      prodTarget,
      { email: 'prod-owner@skillsetu.app', confirm: true, expectProject: PRODUCTION_PROJECT, password: null },
      { SKILLSETU_ADMIN_BOOTSTRAP_TOKEN: 'x' },
    );

    assert.equal(verdict.allowed, true);
  });

  it('a development target needs only --confirm, no token', async () => {
    const { evaluateBootstrapGates } = await import('../src/scripts/bootstrapAdmin');
    const devTarget = resolveFirebaseTarget({
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_DEV_PROJECT_ID: 'skillsetu-dev-2',
    });

    assert.equal(
      evaluateBootstrapGates(
        devTarget,
        { email: 'dev-owner@skillsetu.test', confirm: true, expectProject: null, password: null },
        {},
      ).allowed,
      true,
    );

    assert.equal(
      evaluateBootstrapGates(
        devTarget,
        { email: 'dev-owner@skillsetu.test', confirm: false, expectProject: null, password: null },
        {},
      ).allowed,
      false,
    );
  });

  it('an emulator target needs only --confirm and ignores the token', async () => {
    const { evaluateBootstrapGates } = await import('../src/scripts/bootstrapAdmin');
    const emulatorTarget = resolveFirebaseTarget({
      FIREBASE_PROJECT_ID: PRODUCTION_PROJECT,
      FIREBASE_AUTH_EMULATOR_HOST: EMULATOR,
    });

    assert.equal(
      evaluateBootstrapGates(
        emulatorTarget,
        { email: 'emu-owner@skillsetu.test', confirm: true, expectProject: null, password: null },
        {},
      ).allowed,
      true,
    );
  });
});

describe('dev password handling', () => {
  it('generates a random password when none is supplied, and never a fixed one', async () => {
    const { resolveDevPassword } = await import('../src/scripts/seedDevAuth');

    const a = resolveDevPassword({});
    const b = resolveDevPassword({});

    assert.equal(a.generated, true);
    assert.notEqual(a.password, b.password, 'each run must generate a fresh password');
    assert.ok(a.password.length >= 12);
  });

  it('rejects a too-short supplied password', async () => {
    const { resolveDevPassword } = await import('../src/scripts/seedDevAuth');
    assert.throws(
      () => resolveDevPassword({ SKILLSETU_DEV_AUTH_PASSWORD: 'short' }),
      TargetSafetyError,
    );
  });

  it('uses the supplied password when present', async () => {
    const { resolveDevPassword } = await import('../src/scripts/seedDevAuth');
    const result = resolveDevPassword({ SKILLSETU_DEV_AUTH_PASSWORD: 'Long-Enough-Password-1' });
    assert.equal(result.generated, false);
    assert.equal(result.password, 'Long-Enough-Password-1');
  });
});
