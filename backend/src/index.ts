import type { Server } from 'node:http';
import { createApp } from './app';
import { closePool, getPool } from './db/pool';
import { loadEnv } from './config/env';
import { initializeFirebaseAdmin } from './lib/firebaseAdmin';
import { logger } from './lib/logger';

const GRACEFUL_SHUTDOWN_GRACE_MS = 25_000;

async function main(): Promise<void> {
  const env = loadEnv();

  // Firebase Admin initialises before the pool so a misconfigured project fails the
  // boot loudly instead of surfacing as 401s on every request.
  const firebase = initializeFirebaseAdmin({
    projectId: env.firebaseProjectId,
    clientEmail: env.firebaseClientEmail,
    privateKey: env.firebasePrivateKey,
    emulatorHost: env.firebaseAuthEmulatorHost,
  });

  const pool = getPool(env.databaseUrl);

  const app = createApp({
    pool,
    resolveAuth: () => firebase.auth,
    firebaseState: () => 'initialized',
    allowedOrigins: env.allowedOrigins,
  });

  const server: Server = app.listen(env.port, () => {
    logger.info(
      {
        port: env.port,
        nodeEnv: env.nodeEnv,
        allowedOriginCount: env.allowedOrigins.length,
        firebaseTarget: firebase.target,
      },
      'skillsetu-api listening',
    );
  });

  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info({ signal }, 'shutdown requested');

    const forcedExit = setTimeout(() => {
      logger.error({ graceMs: GRACEFUL_SHUTDOWN_GRACE_MS }, 'graceful shutdown timed out');
      process.exit(1);
    }, GRACEFUL_SHUTDOWN_GRACE_MS);
    forcedExit.unref();

    server.close((closeError) => {
      if (closeError) {
        logger.error({ err: closeError }, 'http server failed to close cleanly');
      }

      closePool()
        .catch((poolError: unknown) => {
          logger.error({ err: poolError }, 'postgres pool failed to close cleanly');
        })
        .finally(() => {
          clearTimeout(forcedExit);
          logger.info({ signal }, 'shutdown complete');
          process.exit(0);
        });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error: unknown) => {
  logger.fatal({ err: error }, 'skillsetu-api failed to start');
  process.exit(1);
});