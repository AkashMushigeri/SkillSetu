'use client';

/**
 * Application identity and profile state, resolved from Neon PostgreSQL.
 *
 * The authority change in this file is the point of the exercise. Role used to
 * be read from two places that could disagree:
 *
 *   - `getUserRole(authUser)`, which read the `skillsetu_user_role` localStorage
 *     entry written at sign-up, and
 *   - `userProfile.role` from the Firestore `users/{uid}` document.
 *
 * Routing, page guards and every portal shell read the localStorage/Firestore
 * copy, while the Express backend authorized on the PostgreSQL `users` row. So
 * clearing a browser, or a stale value surviving a role change, produced a UI
 * that showed a portal the API would then reject. Role now comes only from
 * `/api/auth/me`, which resolves the Firebase UID to a `users` row on every
 * request, so the UI cannot render a role the API has not agreed to.
 *
 * What is intentionally still legacy: `userProfile` is assembled from the
 * Firestore-compatible helpers, because the three portal contexts have not been
 * migrated yet. `userProfile.role` is no longer consulted anywhere in this file —
 * the `role` value exposed on the context comes from PostgreSQL. Once the portal
 * contexts move to `domainApi`, `userProfile` disappears from this provider.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { flushSync } from 'react-dom';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutFirebase,
  onAuthChange,
  checkGoogleRedirect,
  UserRole,
  ExtendedUser,
  sendPasswordReset as sendPasswordResetFirebase,
} from '@/lib/firebase';
import { registerWithBackend } from '@/lib/backendApi';
import { api, ApiError } from '@/lib/apiClient';
import {
  identity as identityApi,
  studentProfile as studentProfileApi,
  collegeProfile as collegeProfileApi,
  companyProfile as companyProfileApi,
  type Identity,
} from '@/lib/domainApi';
import { resolveSession, toUserRole, type SessionState } from '@/lib/session';

interface AuthContextType {
  user: ExtendedUser | null;
  /** From the PostgreSQL `users` row. `null` until the backend confirms it. */
  role: UserRole | null;
  loading: boolean;
  /** Full backend identity, or `null`. Prefer this over assembling role facts. */
  identity: Identity | null;
  /** Where the sign-in stands: unregistered, awaiting approval, suspended, ready. */
  session: SessionState;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    phone?: string,
    college?: string,
    organizationCode?: string
  ) => Promise<void>;
  signUpWithGoogle: (
    role: UserRole,
    displayName?: string,
    phone?: string,
    college?: string,
    organizationCode?: string
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeOnboarding: (details: Record<string, unknown>) => Promise<void>;
  refreshUserProfile: () => Promise<Record<string, unknown> | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getDashboardRoute = (userRole: UserRole | null) => {
  if (userRole === 'STUDENT') return '/student';
  if (userRole === 'INDUSTRY') return '/industry/dashboard';
  if (userRole === 'COLLEGE') return '/college/dashboard';
  return '/login';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionState>({
    phase: 'signed-out',
  });

  const role = identity ? toUserRole(identity.role) : null;

  /**
   * Ask the backend who this Firebase user is.
   *
   * A 403 `registration_required` is not an error state — it is the normal
   * window between `signUpWithEmail` returning and the fire-and-forget
   * `POST /api/auth/register` landing, so it resolves to `unregistered` instead
   * of being thrown. Anything else propagates, because silently degrading to a
   * default role here is exactly the failure this file exists to prevent.
   */
  const loadIdentity = useCallback(async (u: ExtendedUser) => {
    api.setUser(u);
    try {
      return await identityApi.me();
    } catch (err) {
      if (err instanceof ApiError && err.isRegistrationRequired) {
        return null;
      }
      throw err;
    }
  }, []);

/**
   * Ask the backend who this Firebase user is.
   *
   * A 403 `registration_required` is not an error state — it is the normal
   * window between `signUpWithEmail` returning and the fire-and-forget
   * `POST /api/auth/register` landing, so it resolves to `unregistered` instead
   * of being thrown. Anything else propagates, because silently degrading to a
   * default role here is exactly the failure this file exists to prevent.
   */
  const syncSession = useCallback(
    async (authUser: ExtendedUser) => {
      const resolved = await loadIdentity(authUser);

      flushSync(() => {
        setIdentity(resolved);
        setSession(resolveSession(authUser.uid, resolved));
      });

      return { identity: resolved };
    },
    [loadIdentity]
  );

  useEffect(() => {
    let isMounted = true;

    const checkRedirect = async () => {
      if (!auth || typeof window === 'undefined') return;
      try {
        const redirectUser = await checkGoogleRedirect();
        if (!isMounted) return;
        if (redirectUser && redirectUser.uid) {
          setUser(redirectUser);
          const { identity: resolved } = await syncSession(redirectUser);
          if (isMounted) {
            setLoading(false);
            if (!resolved?.onboardingCompleted) {
              router.push('/onboarding');
            } else {
              router.push(getDashboardRoute(toUserRole(resolved?.role ?? 'student')));
            }
          }
        }
      } catch (e) {
        console.error('Redirect auth error:', e);
        if (isMounted) setLoading(false);
      }
    };

    checkRedirect();
    return () => {
      isMounted = false;
    };
  }, [router, syncSession]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        await syncSession(u);
      } else {
        // Drop the API's token source before anything can issue a request as
        // the previous user.
        api.setUser(null);
        setIdentity(null);
        setSession({ phase: 'signed-out' });
      }
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, [syncSession]);

  const refreshUserProfile = useCallback(async () => {
    if (!user) return null;

    // Re-read identity so a profile edited on another device shows up here too.
    try {
      const resolved = await loadIdentity(user);
      setIdentity(resolved);
      setSession(resolveSession(user.uid, resolved));
    } catch (err) {
      console.error('Error refreshing identity:', err);
    }

    // Fetch role-specific profile from backend
    const role = identity?.role || 'student';
    let profileData: Record<string, unknown> | null = null;

    if (role === 'student') {
      try {
        const res = await studentProfileApi.get();
        profileData = res.profile ?? null;
      } catch (e) {
        console.warn('Could not refresh student profile:', e);
      }
    } else if (role === 'industry') {
      try {
        const res = await companyProfileApi.get();
        profileData = res.company ?? null;
      } catch (e) {
        console.warn('Could not refresh company profile:', e);
      }
    } else if (role === 'college') {
      try {
        const res = await collegeProfileApi.get();
        profileData = res.college ?? null;
      } catch (e) {
        console.warn('Could not refresh college profile:', e);
      }
    }

    return profileData;
  }, [user, loadIdentity]);

  const signInWithGoogleFn = useCallback(async () => {
    const u = await signInWithGoogle();
    if (u && u.uid) {
      setUser(u);
      const { identity: resolved } = await syncSession(u);
      if (!resolved?.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push(getDashboardRoute(toUserRole(resolved?.role ?? 'student')));
      }
    }
  }, [router, syncSession]);

  const signUpWithGoogle = useCallback(
    async (
      selectedRole: UserRole,
      displayName?: string,
      phone?: string,
      college?: string,
      organizationCode?: string
    ) => {
      const u = await signInWithGoogle();
      if (u && u.uid) {
        setUser(u);
        // Fire-and-forget registration: the Firebase account exists the moment
        // `signInWithGoogle` resolves, and blocking on the backend would leave
        // the user stranded on a spinner if Neon is slow or unreachable. The
        // onboarding screen reads through `/api/auth/me`, which reports
        // `registration_required` until the row lands.
        void registerWithBackend(u, {
          role: selectedRole,
          displayName: displayName || u.displayName || undefined,
          phone,
          organization: { name: college, code: organizationCode },
        });

        // `registerWithBackend` is async, so re-read the identity after a short
        // wait rather than assuming the row exists yet.
        await syncSession(u);
        router.push('/onboarding');
      }
    },
    [router, syncSession]
  );

  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      // A network failure is surfaced as a failure. The previous behaviour minted a
      // `demo_*` session on unreachable-network errors, which handed the UI a
      // privileged-looking role that the backend knew nothing about.
      const u = await signInWithEmail(email, password);
      setUser(u);
      const { identity: resolved } = await syncSession(u);
      if (!resolved?.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push(getDashboardRoute(toUserRole(resolved?.role ?? 'student')));
      }
    },
    [router, syncSession]
  );

  const signUpWithEmailPassword = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      selectedRole: UserRole,
      phone?: string,
      college?: string,
      organizationCode?: string
    ) => {
      // A network failure is surfaced as a failure. The previous behaviour minted an
      // `offline_*` session with a client-chosen role whenever the signup request
      // could not reach the network.
      const u = await signUpWithEmail(email, password, displayName);
      setUser(u);
      // Deliberately not awaited: this writes the PostgreSQL `users` row that
      // authorization depends on, but a Firebase account must still be created
      // when the backend is slow or down.
      void registerWithBackend(u, {
        role: selectedRole,
        displayName,
        phone,
        organization: { name: college, code: organizationCode },
      });

      await syncSession(u);
      router.push('/onboarding');
    },
    [router, syncSession]
  );

  const completeOnboarding = useCallback(
    async (details: Record<string, unknown>) => {
      if (!user) throw new Error('No user is currently signed in');

      const role = identity?.role || 'student';

      // Account-owned fields go to the `users` table.
      const accountPatch: Parameters<typeof identityApi.update>[0] = {};
      if (details.phone !== undefined) accountPatch.phone = (details.phone as string) || null;
      if (details.displayName !== undefined) {
        accountPatch.displayName = (details.displayName as string) || null;
      }
      if (details.recruiterTitle !== undefined) {
        accountPatch.title = (details.recruiterTitle as string) || null;
      } else if (details.designation !== undefined) {
        accountPatch.title = (details.designation as string) || null;
      }
      accountPatch.onboardingCompleted = true;

      // Write role-specific profile data to the appropriate backend.
      const profilePromises: Promise<unknown>[] = [];

      if (role === 'student') {
        profilePromises.push(
          studentProfileApi.update({
            displayName: details.displayName as string | null,
            phone: details.phone as string | null,
            usn: details.usn as string | null,
            degree: details.degree as string | null,
            department: details.department as string | null,
            academicYear: details.year as string | null,
            cgpa: details.gpa ? parseFloat(details.gpa as string) : null,
            careerGoal: details.careerGoal as string | null,
            bio: details.bio as string | null,
            githubUrl: details.github as string | null,
            linkedinUrl: details.linkedin as string | null,
            location: details.location as string | null,
            city: (details.locationDetails as Record<string, unknown> | undefined)?.city as string | null,
            state: (details.locationDetails as Record<string, unknown> | undefined)?.state as string | null,
            country: (details.locationDetails as Record<string, unknown> | undefined)?.country as string | null,
            latitude: (details.locationDetails as Record<string, unknown> | undefined)?.latitude as number | null,
            longitude: (details.locationDetails as Record<string, unknown> | undefined)?.longitude as number | null,
          }),
        );
      } else if (role === 'industry') {
        profilePromises.push(
          companyProfileApi.update({
            displayName: details.recruiterTitle as string | null,
            title: details.recruiterTitle as string | null,
            // Full company profile update would need additional endpoint
          }),
        );
      } else if (role === 'college') {
        profilePromises.push(
          collegeProfileApi.update({
            institutionName: details.institutionName as string | null,
            collegeCode: details.collegeCode as string | null,
            designation: details.designation as string | null,
            institutionLocation: details.institutionLocation as string | null,
            institutionWebsite: details.institutionWebsite as string | null,
            departments: details.departments as string[] | null,
            totalStudents: details.totalStudents ? parseInt(details.totalStudents as string, 10) : null,
            naacGrade: details.naacGrade as string | null,
          }),
        );
      }

      const [updatedIdentity] = await Promise.all([
        identityApi.update(accountPatch),
        ...profilePromises,
      ]);

      flushSync(() => {
        setIdentity(updatedIdentity);
        setSession(resolveSession(user.uid, updatedIdentity));
      });

      router.push(getDashboardRoute(toUserRole(updatedIdentity.role)));
    },
    [user, router, identity],
  );

  const signOut = useCallback(async () => {
    await signOutFirebase();
    api.setUser(null);
    setUser(null);
    setIdentity(null);
    setSession({ phase: 'signed-out' });
    router.push('/login');
  }, [router]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetFirebase(email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        identity,
        session,
        signInWithGoogle: signInWithGoogleFn,
        signInWithEmailPassword,
        signUpWithEmailPassword,
        signUpWithGoogle,
        sendPasswordReset,
        completeOnboarding,
        refreshUserProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};