'use client';

/**
 * Session-aware root.
 *
 * The previous unconditional `redirect('/login')` dropped a
 * returning student at the sign-in form instead of their
 * dashboard. The root now follows the session like every other
 * route does: a ready user lands on their portal, and every
 * other state continues the flow the app already uses for it
 * (the onboarding flow, matching `OnboardingGuard`).
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/context/AuthContext';
import { toUserRole } from '@/lib/session';

export default function RootPage() {
  const router = useRouter();
  const { user, identity, loading, session } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user || session.phase === 'signed-out') {
      router.replace('/login');
      return;
    }

    if (session.phase === 'ready' && identity?.onboardingCompleted) {
      router.replace(getDashboardRoute(toUserRole(identity.role)));
      return;
    }

    // Row still being created, onboarding unfinished, or awaiting
    // approval: continue on the onboarding flow.
    router.replace('/onboarding');
  }, [loading, user, identity, session, router]);

  return null;
}
