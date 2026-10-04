import { createHash } from 'node:crypto';
import { Client } from 'pg';
import { loadDatabaseEnv } from '../config/env';
import { logger } from '../lib/logger';
import { listMigrationFiles, readMigration, resolveMigrationsDir } from './migrationsDir';

const MIGRATION_LOCK_KEY = '8942210000000001';
const MIGRATIONS_TABLE = '__drizzle_migrations';

type AppliedMigrationRow = { hash: string };

type Migration = {
  fileName: string;
  sql: string;
  hash: string;
};

export type MigrateResult = {
  migrationsDir: string;
  totalFiles: number;
  applied: string[];
  skipped: boolean;
  elapsedMs: number;
};

export function redactTarget(connectionString: string): { host: string; database: string } {
  try {
    const parsed = new URL(connectionString);
    return {
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, '') || '(default)',
    };
  } catch {
    return { host: '(unparseable)', database: '(unparseable)' };
  }
}

export function hashMigration(sql: string): string {
  return createHash('sha256').update(sql).digest('hex');
}

function loadMigrations(migrationsDir: string, files: string[]): Migration[] {
  return files.map((fileName) => {
    const sql = readMigration(migrationsDir, fileName);
    return { fileName, sql, hash: hashMigration(sql) };
  });
}

async function readAppliedHashes(client: Client): Promise<Set<string>> {
  const result = await client.query<AppliedMigrationRow>(
    `SELECT hash FROM ${MIGRATIONS_TABLE}`,
  );
  return new Set(result.rows.map((row) => row.hash));
}

async function ensureMigrationsTable(client: Client): Promise<void> {
  await client.query(
    `CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (id SERIAL PRIMARY KEY, hash TEXT NOT NULL, created_at BIGINT)`,
  );
}

export async function runMigrations(): Promise<MigrateResult> {
  const env = loadDatabaseEnv();
  const migrationsDir = resolveMigrationsDir();
  const files = listMigrationFiles(migrationsDir);

  if (files.length === 0) {
    throw new Error(
      `No .sql migration files were found in "${migrationsDir}". Refusing to report success: an empty migrations directory means the build resolved the wrong path.`,
    );
  }

  const migrations = loadMigrations(migrationsDir, files);
  const target = redactTarget(env.databaseUrl);
  const startedAt = Date.now();
  const client = new Client({ connectionString: env.databaseUrl });

  try {
    await client.connect();
    await ensureMigrationsTable(client);
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);

    try {
      const appliedHashes = await readAppliedHashes(client);
      const pending = migrations.filter((migration) => !appliedHashes.has(migration.hash));

      logger.info(
        {
          target,
          migrationsDir,
          totalFiles: migrations.length,
          pendingCount: pending.length,
        },
        'migrations: run started',
      );

      if (pending.length === 0) {
        const elapsedMs = Date.now() - startedAt;
        logger.info(
          { target, totalFiles: migrations.length, elapsedMs },
          'migrations: nothing pending',
        );
        return {
          migrationsDir,
          totalFiles: migrations.length,
          applied: [],
          skipped: true,
          elapsedMs,
        };
      }

      const applied: string[] = [];

      for (const migration of pending) {
        await client.query('BEGIN');
        try {
          await client.query(migration.sql);
          await client.query(
            `INSERT INTO ${MIGRATIONS_TABLE} (hash, created_at) VALUES ($1, $2)`,
            [migration.hash, Date.now()],
          );
          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK').catch(() => undefined);
          throw error;
        }

        applied.push(migration.fileName);
        logger.info(
          {
            file: migration.fileName,
            appliedCount: applied.length,
            remainingCount: pending.length - applied.length,
          },
          'migrations: applied',
        );
      }

      const elapsedMs = Date.now() - startedAt;
      logger.info({ target, appliedCount: applied.length, elapsedMs }, 'migrations: complete');

      return { migrationsDir, totalFiles: migrations.length, applied, skipped: false, elapsedMs };
    } finally {
      await client
        .query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY])
        .catch((error: unknown) => {
          logger.warn({ err: error }, 'migrations: advisory unlock failed');
        });
    }
  } finally {
    await client.end().catch((error: unknown) => {
      logger.warn({ err: error }, 'migrations: client end failed');
    });
  }
}

async function resolveOnly(): Promise<void> {
  const migrationsDir = resolveMigrationsDir();
  const files = listMigrationFiles(migrationsDir);

  logger.info({ migrationsDir, fileCount: files.length, files }, 'migrations: resolved directory');

  if (files.length === 0) {
    logger.error(
      { migrationsDir },
      'migrations: resolved directory contains zero .sql files — this would hard-fail a real run',
    );
    process.exit(1);
  }
}

async function main(): Promise<void> {
  if (process.argv.slice(2).includes('--resolve-only')) {
    await resolveOnly();
    return;
  }

  await runMigrations();
}

if (require.main === module) {
  main().catch((error: unknown) => {
    logger.error({ err: error }, 'migrations: failed');
    process.exit(1);
  });
}