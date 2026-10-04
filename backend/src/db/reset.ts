import { Client } from 'pg';
import { loadDatabaseEnv } from '../config/env';
import { logger } from '../lib/logger';
import { redactTarget, runMigrations } from './migrate';
import { runSeed } from './seed';

const DESTRUCTIVE_RESET_ACK = 'SKILLSETU_ALLOW_DESTRUCTIVE_RESET';

type GuardFailure = {
  guard: string;
  message: string;
};

function evaluateGuards(nodeEnv: string | undefined, acknowledgement: string | undefined): GuardFailure[] {
  const failures: GuardFailure[] = [];

  if (nodeEnv === 'production') {
    failures.push({
      guard: 'node-env',
      message:
        'db:reset refuses to run when NODE_ENV=production. Production deploys use db:migrate, which is additive and idempotent.',
    });
  }

  if (acknowledgement !== '1') {
    failures.push({
      guard: 'acknowledgement',
      message: `db:reset requires ${DESTRUCTIVE_RESET_ACK}=1 in the environment. This is a second, independent guard: a mistaken NODE_ENV must not be enough to wipe live data.`,
    });
  }

  return failures;
}

export async function resetDatabase(): Promise<void> {
  const env = loadDatabaseEnv();
  const failures = evaluateGuards(process.env.NODE_ENV, process.env[DESTRUCTIVE_RESET_ACK]);

  if (failures.length > 0) {
    for (const failure of failures) {
      logger.fatal({ guard: failure.guard }, failure.message);
    }
    throw new Error(
      `db:reset refused: ${failures.map((failure) => failure.guard).join(' + ')} guard(s) failed. Nothing was dropped.`,
    );
  }

  const target = redactTarget(env.databaseUrl);
  const client = new Client({ connectionString: env.databaseUrl });

  logger.warn({ target }, 'db:reset: dropping the public schema');

  try {
    await client.connect();
    await client.query('DROP SCHEMA IF EXISTS public CASCADE');
    await client.query('CREATE SCHEMA public');
  } finally {
    await client.end().catch(() => undefined);
  }

  logger.warn({ target }, 'db:reset: schema dropped, re-running migrations');

  const migrationResult = await runMigrations();
  const seedResult = await runSeed();

  logger.warn(
    {
      target,
      appliedMigrations: migrationResult.applied.length,
      seededTables: seedResult.tableCounts,
      totalRows: seedResult.totalRows,
      elapsedMs: migrationResult.elapsedMs,
    },
    'db:reset: complete',
  );
}

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      logger.error({ err: error }, 'db:reset: failed');
      process.exit(1);
    });
}
