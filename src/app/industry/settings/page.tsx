'use client';

import React, { useState } from 'react';
import { useIndustry } from '@/context/IndustryContext';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  Building,
  User,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function IndustrySettingsPage() {
  const { preferences, updatePreferences, company, resetToDefaults, showToast } = useIndustry();

  const [minCgpa, setMinCgpa] = useState<number>(preferences.minimumCgpa);
  const [prioritizeVerified, setPrioritizeVerified] = useState<boolean>(preferences.prioritizeVerifiedSkills);
  const [prioritizeStartup, setPrioritizeStartup] = useState<boolean>(preferences.prioritizeStartupExperience);
  const [radius, setRadius] = useState<number>(preferences.searchRadiusKm);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApplications, setNotifApplications] = useState(true);
  const [notifMatches, setNotifMatches] = useState(true);

  const handleSaveHiringPrefs = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      minimumCgpa: minCgpa,
      prioritizeVerifiedSkills: prioritizeVerified,
      prioritizeStartupExperience: prioritizeStartup,
      searchRadiusKm: radius,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Settings &amp; Hiring Preferences
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure recruitment filters, notification triggers, and organization preferences.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* 1. Hiring Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Candidate Matching &amp; Eligibility Preferences
          </h2>
          <p className="text-xs text-slate-400">
            Customize parameters influencing the automated candidate recommendation algorithm.
          </p>
        </div>

        <form onSubmit={handleSaveHiringPrefs} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Minimum Candidate CGPA Threshold
              </label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="10.0"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Default Talent Search Radius (km)
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km (Bengaluru Metro)</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km (Statewide)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prioritizeVerified}
                onChange={(e) => setPrioritizeVerified(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="font-bold text-white block">
                  Prioritize Candidates with Verified Registry Badges
                </span>
                <span className="text-[11px] text-slate-400">
                  Awards full 15-point weighting only to skills with formal institutional assessment pass certificates.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prioritizeStartup}
                onChange={(e) => setPrioritizeStartup(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded"
              />
              <div>
                <span className="font-bold text-white block">
                  Prioritize Candidates with Prior Startup Sprint Experience
                </span>
                <span className="text-[11px] text-slate-400">
                  Boosts ranking for students who previously completed verified micro-internships.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Save Hiring Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Recruiter Alerts &amp; Digest
          </h2>
          <p className="text-xs text-slate-400">
            Control automated notifications for high-match candidate discoveries and application status updates.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Email notifications on new high-match candidates (&gt; 90%)</span>
            <input
              type="checkbox"
              checked={notifMatches}
              onChange={(e) => setNotifMatches(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Real-time alerts when college accepts collaboration request</span>
            <input
              type="checkbox"
              checked={notifApplications}
              onChange={(e) => setNotifApplications(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Daily talent pipeline digest</span>
            <input
              type="checkbox"
              checked={notifEmail}
              onChange={(e) => setNotifEmail(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
