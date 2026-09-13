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
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">Placement Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage corporate placement drives, track recruitment pipelines, and test student eligibility.
          </p>
        </div>

        <button
          onClick={() => setIsEligibilityEngineOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
        >
          <Filter className="w-4 h-4" />
          <span>Launch Eligibility Engine</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: 'Eligible Students', val: '1,240', color: 'text-white' },
          { label: 'Visiting Companies', val: '74', color: 'text-blue-400' },
          { label: 'Applications', val: '890', color: 'text-purple-400' },
          { label: 'Offers Received', val: '348', color: 'text-emerald-400' },
          { label: 'Highest Package', val: '₹24 LPA', color: 'text-amber-400' },
          { label: 'Average Package', val: '₹7.1 LPA', color: 'text-teal-400' },
          { label: 'Placement Rate', val: '86%', color: 'text-emerald-400' },
        ].map((k, idx) => (
          <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{k.label}</span>
            <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* PLACEMENT PIPELINE (Prompt Section 22) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
          <Users className="w-5 h-5 text-amber-400" />
          Campus Recruitment Pipeline (AY 2026–27)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { stage: 'Eligible', count: PLACEMENT_PIPELINE.eligible, color: 'bg-slate-800 text-slate-200' },
            { stage: 'Applied', count: PLACEMENT_PIPELINE.applied, color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
            { stage: 'Shortlisted', count: PLACEMENT_PIPELINE.shortlisted, color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
            { stage: 'Interviewed', count: PLACEMENT_PIPELINE.interviewed, color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
            { stage: 'Selected', count: PLACEMENT_PIPELINE.selected, color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
            { stage: 'Offers Issued', count: PLACEMENT_PIPELINE.offersReceived, color: 'bg-emerald-500 text-white shadow-lg' },
          ].map((pip, idx) => (
            <div key={idx} className={`p-4 rounded-2xl text-center space-y-1 ${pip.color}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">{pip.stage}</span>
              <p className="text-2xl font-black">{pip.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Placement Drives List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Upcoming &amp; Active Corporate Drives
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{placements.length} Drives Registered</span>
        </div>

        <div className="space-y-4">
          {placements.map((drive) => (
            <div
              key={drive.id}
              className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-3 hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-extrabold text-amber-400 text-base shrink-0">
                    {drive.company.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      {drive.status} Drive
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">{drive.company}</h3>
                    <p className="text-xs text-slate-300">{drive.role}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 block sm:inline-block">
                    {drive.packageOffer}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">Drive Date: {drive.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Eligible Depts</span>
                  <span className="font-bold text-slate-200">{drive.eligibleDepts.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Min CGPA</span>
                  <span className="font-bold text-slate-200">{drive.minCgpa}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Required Skills</span>
                  <span className="font-bold text-slate-200 truncate block">{drive.skillsRequired.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Eligible Pool</span>
                  <span className="font-bold text-emerald-400">{drive.eligibleCount} Students</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => showToast(`Notified ${drive.eligibleCount} students for ${drive.company} drive.`, 'success')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notify Eligible Students</span>
                </button>
                <button
                  onClick={() => setIsEligibilityEngineOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
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
