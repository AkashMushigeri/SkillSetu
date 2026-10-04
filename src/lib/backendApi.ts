'use client';

/**
 * Client for the SkillSetu Express/Neon backend (`backend/`).
 *
 * Signup creates the Firebase Auth identity only. The PostgreSQL `users` row —
 * the record that authorization actually reads — is written by
 * `POST /api/auth/register` on this backend. This module is the missing link.
 *
 * Every call here is best-effort by design: a Firebase account must never fail
 * to be created because Neon or Render is slow or down. Failures are reported
 * through the return value and `console.warn`, never thrown.
 */

import type { User } from 'firebase/auth';
import type { UserRole } from '@/lib/firebase';

/** Lowercase `user_role` enum in PostgreSQL; the frontend uses uppercase. */
const ROLE_TO_INTENT: Record<UserRole, 'student' | 'industry' | 'college'> = {
  STUDENT: 'student',
  INDUSTRY: 'industry',
  COLLEGE: 'college',
};

/** Organization snapshot columns accepted by the register route (`organizationSchema`). */
export interface RegistrationOrganization {
  name?: string;
  code?: string;
}

export interface RegistrationInput {
  role: UserRole;
  displayName?: string;
  phone?: string;
  organization?: RegistrationOrganization;
}

export type RegistrationOutcome =
  | { status: 'created'; id: string; role: string; userStatus: string }
  | { status: 'already-registered'; id: string; role: string; userStatus: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

/**
 * Render's free tier sleeps the service, so the first request after an idle
 * period pays a cold start. Generous, but bounded so a hung socket cannot leak.
 */
const REGISTER_TIMEOUT_MS = 30_000;

/** `undefined`/blank means "backend not configured" — e.g. local dev with no .env. */
export function backendBaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/+$/, '');
}

/**
 * Registers the signed-in Firebase user in the backend's `users` table.
 *
 * Safe to call without awaiting: it is idempotent on `firebase_uid`, so a retry
 * after a timeout returns `already-registered` instead of duplicating a row.
 */
export async function registerWithBackend(
  user: User,
  input: RegistrationInput
): Promise<RegistrationOutcome> {
  const base = backendBaseUrl();
  if (!base) {
    return { status: 'skipped', reason: 'NEXT_PUBLIC_API_URL is not set' };
  }

  const intentRole = ROLE_TO_INTENT[input.role];
  if (!intentRole) {
    return { status: 'skipped', reason: `unmapped role: ${input.role}` };
  }

  let token: string;
  try {
    token = await user.getIdToken();
  } catch (e) {
    const reason = e instanceof Error ? e.message : 'could not obtain an ID token';
    console.warn(`[backend] registration skipped: ${reason}`);
    return { status: 'skipped', reason };
  }

  // Only send `organization` when there is something to send: the register
  // schema is `.strict()` and rejects unknown or empty shapes for students.
  const organization =
    intentRole === 'student'
      ? undefined
      : {
          ...(input.organization?.name?.trim()
            ? { name: input.organization.name.trim() }
            : {}),
          ...(input.organization?.code?.trim()
            ? { code: input.organization.code.trim() }
            : {}),
        };

  const body: Record<string, unknown> = { intentRole };
  if (input.displayName?.trim()) body.displayName = input.displayName.trim();
  if (input.phone?.trim()) body.phone = input.phone.trim();
  if (organization && Object.keys(organization).length > 0) body.organization = organization;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REGISTER_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      // A non-JSON body (proxy/gateway error page) is handled by the status check.
    }

    if (res.ok) {
      // `identityPayload()` is returned flat and camelCase, alongside
      // `alreadyRegistered` and `requestId`.
      const id = String(payload.userId ?? '');
      const role = String(payload.role ?? intentRole);
      const userStatus = String(payload.status ?? '');
      console.info(
        `[backend] registered ${intentRole} ${id || '(no id)'} role=${role} status=${userStatus}`
      );
      return payload.alreadyRegistered
        ? { status: 'already-registered', id, role, userStatus }
        : { status: 'created', id, role, userStatus };
    }

    const code = String(payload.code ?? `http_${res.status}`);
    const reason = `${code}: ${String(payload.error ?? text ?? res.statusText)}`;
    console.warn(`[backend] registration rejected (${res.status}) ${reason}`);
    return { status: 'failed', reason };
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    const reason = aborted
      ? `timed out after ${REGISTER_TIMEOUT_MS}ms`
      : e instanceof Error
        ? e.message
        : 'network error';
    console.warn(`[backend] registration failed: ${reason}`);
    return { status: 'failed', reason };
  } finally {
    clearTimeout(timer);
  }
}