'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Trophy, Filter, Building2, Users, CheckCircle2, ArrowRight, Bell, Calendar, Sparkles } from 'lucide-react';
import { EligibilityEngineModal } from '@/components/college/EligibilityEngineModal';
import { PLACEMENT_PIPELINE } from '@/data/collegeData';

export default function PlacementManagementPage() {
  const { placements, showToast } = useCollege();
  const [isEligibilityEngineOpen, setIsEligibilityEngineOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold text-slate-900">Placement Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate placement drives, track recruitment pipelines, and test student eligibility.
          </p>
        </div>

        <button
          onClick={() => setIsEligibilityEngineOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Filter className="w-4 h-4" />
          <span>Launch Eligibility Engine</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: 'Eligible Students', val: '1,240', color: 'text-slate-900' },
          { label: 'Visiting Companies', val: '74', color: 'text-blue-700' },
          { label: 'Applications', val: '890', color: 'text-purple-700' },
          { label: 'Offers Received', val: '348', color: 'text-emerald-700' },
          { label: 'Highest Package', val: '₹24 LPA', color: 'text-amber-700' },
          { label: 'Average Package', val: '₹7.1 LPA', color: 'text-teal-700' },
          { label: 'Placement Rate', val: '86%', color: 'text-emerald-700' },
        ].map((k, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">{k.label}</span>
            <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* PLACEMENT PIPELINE (Prompt Section 22) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-amber-500" />
          Campus Recruitment Pipeline (AY 2026–27)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { stage: 'Eligible', count: PLACEMENT_PIPELINE.eligible, color: 'bg-slate-50 text-slate-800 border border-slate-200' },
            { stage: 'Applied', count: PLACEMENT_PIPELINE.applied, color: 'bg-blue-50 text-blue-800 border border-blue-200' },
            { stage: 'Shortlisted', count: PLACEMENT_PIPELINE.shortlisted, color: 'bg-purple-50 text-purple-800 border border-purple-200' },
            { stage: 'Interviewed', count: PLACEMENT_PIPELINE.interviewed, color: 'bg-amber-50 text-amber-800 border border-amber-200' },
            { stage: 'Selected', count: PLACEMENT_PIPELINE.selected, color: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
            { stage: 'Offers Issued', count: PLACEMENT_PIPELINE.offersReceived, color: 'bg-gradient-to-r from-brand-emerald to-emerald-600 text-white shadow-md' },
          ].map((pip, idx) => (
            <div key={idx} className={`p-4 rounded-2xl text-center space-y-1 ${pip.color}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">{pip.stage}</span>
              <p className="text-2xl font-black">{pip.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Placement Drives List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Upcoming &amp; Active Corporate Drives
          </h2>
          <span className="text-xs text-slate-500 font-semibold">{placements.length} Drives Registered</span>
        </div>

        <div className="space-y-4">
          {placements.map((drive) => (
            <div
              key={drive.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-extrabold text-amber-700 text-base shrink-0">
                    {drive.company.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      {drive.status} Drive
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{drive.company}</h3>
                    <p className="text-xs text-slate-600 font-medium">{drive.role}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 block sm:inline-block">
                    {drive.packageOffer}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">Drive Date: {drive.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Eligible Depts</span>
                  <span className="font-bold text-slate-800">{drive.eligibleDepts.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Min CGPA</span>
                  <span className="font-bold text-slate-800">{drive.minCgpa}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Required Skills</span>
                  <span className="font-bold text-slate-800 truncate block">{drive.skillsRequired.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Eligible Pool</span>
                  <span className="font-bold text-emerald-700">{drive.eligibleCount} Students</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => showToast(`Notified ${drive.eligibleCount} students for ${drive.company} drive.`, 'success')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 shadow-xs transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Notify Eligible Students</span>
                </button>
                <button
                  onClick={() => setIsEligibilityEngineOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Check Criteria Engine</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EligibilityEngineModal
        isOpen={isEligibilityEngineOpen}
        onClose={() => setIsEligibilityEngineOpen(false)}
      />
    </div>
  );
}
