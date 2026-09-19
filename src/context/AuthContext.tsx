'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
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
  UserRole,
  ExtendedUser,
} from '@/lib/firebase';

interface AuthContextType {
  user: ExtendedUser | null;
  role: UserRole | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    phone?: string,
    college?: string
  ) => Promise<void>;
  signUpWithGoogle: (role: UserRole, displayName: string, phone?: string, college?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDashboardRoute = (userRole: UserRole | null) => {
  if (userRole === 'STUDENT') return '/student';
  if (userRole === 'INDUSTRY') return '/industry/dashboard';
  if (userRole === 'COLLEGE') return '/college/dashboard';
  return '/login';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkRedirect = async () => {
      if (!auth || typeof window === 'undefined') return;
      try {
        const redirectUser = await checkGoogleRedirect();
        if (!isMounted) return;
        if (redirectUser) {
          const storedRole = getUserRole(redirectUser);
          setUser(redirectUser);
          setRole(storedRole);
          setLoading(false);
          router.push(getDashboardRoute(storedRole));
        }
      } catch (e) {
        console.error('Redirect auth error:', e);
        if (isMounted) setLoading(false);
      }
    };

    checkRedirect();
  }, [router]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      if (u) {
        const storedRole = getUserRole(u);
        setRole(storedRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  const signInWithGoogleFn = useCallback(async () => {
    const u = await signInWithGoogle();
    if (u && u.uid) {
      setUser(u);
      const storedRole = getUserRole(u);
      setRole(storedRole);
      router.push(getDashboardRoute(storedRole));
    }
  }, [router]);

  const signUpWithGoogle = useCallback(
    async (selectedRole: UserRole, displayName: string, phone?: string, college?: string) => {
      const u = await signInWithGoogle();
      if (u && u.uid) {
        setUser(u);
        saveUserRole(selectedRole);
        setRole(selectedRole);
        router.push(getDashboardRoute(selectedRole));
      }
    },
    [router]
  );

  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      const u = await signInWithEmail(email, password);
      setUser(u);
      const storedRole = getUserRole(u);
      setRole(storedRole);
      router.push(getDashboardRoute(storedRole));
    },
    [router]
  );

  const signUpWithEmailPassword = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      selectedRole: UserRole,
      phone?: string,
      college?: string
    ) => {
      const u = await signUpWithEmail(email, password, displayName);
      setUser(u);
      saveUserRole(selectedRole);
      setRole(selectedRole);
      router.push(getDashboardRoute(selectedRole));
    },
    [router]
  );

  const signOut = useCallback(async () => {
    await signOutFirebase();
    setUser(null);
    setRole(null);
    clearUserRole();
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        signInWithGoogle: signInWithGoogleFn,
        signInWithEmailPassword,
        signUpWithEmailPassword,
        signUpWithGoogle,
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
