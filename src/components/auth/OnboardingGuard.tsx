'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, identity, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // If authenticated user hasn't completed onboarding, prompt them to complete it
    if (user && identity && !identity.onboardingCompleted && pathname !== '/onboarding' && pathname !== '/login') {
      router.push('/onboarding');
    }
  }, [user, identity, loading, pathname, router]);

  return <>{children}</>;
};
