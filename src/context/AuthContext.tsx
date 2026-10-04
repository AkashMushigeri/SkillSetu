'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutFirebase,
  getUserRole,
  onAuthChange,
  saveUserRole,
  clearUserRole,
  checkGoogleRedirect,
  saveUserProfile,
  getUserProfile,
  isNetworkError,
  UserRole,
  ExtendedUser,
  UserProfileData,
  sendPasswordReset as sendPasswordResetFirebase,
} from '@/lib/firebase';
import { registerWithBackend } from '@/lib/backendApi';

interface AuthContextType {
  user: ExtendedUser | null;
  role: UserRole | null;
  userProfile: UserProfileData | null;
  loading: boolean;
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
  completeOnboarding: (details: Partial<UserProfileData>) => Promise<void>;
  refreshUserProfile: () => Promise<UserProfileData | null>;
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
  const [role, setRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load and sync user profile from Firebase Firestore
  const syncProfile = useCallback(
    async (authUser: ExtendedUser, preferredRole?: UserRole) => {
      try {
        let profile = await getUserProfile(authUser.uid);
        const effectiveRole = preferredRole || profile?.role || getUserRole(authUser) || 'STUDENT';

        if (!profile) {
          // Initialize pending user profile in Firebase database
          profile = await saveUserProfile(authUser.uid, {
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName || 'New User',
            role: effectiveRole,
            phone: authUser.phoneNumber || '',
            photoURL: authUser.photoURL || '',
            onboardingCompleted: false,
          });
        }

        setUserProfile(profile);
        setRole(profile.role || effectiveRole);
        saveUserRole(profile.role || effectiveRole);

        return profile;
      } catch (err) {
        console.error('Error syncing user profile from Firestore:', err);
        return null;
      }
    },
    []
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
          const profile = await syncProfile(redirectUser);
          if (isMounted) {
            setLoading(false);
            if (!profile?.onboardingCompleted) {
              router.push('/onboarding');
            } else {
              router.push(getDashboardRoute(profile.role));
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
  }, [router, syncProfile]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const profile = await syncProfile(u);
        if (profile) {
          setUserProfile(profile);
          setRole(profile.role);
        }
      } else {
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, [syncProfile]);

  const refreshUserProfile = useCallback(async () => {
    if (!user) return null;
    const profile = await getUserProfile(user.uid);
    if (profile) {
      setUserProfile(profile);
      setRole(profile.role);
    }
    return profile;
  }, [user]);

  const signInWithGoogleFn = useCallback(async () => {
    const u = await signInWithGoogle();
    if (u && u.uid) {
      setUser(u);
      const profile = await syncProfile(u);
      if (!profile || !profile.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push(getDashboardRoute(profile.role));
      }
    }
  }, [router, syncProfile]);

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
        const profile = await saveUserProfile(u.uid, {
          uid: u.uid,
          email: u.email || '',
          displayName: displayName || u.displayName || 'New User',
          role: selectedRole,
          phone: phone || '',
          college: college || '',
          onboardingCompleted: false,
        });
        setUserProfile(profile);
        setRole(selectedRole);
        saveUserRole(selectedRole);
        void registerWithBackend(u, {
          role: selectedRole,
          displayName: displayName || u.displayName || undefined,
          phone,
          organization: { name: college, code: organizationCode },
        });
        router.push('/onboarding');
      }
    },
    [router]
  );

  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      // A network failure is surfaced as a failure. The previous behaviour minted a
      // `demo_*` session on unreachable-network errors, which handed the UI a
      // privileged-looking role that the backend knew nothing about.
      const u = await signInWithEmail(email, password);
      setUser(u);
      const profile = await syncProfile(u);
      if (!profile || !profile.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push(getDashboardRoute(profile.role));
      }
    },
    [router, syncProfile]
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
      const profile = await saveUserProfile(u.uid, {
        uid: u.uid,
        email,
        displayName,
        role: selectedRole,
        phone: phone || '',
        college: college || '',
        onboardingCompleted: false,
      });
      setUserProfile(profile);
      setRole(selectedRole);
      saveUserRole(selectedRole);
      // Deliberately not awaited: this writes the PostgreSQL `users` row that
      // authorization depends on, but a Firebase account must still be created
      // when the backend is slow or down.
      void registerWithBackend(u, {
        role: selectedRole,
        displayName,
        phone,
        organization: { name: college, code: organizationCode },
      });
      router.push('/onboarding');
    },
    [router]
  );

  const completeOnboarding = useCallback(
    async (details: Partial<UserProfileData>) => {
      if (!user) throw new Error('No user is currently signed in');
      const updated = await saveUserProfile(user.uid, {
        ...details,
        onboardingCompleted: true,
      });
      setUserProfile(updated);
      setRole(updated.role);
      saveUserRole(updated.role);

      // Route to destination dashboard
      router.push(getDashboardRoute(updated.role));
    },
    [user, router]
  );

  const signOut = useCallback(async () => {
    await signOutFirebase();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillsetu_student_profile');
      localStorage.removeItem('skillsetu_student_skills');
      localStorage.removeItem('skillsetu_applications');
      localStorage.removeItem('skillsetu_saved_opps');
      localStorage.removeItem('skillsetu_notifications');
    }
    setUser(null);
    setRole(null);
    setUserProfile(null);
    clearUserRole();
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
        userProfile,
        loading,
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

