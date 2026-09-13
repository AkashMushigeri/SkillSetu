'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Settings, Shield, Bell, Lock, Calendar, Building, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export default function CollegeSettingsPage() {
  const { showToast } = useCollege();
  const [activeTab, setActiveTab] = useState<'account' | 'institution' | 'notifications' | 'privacy' | 'placements'>('account');

  // Toggle states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoVerifyBadges, setAutoVerifyBadges] = useState(true);
  const [startupFirstPreference, setStartupFirstPreference] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareSkillAnalytics, setShareSkillAnalytics] = useState(true);

  const handleSaveSettings = () => {
    showToast('College settings saved successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">College Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure institutional preferences, placement eligibility thresholds, and notifications.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center gap-2">
        {[
          { id: 'account', label: 'Account & Administrator' },
          { id: 'institution', label: 'Institution & Departments' },
          { id: 'notifications', label: 'Notifications & Alerts' },
          { id: 'privacy', label: 'Privacy & Sharing' },
          { id: 'placements', label: 'Placement Preferences' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form Body */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        {activeTab === 'account' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">Administrator Account</h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Placement Officer Email</label>
              <input
                type="email"
                readOnly
                value="priya.sharma@ayushcollege.edu"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
              <input
                type="text"
                readOnly
                value="Placement & Training Officer"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"
              />
            </div>
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">Placement &amp; Startup Preferences</h3>

            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <div>
                <p className="font-bold text-white">Startup-First Internship Priority</p>
                <p className="text-[11px] text-slate-400">Recommend startup opportunities to 3rd year students before corporate drives.</p>
              </div>
              <button
                onClick={() => setStartupFirstPreference(!startupFirstPreference)}
                className="text-emerald-400"
              >
                {startupFirstPreference ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <div>
                <p className="font-bold text-white">Automated Skill Badge Verification</p>
                <p className="text-[11px] text-slate-400">Issue verified digital badges automatically when student assessment score &ge; 75%.</p>
              </div>
              <button
                onClick={() => setAutoVerifyBadges(!autoVerifyBadges)}
                className="text-emerald-400"
              >
                {autoVerifyBadges ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>
          </div>
        )}

        {(activeTab !== 'account' && activeTab !== 'placements') && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">General Institutional Settings</h3>

            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <div>
                <p className="font-bold text-white">Email Digest &amp; Drive Alerts</p>
                <p className="text-[11px] text-slate-400">Send daily placement and assessment digests to department HODs.</p>
              </div>
              <button onClick={() => setEmailAlerts(!emailAlerts)}>
                {emailAlerts ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <div>
                <p className="font-bold text-white">Share Anonymized Skill Gap Analytics</p>
                <p className="text-[11px] text-slate-400">Allow hiring partner companies to view aggregated skill gap trends for recruitment planning.</p>
              </div>
              <button onClick={() => setShareSkillAnalytics(!shareSkillAnalytics)}>
                {shareSkillAnalytics ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
          >
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
