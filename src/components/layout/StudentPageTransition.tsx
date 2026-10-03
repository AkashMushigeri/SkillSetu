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

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.willChange = 'auto';
    }
  };

  return (
    <div
      key={pathname}
      onAnimationEnd={handleAnimationEnd}
      className="student-page-transition w-full flex-1 min-w-0"
    >
      {children}
    </div>
  );
};
