'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CollegeProvider } from '@/context/CollegeContext';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { CollegeNavbar } from '@/components/college/CollegeNavbar';
import { GlobalSearchModal } from '@/components/college/GlobalSearchModal';
import { Toast } from '@/components/college/Toast';

export default function CollegeRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/college/login';

  if (isLoginPage) {
    return (
      <CollegeProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
          {children}
          <Toast />
        </div>
      </CollegeProvider>
    );
  }

  return (
    <CollegeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-emerald-500 selection:text-white">
        {/* Sidebar */}
        <CollegeSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
          <CollegeNavbar
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; 2026 SKILLSETU &bull; AYUSH Career Bridge &bull; College Portal</span>
            <span>AYUSH Institute of Technology &bull; Bengaluru, Karnataka</span>
          </footer>
        </div>

        {/* Global Modals & Toast */}
        <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <Toast />
      </div>
    </CollegeProvider>
  );
}
