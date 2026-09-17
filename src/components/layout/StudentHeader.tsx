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
    { name: 'Learning', href: '/student/learning', icon: BookOpen },
    { name: 'Saved', href: '/student/saved', icon: Bookmark },
    { name: 'Applications', href: '/student/applications', icon: FileCheck2 },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/student') {
      return pathname === '/student' || pathname === '/student/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Banner Tagline */}
      <div className="bg-brand-dark text-slate-300 text-xs py-1 px-4 text-center font-medium hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AYUSH CAREER BRIDGE &bull; Portal for Academia&ndash;Industry Collaboration</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>&ldquo;Learn. Connect. Grow Together.&rdquo;</span>
          <span className="text-emerald-400 font-semibold">Demo Role: Student</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <Link href="/student" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center text-white shadow-md shadow-brand-teal/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
                  Skill<span className="text-brand-teal">Setu</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-emerald mt-0.5">
                  AYUSH CAREER BRIDGE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-teal/10 text-brand-teal font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-teal' : 'text-slate-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce"
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span
                          suppressHydrationWarning
                          className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold"
                        >
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-brand-teal hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === 'badge' ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Award className="w-4 h-4" />
                            </div>
                          ) : n.type === 'assessment' ? (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => setIsNotifOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] text-brand-teal font-medium mt-1 hover:underline"
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
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AS
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                    {profile.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {profile.year} &bull; RVCE
                  </div>
                </div>
              </button>

              {/* Profile Menu Popover */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{profile.name}</p>
                    <p className="text-xs text-slate-500">{profile.degree}</p>
                    <div className="mt-2 bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                      <div className="flex justify-between text-xs text-emerald-800 font-medium">
                        <span>Profile Completion</span>
                        <span>{profile.profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-1.5">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${profile.profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/student/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      View Full Profile
                    </Link>
                    <Link
                      href="/student/resume"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-500" />
                      Preview & Download Resume
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        resetToDemo();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      Reset Demo State
                    </button>
                    <Link
                      href="/login"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
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
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-brand-teal/10 text-brand-teal font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-brand-teal' : 'text-slate-500'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
