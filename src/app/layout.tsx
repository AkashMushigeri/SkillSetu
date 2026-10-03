import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'SkillSetu — AYUSH Career Bridge | Academia–Industry Collaboration',
  description: 'Intelligent portal for Academia–Industry collaboration for Skill Mapping, Internships, Micro-Internships, Tasks, and Career Placements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('skillsetu_theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#0b131e] text-slate-900 dark:text-slate-100 min-h-screen antialiased transition-colors duration-200">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <OnboardingGuard>{children}</OnboardingGuard>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
