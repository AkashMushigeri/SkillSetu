import { z } from 'zod';
import { loadLocalEnvFile } from './envFile';
import { describePrivateKeyShape, normalisePrivateKey } from '../lib/privateKey';
import { logger } from '../lib/logger';

const REQUIRED_VARIABLES = [
  'DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'ALLOWED_ORIGINS',
] as const;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(3001),
  LOG_LEVEL: z.string().min(1).default('info'),
  DATABASE_URL: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().min(1).optional(),
  ALLOWED_ORIGINS: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1).optional(),
});

export type Env = {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  logLevel: string;
  databaseUrl: string;
  firebaseProjectId: string;
  firebaseClientEmail: string;
  firebasePrivateKey: string;
  firebaseAuthEmulatorHost: string | null;
  allowedOrigins: string[];
  geminiApiKey: string | null;
};

export class EnvValidationError extends Error {
  readonly missingVariables: readonly string[];

  constructor(missingVariables: readonly string[]) {
    super(
      `Refusing to start: missing or invalid environment ${
        missingVariables.length === 1 ? 'variable' : 'variables'
      }: ${missingVariables.join(', ')}`,
    );
    this.name = 'EnvValidationError';
    this.missingVariables = missingVariables;
  }
}

/**
 * Normalisation of paste artefacts lives in lib/privateKey alongside the assertion
 * that validates the result. It used to be duplicated here and in firebaseAdmin, and
 * the two copies were free to drift — which is how a quoted PEM reached OpenSSL.
 */

function parseAllowedOrigins(raw: string): string[] {
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export type DatabaseEnv = {
  databaseUrl: string;
};

/**
 * Database-only configuration for the db:* commands.
 *
 * db:migrate, db:verify, db:seed and db:reset never talk to Firebase, so
 * demanding a Firebase service account to run them would block every developer
 * who only has a database URL. This is a deliberately narrower contract than
 * loadEnv, not a relaxation of it: the HTTP server still requires the full set.
 */
export function loadDatabaseEnv(source: NodeJS.ProcessEnv = process.env): DatabaseEnv {
  if (source === process.env) {
    loadLocalEnvFile();
  }

  const databaseUrl = source.DATABASE_URL;

  if (typeof databaseUrl !== 'string' || databaseUrl.trim().length === 0) {
    throw new EnvValidationError(['DATABASE_URL']);
  }

  return { databaseUrl };
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  // Local development convenience only: fills in any variable that is not already
  // set from backend/.env. A real environment variable always wins, and on Render
  // there is no .env file, so deployment behaviour is unchanged.
  if (source === process.env) {
    loadLocalEnvFile();
  }

  const missing = REQUIRED_VARIABLES.filter((name) => {
    const value = source[name];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new EnvValidationError(missing);
  }

  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new EnvValidationError(
      Array.from(
        new Set(
          parsed.error.issues.map((issue) =>
            issue.path.length > 0 ? issue.path.join('.') : 'unknown',
          ),
        ),
      ),
    );
  }

  const allowedOrigins = parseAllowedOrigins(parsed.data.ALLOWED_ORIGINS);

  if (allowedOrigins.length === 0) {
    throw new EnvValidationError(['ALLOWED_ORIGINS']);
  }

  // Logged here, not in createAdmin, because this is the last point at which the value
  // is still exactly what the environment supplied. createAdmin receives the rebuilt
  // PEM, so a shape check there reports a healthy key no matter what was actually
  // stored — which is false reassurance, the opposite of what a diagnostic is for.
  logger.info(
    { privateKeyShape: describePrivateKeyShape(parsed.data.FIREBASE_PRIVATE_KEY) },
    'firebase private key shape as configured',
  );

  return {
    nodeEnv: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    logLevel: parsed.data.LOG_LEVEL,
    databaseUrl: parsed.data.DATABASE_URL,
    firebaseProjectId: parsed.data.FIREBASE_PROJECT_ID,
    firebaseClientEmail: parsed.data.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: normalisePrivateKey(parsed.data.FIREBASE_PRIVATE_KEY),
    firebaseAuthEmulatorHost: parsed.data.FIREBASE_AUTH_EMULATOR_HOST ?? null,
    allowedOrigins,
    geminiApiKey: parsed.data.GEMINI_API_KEY ?? null,
  };
}