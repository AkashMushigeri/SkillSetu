'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Menu,
  Search,
  MapPin,
  Bell,
  CheckCircle2,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Briefcase,
  Trophy,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const IndustryNavbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const router = useRouter();
  const {
    company,
    notifications,
    markNotificationsAsRead,
    searchRadiusKm,
    setSearchRadiusKm,
    showToast,
  } = useIndustry();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [radiusDropdownOpen, setRadiusDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const radiusRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (radiusRef.current && !radiusRef.current.contains(event.target as Node)) {
        setRadiusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs shadow-inner transition-colors group text-left"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden sm:inline">Search candidates, verified skills, jobs, colleges...</span>
            <span className="sm:hidden">Search talent &amp; skills...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Location Radius, Notifications, Help, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Location & Radius Selector */}
        <div className="relative" ref={radiusRef}>
          <button
            onClick={() => setRadiusDropdownOpen(!radiusDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{company.location.split(',')[0]}</span>
            <span className="font-bold text-emerald-400 font-mono">({searchRadiusKm}km)</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {radiusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Talent Search Radius
              </div>
              {[5, 10, 25, 50, 100].map((radius) => (
                <button
                  key={radius}
                  onClick={() => {
                    setSearchRadiusKm(radius);
                    setRadiusDropdownOpen(false);
                    showToast(`Updated talent search radius to ${radius} km`, 'info');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    searchRadiusKm === radius
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{radius} km radius</span>
                  {searchRadiusKm === radius && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40">
              <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-white">Notifications &amp; Activity</span>
                </div>
                <button
                  onClick={markNotificationsAsRead}
                  className="text-[10px] text-emerald-400 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80 text-xs">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 space-y-1 transition-colors hover:bg-slate-800/50 ${
                      !n.read ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-white text-xs">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                <Link
                  href="/industry/dashboard"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                >
                  View Full Talent Dashboard &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center font-bold text-white text-xs shadow-sm">
              TN
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="font-bold text-xs text-white">{company.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{company.recruiter.name}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-white text-xs">{company.name}</p>
                <p className="text-[11px] text-emerald-400">{company.recruiter.title}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{company.recruiter.email}</p>
              </div>

              <Link
                href="/industry/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Company Profile &amp; Branding</span>
              </Link>

              <Link
                href="/industry/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Hiring Settings</span>
              </Link>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    showToast('Logged out of Industry Portal', 'info');
                    router.push('/industry/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
