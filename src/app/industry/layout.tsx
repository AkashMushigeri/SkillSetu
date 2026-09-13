'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { IndustryProvider } from '@/context/IndustryContext';
import { IndustrySidebar } from '@/components/industry/IndustrySidebar';
import { IndustryNavbar } from '@/components/industry/IndustryNavbar';
import { GlobalIndustrySearchModal } from '@/components/industry/GlobalIndustrySearchModal';
import { IndustryToast } from '@/components/industry/IndustryToast';

export default function IndustryRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/industry/login';

  if (isLoginPage) {
    return (
      <IndustryProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
          {children}
          <IndustryToast />
        </div>
      </IndustryProvider>
    );
  }

  return (
    <IndustryProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-emerald-500 selection:text-white">
        {/* Sidebar */}
        <IndustrySidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <IndustryNavbar
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>

          {/* Industry Footer */}
          <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; 2026 SKILLSETU &bull; AYUSH Career Bridge &bull; Industry Portal</span>
            <span>TechNova Labs &bull; Indiranagar, Bengaluru, Karnataka</span>
          </footer>
        </div>

        {/* Global Modals & Notifications */}
        <GlobalIndustrySearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <IndustryToast />
      </div>
    </IndustryProvider>
  );
}
