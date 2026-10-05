'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface StudentPageTransitionProps {
  children: React.ReactNode;
}

export const StudentPageTransition: React.FC<StudentPageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // When navigating to a new route, reset the scroll position to top immediately
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (typeof window !== 'undefined' && !window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, [pathname]);

  // The layer hint is dropped from CSS rather than cleared here on
  // `animationend`: on a hard load the 180ms animation finishes before React
  // hydrates, so that event is missed and the hint would persist all session.
  return (
    <div key={pathname} className="student-page-transition w-full flex-1 min-w-0">
      {children}
    </div>
  );
};
