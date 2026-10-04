import { cert, deleteApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { AppError } from './errors';
import { logger } from './logger';
import { assertUsablePrivateKey } from './privateKey';

export type FirebaseAdminState = 'initialized' | 'not_initialized';

/**
 * Emulator hosts are localhost/127.0.0.1 on purpose. Anything else is refused so a
 * typo cannot silently redirect development writes to a real Firebase project.
 */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

/**
 * True only for a real service-account credential.
 *
 * Note this cannot be a null check: firebase-admin v14 silently attaches an
 * `ApplicationDefaultCredential` to any app created without one, so
 * `options.credential` is essentially always populated. The dangerous case is
 * specifically a `cert(...)` service account, which is the only credential that
 * carries signing material, and it is uniquely identifiable by
 * `serviceAccountEmail`.
 */
export function carriesServiceAccountCredential(app: App): boolean {
  const credential = app.options.credential as { serviceAccountEmail?: unknown } | undefined;
  return typeof credential?.serviceAccountEmail === 'string';
}

export type FirebaseCredentialInput = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  emulatorHost: string | null;
};

export type FirebaseAdmin = {
  auth: Auth;
  app: App;
  target: 'emulator' | 'project';
  projectId: string;
};

let cached: FirebaseAdmin | null = null;

function assertLoopbackEmulatorHost(emulatorHost: string): void {
  const [host] = emulatorHost.split(':');

  if (!host || !LOOPBACK_HOSTS.has(host.toLowerCase())) {
    throw new AppError(
      `FIREBASE_AUTH_EMULATOR_HOST must point at a loopback host; refusing "${host}".`,
      { status: 500, code: 'firebase_emulator_host_invalid' },
    );
  }
}

/**
 * Creates the Admin app.
 *
 * On the emulator path the app is constructed with `{ projectId }` ONLY — no
 * `cert(...)`. The emulator needs no service account, and carrying one would be a
 * live credential sitting in a process that believes it is offline.
 * `carriesServiceAccountCredential` asserts the real invariant, so a future
 * refactor cannot quietly reintroduce one.
 */
export function createAdmin(input: FirebaseCredentialInput): FirebaseAdmin {
  const { projectId, clientEmail, privateKey, emulatorHost } = input;

  if (emulatorHost) {
    assertLoopbackEmulatorHost(emulatorHost);

    const emulatorApp = getApps().find((app) => app.name === '[DEFAULT]') ?? initializeApp({ projectId });

    if (carriesServiceAccountCredential(emulatorApp)) {
      throw new AppError(
        'Refusing to continue: the Admin app carries a service-account credential while ' +
          'FIREBASE_AUTH_EMULATOR_HOST is set, so writes could reach a real Firebase project.',
        { status: 500, code: 'firebase_emulator_credential_leak' },
      );
    }

    return { auth: getAuth(emulatorApp), app: emulatorApp, target: 'emulator', projectId };
  }

  if (!projectId || !clientEmail || privateKey.length === 0) {
    throw new AppError(
      'Refusing to start: Firebase Admin requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ' +
        'and FIREBASE_PRIVATE_KEY when no Auth emulator is configured.',
      { status: 500, code: 'firebase_admin_config_missing' },
    );
  }

  const existing = getApps().find((app) => app.name === '[DEFAULT]');

  // NOTE: the shape of the configured key is logged by loadEnv, which still sees the
  // raw environment value. By this point the key has already been rebuilt, so anything
  // measured here would describe the normalised PEM rather than what was supplied.
  let usablePrivateKey: string;

  try {
    usablePrivateKey = assertUsablePrivateKey(privateKey);
  } catch (error) {
    logger.error({ err: error }, 'firebase private key rejected before reaching the Admin SDK');
    throw error;
  }

  // getApps() prevents the duplicate-app error during `tsx watch` reloads.
  const app =
    existing ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: usablePrivateKey,
      }),
    });

  return { auth: getAuth(app), app, target: 'project', projectId };
}

export function initializeFirebaseAdmin(input: FirebaseCredentialInput): FirebaseAdmin {
  if (cached) {
    return cached;
  }

  const admin = createAdmin(input);
  cached = admin;

  logger.info({ target: admin.target, projectId: admin.projectId }, 'firebase admin initialized');

  return admin;
}

export function getFirebaseAdmin(): FirebaseAdmin | null {
  return cached;
}

export function firebaseAdminState(): FirebaseAdminState {
  return cached ? 'initialized' : 'not_initialized';
}

/**
 * Test seam. Drops both the memoised handle and the underlying firebase-admin app,
 * so a suite that targets the emulator can never inherit a service-account app from
 * a previous one.
 */
export function resetFirebaseAdminForTests(): void {
  cached = null;

  for (const app of getApps()) {
    if (app.name === '[DEFAULT]') {
      void deleteApp(app).catch(() => undefined);
    }
  }
}
