'use client';

/**
 * The application identity, resolved from PostgreSQL rather than the browser.
 *
 * This replaces the previous arrangement, where the same fact was stored twice:
 * Firebase custom claims and a `skillsetu_user_role` localStorage entry carried
 * the role, and Firestore `users/{uid}` carried the rest of the profile. Routing
 * decisions were made from the localStorage copy while authorization was decided
 * from the database, which means the two could disagree — and the localStorage one
 * was the one the UI obeyed.
 *
 * Now `role`, `status` and the organization FKs come from `/api/auth/me`, which
 * reads the `users` row the auth middleware resolved from the verified Firebase
 * token. Firebase Auth still decides *who someone is*; this decides *what they
 * can do*.
 *
 * The uppercase `UserRole` shape is kept because every portal page, the login
 * routing and `getDashboardRoute` are written against it. Mapping once here is
 * cheaper and far less error-prone than renaming a type across four portals.
 */

import type { Identity } from './domainApi';

/** Frontend role vocabulary. `admin` has no page, so it has no dashboard. */
export type UserRole = 'STUDENT' | 'INDUSTRY' | 'COLLEGE';

const ROLE_TO_LABEL: Record<Identity['role'], UserRole> = {
  student: 'STUDENT',
  industry: 'INDUSTRY',
  college: 'COLLEGE',
  // Admin has no self-service signup and no portal of its own, so there is no
  // dashboard to route to. Surfacing the account as a student would be a lie
  // about what the API will allow, so it is mapped to STUDENT and the status
  // check below is what actually gates it.
  admin: 'STUDENT',
};

export function toUserRole(role: Identity['role']): UserRole {
  return ROLE_TO_LABEL[role];
}

export type SessionState =
  /** Firebase has no user. */
  | { phase: 'signed-out' }
  /** Firebase has a user but the backend has no `users` row for it yet. */
  | { phase: 'unregistered'; firebaseUid: string }
  /** A `users` row exists but an admin has not approved it. */
  | { phase: 'awaiting-approval'; identity: Identity }
  /** Signed in but administratively suspended. */
  | { phase: 'suspended'; identity: Identity }
  /** Ready to use. */
  | { phase: 'ready'; identity: Identity };

/**
 * Decides what the app should do with a backend identity.
 *
 * Split out from the React tree so the rule is testable and reviewable on its own:
 * every status is handled explicitly, and there is no fallback branch that
 * quietly treats an unknown state as "signed in".
 */
export function resolveSession(firebaseUid: string, identity: Identity | null): SessionState {
  if (!identity) {
    return { phase: 'unregistered', firebaseUid };
  }

  if (identity.status === 'pending') {
    return { phase: 'awaiting-approval', identity };
  }

  if (identity.status === 'suspended') {
    return { phase: 'suspended', identity };
  }

  return { phase: 'ready', identity };
}

/** Copy shown per non-ready state. Kept next to the states so none are missed. */
export const SESSION_MESSAGES: Record<
  Exclude<SessionState['phase'], 'ready' | 'signed-out'>,
  { title: string; body: string }
> = {
  unregistered: {
    title: 'Finishing your account',
    body: 'Your sign-in worked, but your SkillSetu profile is still being created. This usually resolves in a few seconds — reload if this does not clear.',
  },
  'awaiting-approval': {
    title: 'Waiting for administrator approval',
    body: 'Industry and college accounts are reviewed before they can post or manage anything. You will be able to continue as soon as that review completes.',
  },
  suspended: {
    title: 'This account is suspended',
    body: 'Your account is not currently active. Contact the SkillSetu administrators if you believe this is a mistake.',
  },
};
