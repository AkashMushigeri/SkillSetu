import React from 'react';
import { StudentProvider } from '@/context/StudentContext';
import { StudentHeader } from '@/components/layout/StudentHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B131E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        <StudentHeader />
        <main className="flex-1 pb-20 lg:pb-10">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </StudentProvider>
  );
}
