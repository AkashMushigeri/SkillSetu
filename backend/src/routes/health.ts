import { Router } from 'express';
import type { Pool } from 'pg';
import { logger } from '../lib/logger';

const DATABASE_CHECK_TIMEOUT_MS = 3_000;

export type HealthStatus = {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
  firebase: 'initialized' | 'not_initialized';
  uptimeSeconds: number;
};

export type FirebaseState = () => HealthStatus['firebase'];

async function pingDatabase(pool: Pool): Promise<HealthStatus['database']> {
  let timer: NodeJS.Timeout | undefined;

  try {
    const deadline = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(
        () => reject(new Error(`database check exceeded ${DATABASE_CHECK_TIMEOUT_MS}ms`)),
        DATABASE_CHECK_TIMEOUT_MS,
      );
    });

    await Promise.race([pool.query('SELECT 1'), deadline]);
    return 'up';
  } catch (error) {
    // Logged rather than swallowed: a silent catch here hid a pooler connection
    // failure behind a bare "degraded" response and made it undiagnosable.
    logger.warn({ err: error }, 'health: database check failed');
    return 'down';
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

export function createHealthRouter(pool: Pool, firebaseState: FirebaseState): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    void (async () => {
      const database = await pingDatabase(pool);
      const body: HealthStatus = {
        status: database === 'up' ? 'ok' : 'degraded',
        database,
        firebase: firebaseState(),
        uptimeSeconds: Math.round(process.uptime()),
      };

      res.status(database === 'up' ? 200 : 503).json(body);
    })();
  });

  return router;
}