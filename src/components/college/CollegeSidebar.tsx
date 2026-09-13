'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCollege } from '@/context/CollegeContext';
import {
  LayoutDashboard,
  Users,
  Cpu,
  GraduationCap,
  BadgeCheck,
  BriefcaseBusiness,
  Trophy,
  Building2,
  Swords,
  Megaphone,
  BarChart3,
  FileSpreadsheet,
  Building,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const CollegeSidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, profile } = useCollege();
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', route: '/college/dashboard', icon: LayoutDashboard },
    { label: 'Student Management', route: '/college/students', icon: Users },
    { label: 'Skill Ecosystem', route: '/college/skills', icon: Cpu },
    { label: 'Training Programs', route: '/college/training', icon: GraduationCap },
    { label: 'Assessments', route: '/college/assessments', icon: BadgeCheck },
    { label: 'Internships', route: '/college/internships', icon: BriefcaseBusiness },
    { label: 'Placements', route: '/college/placements', icon: Trophy },
    { label: 'Industry Collaboration', route: '/college/industry', icon: Building2 },
    { label: 'Industry Challenges', route: '/college/challenges', icon: Swords },
    { label: 'Announcements', route: '/college/announcements', icon: Megaphone },
    { label: 'Analytics', route: '/college/analytics', icon: BarChart3 },
    { label: 'Reports', route: '/college/reports', icon: FileSpreadsheet },
    { label: 'College Profile', route: '/college/profile', icon: Building },
    { label: 'Settings', route: '/college/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/college/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200 select-none">
      {/* Header / Brand */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        <Link
          href="/college/dashboard"
          className={`flex items-center gap-3 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-extrabold text-lg text-white leading-tight flex items-center gap-1">
                Skill<span className="text-emerald-400">Setu</span>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block">
                COLLEGE PORTAL
              </div>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* College Info Mini Badge */}
      {!collapsed && (
        <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800/80 flex items-center gap-2.5">
          <img
            src={profile.logoUrl}
            alt={profile.institutionName}
            className="w-8 h-8 rounded-lg object-cover bg-slate-700 shrink-0"
          />
          <div className="overflow-hidden text-xs">
            <p className="font-bold text-white truncate">{profile.institutionName}</p>
            <p className="text-[10px] text-slate-400 truncate">{profile.location}</p>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route || (item.route !== '/college/dashboard' && pathname.startsWith(item.route));

          return (
            <Link
              key={item.route}
              href={item.route}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        >
          <div
            className="w-72 h-full bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
