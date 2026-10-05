import type { Response } from 'express';
import { AppError } from './errors';

/**
 * Small helpers shared by the domain routers.
 *
 * These exist so every route reports the same requestId, the same envelope
 * shape, and the same parameter errors. Nothing here reads a role, a user id,
 * or a tenant id from the request: authorization comes from `req.user`, which
 * the auth middleware populated from the PostgreSQL users row.
 */

export function requestId(res: Response): string {
  return String(res.locals.requestId ?? '');
}

/**
 * Parses a `:id` path parameter as a UUID.
 *
 * A non-UUID is a 400, never a 404 or a 500: the caller sent a malformed id,
 * which is a different problem from "that record does not exist".
 */
export function readUuidParam(params: Record<string, string>, name = 'id'): string {
  const raw = params[name];

  if (typeof raw !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)) {
    throw AppError.badRequest(`${name} must be a UUID.`, 'invalid_id');
  }

  return raw.toLowerCase();
}

export type Pagination = { limit: number; offset: number };

/** Reads the validated query that `validateQuery` stashed on `res.locals`. */
export function readQuery<T>(res: Response): T {
  return res.locals.query as T;
}

/**
 * Maps a PostgreSQL unique-violation into a 409.
 *
 * Every domain insert that can legitimately collide (an application to the same
 * job twice, a saved job that already exists, a second enrollment) uses this so
 * the client gets an actionable conflict instead of a 500.
 */
export async function onConflict<T>(run: () => Promise<T>, message: string, code: string): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw AppError.conflict(message, code);
    }
    throw error;
  }
}

/**
 * Turns a foreign-key violation into a 422 rather than a 500.
 *
 * This is the case that matters most during the migration: the client still
 * holds Data Connect ids (`dc-<uuid>`, `opp-1`) and will send one as a jobId
 * before the frontend has been rewritten. Referencing a row that does not exist
 * in Neon is a bad request, not a server fault.
 */
export async function onMissingReference<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === '23503') {
      throw AppError.unprocessable(
        'A referenced record does not exist.',
        'referenced_record_not_found',
      );
    }
    if (code === '23514') {
      throw AppError.unprocessable(
        'The request violates a database constraint.',
        'constraint_violation',
      );
    }
    if (code === '23502') {
      throw AppError.badRequest('A required field was missing.', 'missing_field');
    }
    throw error;
  }
}

/**
 * Builds a URL-safe slug for tables that carry a unique slug column.
 *
 * A random suffix keeps two postings with the same title from colliding on
 * `jobs_slug_unique`, which would otherwise surface as an opaque 409. The caller
 * may supply a slug explicitly; when they do it is used verbatim so a slug can
 * be made stable and shareable.
 */
export function buildSlug(title: string, suffix: string, explicit?: string): string {
  if (explicit) {
    return explicit;
  }

  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

  const stem = base.length > 0 ? base : 'item';
  const tail = suffix.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 8);

  return tail.length > 0 ? `${stem}-${tail}` : stem;
}

/** Postgres returns bigint/numeric as strings; coerce for JSON consumers. */
export function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}