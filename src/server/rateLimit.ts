/**
 * src/server/rateLimit.ts
 * ------------------------------------------------------------------
 * Rate limiting and Firebase App Check verification for AI routes.
 *
 * Provides:
 *  1. Shared Upstash Redis limits in production.
 *  2. In-memory limits for local development only.
 *  3. Firebase Admin App Check token verification.
 * ------------------------------------------------------------------
 */

export interface RateLimitResult {
  success: boolean;
  unavailable?: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

// In-memory sliding window cache: map from identifier to array of millisecond timestamps
const memoryRateLimitMap = new Map<string, number[]>();

// Cleanup stale keys every 5 minutes to avoid memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupMemoryStore(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  memoryRateLimitMap.forEach((timestamps, key) => {
    const valid = timestamps.filter((t: number) => now - t < windowMs);
    if (valid.length === 0) {
      memoryRateLimitMap.delete(key);
    } else {
      memoryRateLimitMap.set(key, valid);
    }
  });
}

/**
 * Rate limit check: uses Redis when configured and fails closed in production.
 *
 * @param identifier Unique key (e.g. IP address or client ID)
 * @param maxRequests Maximum allowed requests in window (default 10)
 * @param windowSec Window duration in seconds (default 60s)
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowSec: number = 60
): Promise<RateLimitResult> {
  const windowMs = windowSec * 1000;
  const now = Date.now();

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Shared Redis counter and expiry must execute atomically.
  if (upstashUrl && upstashToken) {
    try {
      const key = `ratelimit:ai_interview:${identifier}`;
      const res = await fetch(`${upstashUrl.replace(/\/$/, '')}/multi-exec`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSec, 'NX'],
          ['TTL', key],
        ]),
        signal: AbortSignal.timeout(5_000),
      });

      if (!res.ok) throw new Error(`Redis returned ${res.status}`);
      const results = await res.json();
      if (!Array.isArray(results) || results.length !== 3 || results.some((entry) => entry?.error)) {
        throw new Error('Redis transaction failed');
      }
      const currentCount = Number(results[0]?.result);
      const ttlSec = Number(results[2]?.result);
      if (!Number.isSafeInteger(currentCount) || currentCount < 1 ||
          !Number.isSafeInteger(ttlSec) || ttlSec < 0) {
        throw new Error('Redis returned an invalid counter or expiry');
      }

      const remaining = Math.max(0, maxRequests - currentCount);
      const resetMs = Math.max(1_000, ttlSec * 1000);

      return { success: currentCount <= maxRequests, limit: maxRequests, remaining, resetMs };
    } catch (err) {
      console.warn('[RateLimit] Shared Redis limiter unavailable:', err instanceof Error ? err.message : 'request failed');
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return { success: false, unavailable: true, limit: maxRequests, remaining: 0, resetMs: windowMs };
  }

  // 2. Sliding window in-memory limit for local development
  cleanupMemoryStore(windowMs);

  const timestamps = memoryRateLimitMap.get(identifier) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetMs,
    };
  }

  validTimestamps.push(now);
  memoryRateLimitMap.set(identifier, validTimestamps);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Extract client IP address from standard forwarding headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

/**
 * Verify Firebase App Check token on incoming API request.
 */
export async function verifyAppCheckHeader(req: Request): Promise<{
  isValid: boolean;
  reason?: string;
}> {
  const appCheckToken = req.headers.get('X-Firebase-AppCheck');
  const requireAppCheck = process.env.NODE_ENV === 'production' || process.env.REQUIRE_APP_CHECK === 'true';

  if (!appCheckToken) {
    if (requireAppCheck) {
      return {
        isValid: false,
        reason: 'Missing X-Firebase-AppCheck header in production mode',
      };
    }
    return { isValid: true };
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    if (!projectId) throw new Error('Firebase project ID is not configured');
    const [{ getApps, initializeApp }, { getAppCheck }] = await Promise.all([
      import('firebase-admin/app'),
      import('firebase-admin/app-check'),
    ]);
    const adminApp = getApps().find((app) => app.name === 'skillsetu-app-check')
      || initializeApp({ projectId }, 'skillsetu-app-check');
    await getAppCheck(adminApp).verifyToken(appCheckToken);
    return { isValid: true };
  } catch {
    return { isValid: false, reason: 'Invalid App Check token' };
  }
}
