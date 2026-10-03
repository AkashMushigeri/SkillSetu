'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import {
  Compass,
  BookOpen,
  Award,
  Bookmark,
  FileCheck2,
  User,
  Bell,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export const StudentHeader: React.FC = () => {
  const pathname = usePathname();
  const {
    profile,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToDemo,
  } = useStudent();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/student', icon: GraduationCap },
    { name: 'Explore Opportunities', href: '/student/opportunities', icon: Compass },
    { name: 'Skills', href: '/student/skills', icon: Award },
    { name: 'AI Interview', href: '/student/ai-interview', icon: Sparkles },
    { name: 'Learning', href: '/student/learning', icon: BookOpen },
    { name: 'Saved', href: '/student/saved', icon: Bookmark },
    { name: 'Applications', href: '/student/applications', icon: FileCheck2 },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // Sync / clear pending path when navigation finishes
  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const currentPath = pendingPath || pathname;

  const isActive = (href: string) => {
    if (href === '/student') {
      return currentPath === '/student' || currentPath === '/student/dashboard';
    }
    return currentPath.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Banner Tagline */}
      <div className="bg-brand-dark dark:bg-slate-950 text-slate-300 dark:text-slate-400 text-xs py-1 px-4 sm:px-6 lg:px-8 xl:px-10 text-center font-medium hidden sm:flex items-center justify-between border-b border-teal-900/60 dark:border-slate-800 transition-colors duration-200">
        <div className="w-full max-w-[1820px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AYUSH CAREER BRIDGE &bull; Portal for Academia&ndash;Industry Collaboration</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>&ldquo;Learn. Connect. Grow Together.&rdquo;</span>
            <span className="text-emerald-400 font-semibold">
              Role: Student
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/student"
              prefetch={true}
              onClick={() => setPendingPath('/student')}
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center text-white shadow-md shadow-brand-teal/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-1.5">
                  Skill<span className="text-brand-teal">Setu</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-emerald mt-0.5">
                  AYUSH CAREER BRIDGE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setPendingPath(link.href)}
                  className={`group relative flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 ease-out select-none ${
                    active
                      ? 'bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ease-out ${
                      active
                        ? 'text-brand-teal dark:text-teal-400 scale-105'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:scale-105 motion-reduce:group-hover:scale-100'
                    }`}
                  />
                  <span className="transition-colors duration-200">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button - directly to the LEFT of the notification button */}
            <ThemeToggle />

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-brand-teal dark:text-teal-400 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-start gap-3 ${
                          !n.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === 'badge' ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                              <Award className="w-4 h-4" />
                            </div>
                          ) : n.type === 'assessment' ? (
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{n.title}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => setIsNotifOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] text-brand-teal dark:text-teal-400 font-medium mt-1 hover:underline"
                            >
                              View details <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div
                  suppressHydrationWarning
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-bold text-xs shadow-xs"
                >
                  {profile.name
                    ? profile.name
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'ST'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div suppressHydrationWarning className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    {profile.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div suppressHydrationWarning className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {profile.year} &bull; {profile.college?.split(' ')[0] || 'Student'}
                  </div>
                </div>
              </button>

              {/* Profile Menu Popover */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p suppressHydrationWarning className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</p>
                    <p suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400">{profile.degree} &bull; {profile.college}</p>
                    <div className="mt-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-2 border border-emerald-100 dark:border-emerald-800/40">
                      <div className="flex justify-between text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        <span>Profile Completion</span>
                        <span>{profile.profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-emerald-200 dark:bg-emerald-800/60 rounded-full h-1.5 mt-1.5">
                        <div
                          className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${profile.profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/student/profile"
                      prefetch={true}
                      onClick={() => {
                        setPendingPath('/student/profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                    >
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      View Full Profile
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Edit Profile &amp; Preferences
                    </Link>
                    <Link
                      href="/student/resume"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      Preview &amp; Download Resume
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        resetToDemo();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      Reset Demo State
                    </button>
                    <Link
                      href="/login"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium"
                    >
                      Log Out / Switch Role
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu button */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                onClick={() => {
                  setPendingPath(link.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out select-none active:scale-[0.98] ${
                  active
                    ? 'bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-200 ease-out ${active ? 'text-brand-teal dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="transition-colors duration-200">{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
