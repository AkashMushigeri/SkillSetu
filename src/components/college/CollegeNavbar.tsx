'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCollege } from '@/context/CollegeContext';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  CheckCheck,
  Building,
  Info
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const CollegeNavbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const router = useRouter();
  const { profile, notifications, markNotificationRead, markAllNotificationsRead, logout } = useCollege();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState(profile.academicYear || '2026–27');
  const [helpOpen, setHelpOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setNotificationsOpen(false);
    if (notif.targetRoute) {
      router.push(notif.targetRoute);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Quick Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Button / Field */}
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-slate-400 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span>Search students, skills, internships, placement drives...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Academic Year Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2026–27" className="bg-slate-900 text-white">AY 2026–27</option>
              <option value="2025–26" className="bg-slate-900 text-white">AY 2025–26</option>
              <option value="2024–25" className="bg-slate-900 text-white">AY 2024–25</option>
            </select>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-all relative"
            title="Help & Tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">Campus Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No notifications.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !n.read ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-400 shrink-0 opacity-80" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-900 border-t border-slate-800 text-center">
                  <Link
                    href="/college/announcements"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    View All Campus Announcements &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* College Admin Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all text-left"
            >
              <img
                src={profile.placementOfficer.avatar}
                alt={profile.placementOfficer.name}
                className="w-8 h-8 rounded-lg object-cover bg-slate-700 border border-slate-600 shrink-0"
              />
              <div className="hidden sm:block text-xs pr-1">
                <p className="font-bold text-white leading-tight truncate">{profile.placementOfficer.name}</p>
                <p className="text-[10px] text-emerald-400 leading-tight truncate">
                  {profile.placementOfficer.title}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 divide-y divide-slate-800">
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-white">{profile.placementOfficer.name}</p>
                  <p className="text-[11px] text-slate-400">{profile.placementOfficer.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {profile.institutionName}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    href="/college/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
                  >
                    <Building className="w-4 h-4 text-slate-400" />
                    College Profile
                  </Link>
                  <Link
                    href="/college/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </Link>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      router.push('/college/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">SKILLSETU College Help</h3>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Welcome to the SKILLSETU College Portal! As the Placement &amp; Training Officer for <strong>AYUSH Institute of Technology</strong>, you can track skill verification, close skill gaps, manage startup internship recommendations, and track placement drives.
            </p>
            <div className="space-y-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-2xl">
              <p>💡 <strong>Demo Quick Tip:</strong> Click &quot;Create Training Program&quot; on the Skill Gap section to quickly launch a Cloud Bootcamp!</p>
              <p>💡 <strong>Startup Opportunities:</strong> Recommend startup internships directly to 3rd-year students.</p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
