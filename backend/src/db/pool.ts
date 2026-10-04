import { Pool } from 'pg';

const POOL_MAX_CONNECTIONS = 5;
const CONNECTION_TIMEOUT_MS = 10_000;
const IDLE_TIMEOUT_MS = 30_000;
const QUERY_TIMEOUT_MS = 15_000;

export function createPool(connectionString: string): Pool {
  return new Pool({
    connectionString,
    max: POOL_MAX_CONNECTIONS,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
    // Deliberately client-side rather than a server startup parameter such as
    // `options: -c statement_timeout=...`. Neon's pooled endpoint rejects unknown
    // startup parameters with SQLSTATE 08P01, so a server-side setting makes every
    // pooled connection fail. This still bounds a runaway query.
    query_timeout: QUERY_TIMEOUT_MS,
  });
}

let sharedPool: Pool | undefined;

export function getPool(connectionString: string): Pool {
  if (!sharedPool) {
    sharedPool = createPool(connectionString);
  }
  return sharedPool;
}

export async function closePool(): Promise<void> {
  if (!sharedPool) {
    return;
  }
  const pool = sharedPool;
  sharedPool = undefined;
  await pool.end();
}