import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
