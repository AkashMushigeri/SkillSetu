'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isMounted } = useTheme();

  // In SSR / pre-mount, default to light mode to avoid hydration mismatch
  const isDark = isMounted ? theme === 'dark' : false;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/90 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer select-none active:scale-90 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${className}`}
      title={label}
      aria-label={label}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (Visible in Light Mode, rotates out & scales down when dark) */}
        <Sun
          className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500/20 absolute inset-0 m-auto transition-all duration-300 ease-in-out transform ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 pointer-events-none'
              : 'rotate-0 scale-100 opacity-100'
          }`}
          aria-hidden="true"
        />

        {/* Moon Icon (Visible in Dark Mode, rotates in & scales up when dark) */}
        <Moon
          className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-400 fill-teal-400/20 absolute inset-0 m-auto transition-all duration-300 ease-in-out transform ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0 pointer-events-none'
          }`}
          aria-hidden="true"
        />
      </div>
    </button>
  );
};
