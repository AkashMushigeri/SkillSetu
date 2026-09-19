/**
 * syncBridge.ts
 * ------------------------------------------------------------------
 * Neutral cross-sector synchronization layer for SkillSetu.
 *
 * The three sector portals (Student, Industry, College) each run in
 * their own React tree with their own Context provider and their own
 * localStorage namespace. This bridge gives them a *shared, versioned*
 * message bus so that actions taken in one portal can be applied to
 * the others — without any of the providers importing each other
 * (which would create circular dependencies and mounting issues).
 *
 * Design principles (safety-first):
 *  - Pure functions, no React, no provider imports.
 *  - All reads are defensive: corrupted / missing / stale data is
 *    never fatal — it is silently ignored.
 *  - All writes are namespaced under `skillsetu_sync_*` so they never
 *    collide with each sector's own localStorage keys.
 *  - Two broadcast mechanisms:
 *      1. `window` `storage` event  -> cross-tab (different portals
 *         open in different tabs).
 *      2. Custom `skillsetu:sync` event -> same-tab + cross-context
 *         (e.g., bridging from /student to /college within one tab is
 *         not possible since providers are in separate route trees,
 *         but this keeps the system future-proof and is harmless).
 * ------------------------------------------------------------------
 */

export const SYNC_NAMESPACE = 'skillsetu_sync';

// Domain keys (each entry is a JSON array of records)
export const SYNC_DOMAINS = {
  // Student -> Industry: applications submitted from the student portal
  STUDENT_APPLICATIONS: 'student_applications',
  // Industry -> Student: newly posted jobs/internships surfaced as opportunities
  INDUSTRY_JOBS: 'industry_jobs',
  INDUSTRY_INTERNSHIPS: 'industry_internships',
  // Industry -> Student: stage movements + interviews + offers
  APPLICATION_UPDATES: 'application_updates',
  OFFERS: 'offers',
  // College -> Industry: training enrollment / readiness signals
  COLLEGE_TRAINING: 'college_training',
  // Industry -> College: placements (accepted offers), new collab notices
  PLACEMENTS: 'placements',
  // Challenges surfaced to students (industry challenges as micro-internships)
  CHALLENGES: 'challenges',
  // Cross-sector notification feed keyed by recipient sector
  NOTIFICATIONS: 'notifications',
} as const;

export type SyncDomain = (typeof SYNC_DOMAINS)[keyof typeof SYNC_DOMAINS];

export interface SyncNotification {
  id: string;
  /** Which sector should display this notification. */
  target: 'student' | 'industry' | 'college';
  type: 'application' | 'shortlist' | 'offer' | 'interview' | 'challenge' | 'placement' | 'training' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  meta?: Record<string, string>;
}

interface SyncEnvelope<T = unknown> {
  /** Monotonic timestamp used for conflict resolution. */
  ts: number;
  /** Source sector. */
  from: 'student' | 'industry' | 'college' | 'system';
  /** Optional correlation id to update (rather than append) an existing record. */
  correlationId?: string;
  payload: T;
}

const STORAGE_PREFIX = `${SYNC_NAMESPACE}:`;

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Safe localStorage read. Returns null on any failure (no throws).
 */
