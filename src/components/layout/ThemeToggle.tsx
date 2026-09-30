'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Until mounted, default to light theme representation to avoid SSR hydration mismatches
  const isDark = isMounted && theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${className}`}
      title={label}
      aria-label={label}
    >
      <div className="w-5 h-5 flex items-center justify-center transition-transform duration-200 hover:scale-110">
        {isDark ? (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 fill-teal-400/20" />
        ) : (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500/20" />
        )}
      </div>
    </button>
  );
};
