import { AppError } from './errors';

/**
 * Two independent, mandatory gates guard every write path to Firebase Auth.
 *
 * The rule this file exists to enforce: `NODE_ENV` describes the *process*, never
 * the *destination*. A `NODE_ENV=development` shell whose `FIREBASE_PROJECT_ID`
 * points at the production project would otherwise bootstrap or seed an admin
 * against production with nothing but a mode flag. So the resolved target is
 * checked first, always, and mode is only consulted afterwards.
 */
export type FirebaseTargetKind = 'emulator' | 'development' | 'production';

export type FirebaseTarget = {
  kind: FirebaseTargetKind;
  /** The project id the Admin app will actually be built against. */
  resolvedProjectId: string;
  /** The project id the process believes is "the real one". */
  configuredProjectId: string;
  emulatorHost: string | null;
  devProjectId: string | null;
};

export type TargetEnvironment = {
  firebaseProjectId: string | null;
  firebaseDevProjectId: string | null;
  firebaseAuthEmulatorHost: string | null;
  nodeEnv: string | undefined;
  neonBranch: string | null;
};

function readEnv(env: NodeJS.ProcessEnv): TargetEnvironment {
  return {
    firebaseProjectId: env.FIREBASE_PROJECT_ID?.trim() || null,
    firebaseDevProjectId: env.FIREBASE_DEV_PROJECT_ID?.trim() || null,
    firebaseAuthEmulatorHost: env.FIREBASE_AUTH_EMULATOR_HOST?.trim() || null,
    nodeEnv: env.NODE_ENV,
    neonBranch: env.NEON_BRANCH?.trim() || null,
  };
}

export class TargetSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TargetSafetyError';
  }
}

/**
 * Resolves where a Firebase write would land.
 *
 *   emulator host set          → 'emulator'   (safe regardless of project ids)
 *   dev id set and different   → 'development'
 *   otherwise                  → 'production'
 *
 * The emulator branch deliberately does not compare project ids: the emulator
 * cannot reach a real project, so demanding a different id would block a perfectly
 * safe setup for no security gain.
 */
export function resolveFirebaseTarget(env: NodeJS.ProcessEnv): FirebaseTarget {
  const {
    firebaseProjectId,
    firebaseDevProjectId,
    firebaseAuthEmulatorHost,
  } = readEnv(env);

  if (firebaseAuthEmulatorHost) {
    return {
      kind: 'emulator',
      resolvedProjectId: firebaseDevProjectId ?? firebaseProjectId ?? 'skillsetu-emulator',
      configuredProjectId: firebaseProjectId ?? '',
      emulatorHost: firebaseAuthEmulatorHost,
      devProjectId: firebaseDevProjectId,
    };
  }

  const resolvedProjectId = firebaseDevProjectId ?? firebaseProjectId;

  if (!resolvedProjectId) {
    throw new TargetSafetyError(
      'Refusing to proceed: neither FIREBASE_PROJECT_ID nor FIREBASE_DEV_PROJECT_ID is set, ' +
        'so the write target is unknown.',
    );
  }

  return {
    kind: firebaseDevProjectId && firebaseDevProjectId !== firebaseProjectId ? 'development' : 'production',
    resolvedProjectId,
    configuredProjectId: firebaseProjectId ?? '',
    emulatorHost: null,
    devProjectId: firebaseDevProjectId,
  };
}

/**
 * Gate 1 for non-emulator targets: a production Firebase project is never writable
 * from a seeding command, full stop.
 */
export function assertNotProductionTarget(target: FirebaseTarget, command: string): void {
  if (target.kind === 'production') {
    throw new TargetSafetyError(
      `${command}: refusing to write to the production Firebase project ` +
        `("${target.resolvedProjectId}"). Set FIREBASE_AUTH_EMULATOR_HOST for local work, or set ` +
        `FIREBASE_DEV_PROJECT_ID to a non-production project id.`,
    );
  }
}

export function assertNotProductionMode(nodeEnv: string | undefined, command: string): void {
  if (nodeEnv === 'production') {
    throw new TargetSafetyError(`${command}: refusing to run with NODE_ENV=production.`);
  }
}

/**
 * A seeding command must not write identities into a production database either.
 * `NEON_BRANCH` is the discriminator; an absent value is not treated as production
 * because the Firebase gates already cover the dangerous case.
 */
export function assertDevelopmentDatabase(env: NodeJS.ProcessEnv, command: string): void {
  const { neonBranch } = readEnv(env);

  if (neonBranch && !/^(dev|develop|development|preview)$/i.test(neonBranch)) {
    throw new TargetSafetyError(
      `${command}: refusing to run against the Neon branch "${neonBranch}". ` +
        'Only a development branch may be seeded.',
    );
  }
}

export function describeTarget(target: FirebaseTarget): string {
  return `${target.kind} (resolved project: ${target.resolvedProjectId}` +
    `${target.emulatorHost ? `, emulator: ${target.emulatorHost}` : ''})`;
}

export { AppError };