function readRaw(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe localStorage write. Returns false on failure (quota, privacy mode, etc.)
 */
function writeRaw(key: string, value: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function domainKey(domain: SyncDomain): string {
  return `${STORAGE_PREFIX}${domain}`;
}

/**
 * Read all envelopes for a domain, newest first, flattened into payloads.
 * Never throws. Invalid entries are dropped.
 */
export function readSyncRecords<T = unknown>(domain: SyncDomain): T[] {
  const raw = readRaw(domainKey(domain));
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const results: T[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') continue;
      const env = entry as SyncEnvelope<T>;
      if (typeof env.ts !== 'number' || env.payload === undefined) continue;
      results.push(env.payload);
    }
    // newest first
    return results.sort((a, b) => {
      const ea = a as unknown as SyncEnvelope<T>;
      const eb = b as unknown as SyncEnvelope<T>;
      return (eb.ts ?? 0) - (ea.ts ?? 0);
    });
  } catch {
    return [];
  }
}

/**
 * Read a single record filtered by a predicate (e.g. latest update for a
 * correlation id). Returns undefined if not found. Never throws.
 */
export function readSyncRecordBy<T = unknown>(
  domain: SyncDomain,
  predicate: (record: T) => boolean
): T | undefined {
  return readSyncRecords<T>(domain).find(predicate);
}

/**
 * Append an envelope to a domain. If `correlationId` matches an existing
 * envelope, that envelope is updated in place (single "latest wins" record
 * per correlation), which keeps the feed tidy while still preserving
 * unrelated records.
 */
export function writeSyncRecord<T = unknown>(
  domain: SyncDomain,
  payload: T,
  opts?: { from?: SyncEnvelope['from']; correlationId?: string }
): boolean {
  const from = opts?.from ?? 'system';
  const correlationId = opts?.correlationId;

  const current = readDomainEnvelopes(domain);

  let next = current;
  if (correlationId) {
    const idx = next.findIndex((e) => e.correlationId === correlationId);
    if (idx >= 0) {
      next = [...next];
      next[idx] = { ts: Date.now(), from, correlationId, payload };
    } else {
      next = [...next, { ts: Date.now(), from, correlationId, payload }];
    }
  } else {
    next = [...next, { ts: Date.now(), from, payload }];
  }

  const ok = writeRaw(domainKey(domain), JSON.stringify(next));
  if (ok) broadcast();
  return ok;
}

/**
 * Remove records by predicate. Returns the number removed.
 */
export function clearSyncRecords(
  domain: SyncDomain,
  predicate: (payload: unknown) => boolean
): number {
  const current = readDomainEnvelopes(domain);
  const next = current.filter((e) => !predicate(e.payload));
  const removed = current.length - next.length;
  if (removed > 0) {
    writeRaw(domainKey(domain), JSON.stringify(next));
    broadcast();
  }
  return removed;
}

function readDomainEnvelopes(domain: SyncDomain): SyncEnvelope[] {
  const raw = readRaw(domainKey(domain));
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is SyncEnvelope =>
        !!e &&
        typeof e === 'object' &&
        typeof (e as SyncEnvelope).ts === 'number' &&
        (e as SyncEnvelope).payload !== undefined
    );
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Event bus                                                           */
/* ------------------------------------------------------------------ */

export const SYNC_EVENT = 'skillsetu:sync';
export const SYNC_STORAGE_KEY = `${SYNC_NAMESPACE}:lastChange`;

let lastBroadcast = 0;
const MIN_BROADCAST_INTERVAL = 50; // ms — coalesce rapid writes

function broadcast(): void {
  const now = Date.now();
  // Throttle: writes can happen in quick succession (e.g. batch publish).
  if (now - lastBroadcast < MIN_BROADCAST_INTERVAL) return;
  lastBroadcast = now;

  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SYNC_STORAGE_KEY, String(now));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { ts: now } }));
}

export type SyncListener = () => void;

/**
 * Subscribe to sync changes. Returns an unsubscribe function.
 * Fires on:
 *  - custom `skillsetu:sync` events (same tab)
 *  - `storage` events (cross-tab)
 */
export function subscribeToSync(listener: SyncListener): () => void {
  if (!isBrowser()) return () => {};
  const onSync = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key === SYNC_STORAGE_KEY) listener();
  };
  window.addEventListener(SYNC_EVENT, onSync);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SYNC_EVENT, onSync);
    window.removeEventListener('storage', onStorage);
  };
}

/* ------------------------------------------------------------------ */
/* Notifications feed                                                  */
/* ------------------------------------------------------------------ */

export function publishNotification(notification: SyncNotification): boolean {
  return writeSyncRecord<SyncNotification>(SYNC_DOMAINS.NOTIFICATIONS, notification, {
    from: notification.target === 'student' ? 'student' : notification.target === 'college' ? 'college' : 'industry',
    correlationId: notification.id,
  });
}

export function readNotificationsFor(target: SyncNotification['target']): SyncNotification[] {
  const all = readSyncRecords<SyncNotification>(SYNC_DOMAINS.NOTIFICATIONS);
  return all.filter((n) => n && typeof n === 'object' && n.target === target);
}

/** Remove consumed notifications (e.g. after they've been merged into a context). */
export function consumeNotification(id: string): void {
  clearSyncRecords(SYNC_DOMAINS.NOTIFICATIONS, (p) => {
    const n = p as SyncNotification;
    return !!n && typeof n === 'object' && n.id === id;
  });
}

/* ------------------------------------------------------------------ */
/* Generic merge helper                                                */
/* ------------------------------------------------------------------ */

/**
 * Merge inbound records into a local collection, deduping by `id`.
 * Inbound records win over local ones with the same id (they hold the
 * freshest cross-sector state). Existing local-only records are kept.
 */
export function mergeById<T extends { id: string }>(local: T[], inbound: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of local) map.set(item.id, item);
  for (const item of inbound) {
    if (item && typeof item === 'object' && typeof item.id === 'string') {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}