'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Sparkles,
  LayoutDashboard,
  Search,
  BookmarkCheck,
  Briefcase,
  GraduationCap,
  FileSpreadsheet,
  KanbanSquare,
  CalendarCheck,
  Trophy,
  School,
  BarChart3,
  Building2,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const IndustrySidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { company, showToast } = useIndustry();

  const navGroups = [
    {
      title: 'Talent Acquisition',
      items: [
        { href: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/industry/candidates', label: 'Find Talent', icon: Search, badge: 'Skills' },
        { href: '/industry/talent-pool', label: 'Talent Pool', icon: BookmarkCheck },
        { href: '/industry/jobs', label: 'Jobs', icon: Briefcase },
        { href: '/industry/internships', label: 'Internships', icon: GraduationCap, badge: 'Startup' },
      ],
    },
    {
      title: 'Hiring Workflow',
      items: [
        { href: '/industry/applications', label: 'Applications', icon: FileSpreadsheet },
        { href: '/industry/pipeline', label: 'Hiring Pipeline', icon: KanbanSquare, badge: 'Kanban' },
        { href: '/industry/interviews', label: 'Interviews', icon: CalendarCheck },
        { href: '/industry/offers', label: 'Offers & Letters', icon: FileCheck, badge: 'New' },
      ],
    },
    {
      title: 'Academia & Intelligence',
      items: [
        { href: '/industry/challenges', label: 'Challenges', icon: Trophy },
        { href: '/industry/colleges', label: 'Colleges', icon: School, badge: '14' },
        { href: '/industry/colleges/mou', label: 'MoU & Curriculum', icon: FileText, badge: 'AICTE' },
        { href: '/industry/analytics', label: 'Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Organization',
      items: [
        { href: '/industry/profile', label: 'Company Profile', icon: Building2 },
        { href: '/industry/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = () => {
    showToast('Logged out of Industry Portal', 'info');
    router.push('/industry/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/industry/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Skill<span className="text-emerald-400">Setu</span>
              </div>
              <div className="text-[9px] tracking-widest uppercase font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Industry Portal
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/industry/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-emerald-500/30 text-emerald-200'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Company Card & Logout */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          <Link
            href="/industry/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              TN
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-white truncate">{company.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{company.recruiter.name} &bull; HR</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/30 hover:border-rose-800/50 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
