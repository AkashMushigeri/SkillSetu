import fs from 'node:fs';
import path from 'node:path';

const MAX_ANCESTOR_DEPTH = 10;
const MIGRATION_FILE_SUFFIX = '.sql';

export function isDirectory(candidate: string): boolean {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

export function resolveMigrationsDir(source: NodeJS.ProcessEnv = process.env): string {
  const override = source.MIGRATIONS_DIR?.trim();

  if (override) {
    const resolved = path.resolve(override);
    if (!isDirectory(resolved)) {
      throw new Error(
        `MIGRATIONS_DIR is set but "${resolved}" is not a directory. Unset it to use the anchored default.`,
      );
    }
    return resolved;
  }

  let current = __dirname;

  for (let depth = 0; depth <= MAX_ANCESTOR_DEPTH; depth += 1) {
    const candidates = [
      path.join(current, 'migrations'),
      path.join(current, 'backend', 'migrations'),
    ];

    for (const candidate of candidates) {
      if (isDirectory(candidate)) {
        return candidate;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  throw new Error(
    'Could not resolve a migrations directory by walking up from the compiled or source location. Set MIGRATIONS_DIR to the absolute path of the backend/migrations directory.',
  );
}

export function listMigrationFiles(migrationsDir: string): string[] {
  return fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(MIGRATION_FILE_SUFFIX))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export function readMigration(migrationsDir: string, fileName: string): string {
  return fs.readFileSync(path.join(migrationsDir, fileName), 'utf8');
}