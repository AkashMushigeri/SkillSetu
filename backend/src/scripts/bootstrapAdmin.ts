import { Pool } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import { loadDatabaseEnv } from '../config/env';
import { loadLocalEnvFile } from '../config/envFile';
import { logger } from '../lib/logger';
import { carriesServiceAccountCredential, initializeFirebaseAdmin } from '../lib/firebaseAdmin';
import {
  describeTarget,
  resolveFirebaseTarget,
  TargetSafetyError,
  type FirebaseTarget,
} from '../lib/firebaseTarget';

const TOKEN_ENV = 'SKILLSETU_ADMIN_BOOTSTRAP_TOKEN';

export type BootstrapArgs = {
  email: string;
  confirm: boolean;
  expectProject: string | null;
  password: string | null;
};

/**
 * CLI-only by construction: there is deliberately no HTTP route anywhere that can
 * mint an admin. This is the one and only path.
 */
export function parseArgs(argv: readonly string[]): BootstrapArgs {
  const flags = new Map<string, string>();

  let confirm = false;

  for (const arg of argv) {
    if (arg === '--confirm') {
      confirm = true;
      continue;
    }

    const match = /^--([a-zA-Z-]+)(?:=(.*))?$/.exec(arg);

    if (match) {
      flags.set(match[1]!, match[2] ?? '');
    }
  }

  const email = flags.get('email');

  if (!email || !email.includes('@')) {
    throw new TargetSafetyError('--email=<address> is required and must look like an email address.');
  }

  return {
    email: email.trim().toLowerCase(),
    confirm,
    expectProject: flags.get('expect-project')?.trim() || null,
    password: flags.get('password') || null,
  };
}

export type GateVerdict = { allowed: true } | { allowed: false; reason: string };

/**
 * The two gates, as a pure function so the safety matrix can be tested directly
 * without performing a write.
 *
 * Gate 1 — target safety, in every mode. `NODE_ENV` is never consulted: it
 * describes the process, not the destination, so `NODE_ENV=development` with
 * FIREBASE_PROJECT_ID pointing at production must still be refused unless the
 * production safeguards are present.
 *
 * Gate 2 — acknowledgement, which is what actually authorises a production target:
 *   SKILLSETU_ADMIN_BOOTSTRAP_TOKEN + --confirm + a matching --expect-project.
 * A development or emulator target needs only --confirm.
 */
export function evaluateBootstrapGates(
  target: FirebaseTarget,
  args: BootstrapArgs,
  env: NodeJS.ProcessEnv,
): GateVerdict {
  const isProduction = target.kind === 'production';

  // A typo'd --expect-project must fail closed rather than silently target the
  // wrong project, so this is checked whenever the flag is present at all.
  if (args.expectProject !== null && args.expectProject !== target.resolvedProjectId) {
    return {
      allowed: false,
      reason:
        `--expect-project "${args.expectProject}" does not match the resolved project ` +
        `"${target.resolvedProjectId}".`,
    };
  }

  if (!args.confirm) {
    return { allowed: false, reason: '--confirm is required. This command creates a privileged account.' };
  }

  if (!isProduction) {
    return { allowed: true };
  }

  if (!env[TOKEN_ENV]) {
    return {
      allowed: false,
      reason:
        `refusing to target the production Firebase project ("${target.resolvedProjectId}"): a ` +
        `production target additionally requires ${TOKEN_ENV} to be set. Set ` +
        'FIREBASE_AUTH_EMULATOR_HOST or FIREBASE_DEV_PROJECT_ID for development work.',
    };
  }

  if (args.expectProject === null) {
    return {
      allowed: false,
      reason:
        `refusing to target the production Firebase project ("${target.resolvedProjectId}"): a ` +
        'production target additionally requires --expect-project.',
    };
  }

  return { allowed: true };
}

function assertGates(target: FirebaseTarget, args: BootstrapArgs, env: NodeJS.ProcessEnv): void {
  const verdict = evaluateBootstrapGates(target, args, env);

  if (!verdict.allowed) {
    throw new TargetSafetyError(`auth:bootstrap-admin: ${verdict.reason}`);
  }
}

/** The one-time gate: never silently overwrite or add a second admin. */
async function assertNoAdminExists(pool: Pool): Promise<void> {
  const existing = await pool.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM users WHERE role = 'admin'",
  );

  if (Number(existing.rows[0]?.count ?? '0') > 0) {
    throw new TargetSafetyError(
      'auth:bootstrap-admin: an admin already exists. This command is a one-time bootstrap and ' +
        'refuses to run again.',
    );
  }
}

async function upsertFirebaseUser(auth: Auth, email: string, password: string | null): Promise<string> {
  try {
    const created = await auth.createUser({ email, emailVerified: true, disabled: false });

    if (password) {
      await auth.updateUser(created.uid, { password });
    }

    return created.uid;
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/email-already-exists') {
      const existing = await auth.getUserByEmail(email);

      if (password) {
        await auth.updateUser(existing.uid, { password });
      }

      return existing.uid;
    }
    throw error;
  }
}

export type BootstrapResult = {
  email: string;
  firebaseUid: string;
  target: string;
  role: 'admin';
  status: 'active';
};

export async function bootstrapAdmin(
  args: BootstrapArgs,
  env: NodeJS.ProcessEnv = process.env,
): Promise<BootstrapResult> {
  const target = resolveFirebaseTarget(env);

  assertGates(target, args, env);

  const { databaseUrl } = loadDatabaseEnv(env);

  const admin = initializeFirebaseAdmin({
    projectId: target.resolvedProjectId,
    clientEmail: env.FIREBASE_CLIENT_EMAIL ?? '',
    privateKey: env.FIREBASE_PRIVATE_KEY ?? '',
    emulatorHost: target.emulatorHost,
  });

  if (target.kind === 'emulator' && carriesServiceAccountCredential(admin.app)) {
    throw new TargetSafetyError(
      'auth:bootstrap-admin: the Admin app carries a service-account credential while the emulator ' +
        'is targeted. Aborting.',
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    await assertNoAdminExists(pool);

    const uid = await upsertFirebaseUser(admin.auth, args.email, args.password);

    await pool.query(
      `INSERT INTO users (firebase_uid, email, display_name, role, status)
       VALUES ($1,$2,$3,'admin','active')
       ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email, role = 'admin', status = 'active'`,
      [uid, args.email, args.email.split('@')[0] ?? args.email],
    );

    await admin.auth.setCustomUserClaims(uid, { role: 'admin', status: 'active' });

    logger.info({ target: describeTarget(target) }, 'auth:bootstrap-admin complete');

    return { email: args.email, firebaseUid: uid, target: describeTarget(target), role: 'admin', status: 'active' };
  } finally {
    await pool.end();
  }
}

const isDirectRun = require.main === module;

if (isDirectRun) {
  void (async () => {
    try {
      loadLocalEnvFile();

      const args = parseArgs(process.argv.slice(2));
      const result = await bootstrapAdmin(args);

      // The UID is not a secret, and printing it is what makes the command usable.
      process.stdout.write(
        `\nAdmin bootstrapped\n  email : ${result.email}\n  uid   : ${result.firebaseUid}\n` +
          `  target: ${result.target}\n  role  : admin (active)\n\n`,
      );
    } catch (error) {
      if (error instanceof TargetSafetyError) {
        process.stderr.write(`\nREFUSED — ${error.message}\n\n`);
        process.exit(1);
      }
      logger.fatal({ err: error }, 'auth:bootstrap-admin failed');
      process.exit(1);
    }
  })();
}
