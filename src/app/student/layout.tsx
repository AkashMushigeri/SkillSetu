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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <StudentHeader />
        <main className="flex-1 pb-20 lg:pb-10">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </StudentProvider>
  );
}
