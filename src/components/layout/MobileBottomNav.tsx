'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Compass, Award, Bookmark, User } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { savedOpportunityIds } = useStudent();

  const navItems = [
    { name: 'Home', href: '/student', icon: GraduationCap },
    { name: 'Explore', href: '/student/opportunities', icon: Compass },
    { name: 'Skills', href: '/student/skills', icon: Award },
    { name: 'Saved', href: '/student/saved', icon: Bookmark, badge: savedOpportunityIds.length },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/student') {
      return pathname === '/student' || pathname === '/student/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg no-print">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl relative transition-all ${
                active ? 'text-brand-teal font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-1 -right-2 bg-brand-orange text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
