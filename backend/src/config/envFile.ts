import fs from 'node:fs';
import path from 'node:path';

const BACKEND_PACKAGE_NAME = 'skillsetu-backend';
const MAX_ANCESTOR_DEPTH = 10;

/**
 * Resolves the backend package root by walking up to the package.json that
 * declares skillsetu-backend. Anchoring on the package name rather than on a
 * fixed number of parent hops is what lets the same code work from
 * backend/src/config (tsx) and backend/dist/backend/src/config (compiled),
 * which sit at different depths.
 */
export function resolveBackendRoot(startDir: string = __dirname): string | null {
  let current = startDir;

  for (let depth = 0; depth <= MAX_ANCESTOR_DEPTH; depth += 1) {
    const manifest = path.join(current, 'package.json');

    if (fs.existsSync(manifest)) {
      try {
        const parsed: unknown = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        const name = (parsed as { name?: unknown } | null)?.name;

        if (name === BACKEND_PACKAGE_NAME) {
          return current;
        }
      } catch {
        // Unreadable manifest: keep walking rather than failing the boot.
      }
    }

    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  return null;
}

/**
 * Loads backend/.env for local development.
 *
 * Deliberately implemented on node:fs with no new dependency, and deliberately
 * never overriding a variable that is already set: a real environment variable
 * must always win over the file. That is what keeps the Render deployment
 * working, where credentials come from the service environment and no .env file
 * is present at all.
 */
export function loadLocalEnvFile(
  source: NodeJS.ProcessEnv = process.env,
  startDir?: string,
): { loaded: boolean; path: string | null } {
  const backendRoot = resolveBackendRoot(startDir);

  if (!backendRoot) {
    return { loaded: false, path: null };
  }

  const envPath = path.join(backendRoot, '.env');

  if (!fs.existsSync(envPath)) {
    return { loaded: false, path: null };
  }

  let contents: string;

  try {
    contents = fs.readFileSync(envPath, 'utf8');
  } catch {
    return { loaded: false, path: envPath };
  }

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');

    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }

    if (source[key] !== undefined) {
      continue;
    }

    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }

    source[key] = value;
  }

  return { loaded: true, path: envPath };
}