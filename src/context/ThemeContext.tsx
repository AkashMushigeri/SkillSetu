'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'skillsetu_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Sync theme with DOM and localStorage
  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (e) {
        /* ignore localStorage quota/privacy errors */
      }
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
        document.body?.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        document.body?.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  // Hydrate theme from localStorage on initial client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        applyTheme(stored);
      } else {
        const hasDarkClass = document.documentElement.classList.contains('dark');
        applyTheme(hasDarkClass ? 'dark' : 'light');
      }
    } catch (e) {
      applyTheme('light');
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const isCurrentlyDark =
        typeof document !== 'undefined'
          ? document.documentElement.classList.contains('dark') || currentTheme === 'dark'
          : currentTheme === 'dark';
      const nextTheme: Theme = isCurrentlyDark ? 'light' : 'dark';

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch (e) {}

        const root = document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          document.body?.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          document.body?.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }

      return nextTheme;
    });
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
