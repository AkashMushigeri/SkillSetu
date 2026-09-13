'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCollege } from '@/context/CollegeContext';
import { Building2, Plus, Sparkles, FolderGit2, Swords, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_INDUSTRY_PARTNERS, MOCK_COLLEGE_PROJECTS, MOCK_INDUSTRY_CHALLENGES } from '@/data/collegeData';

export default function IndustryCollaborationPage() {
  const { showToast } = useCollege();
  const [activeTab, setActiveTab] = useState<'partners' | 'projects' | 'challenges'>('partners');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Industry Collaboration</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage corporate partnerships, MoUs, collaborative industry projects, and hackathon challenges.
          </p>
        </div>

        <button
          onClick={() => showToast('New Industry Collaboration workflow initiated.', 'info')}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Collaboration</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'partners', label: 'Partner Companies (74)' },
            { id: 'projects', label: 'College–Industry Projects (3)' },
            { id: 'challenges', label: 'Industry Challenges (2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Panes */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_INDUSTRY_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {partner.partnershipType}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{partner.status}</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg">{partner.name}</h3>
                  <p className="text-xs text-slate-400">{partner.industry}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Programs</span>
                    <span className="font-bold text-white text-sm">{partner.activePrograms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Internships</span>
                    <span className="font-bold text-emerald-400 text-sm">{partner.internshipsOffered}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hiring</span>
                    <span className="font-bold text-blue-400 text-sm">{partner.hiringOpportunities}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Last: {partner.lastCollaboration}</span>
                <button
                  onClick={() => showToast(`Opening collaboration portal for ${partner.name}`, 'info')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
                >
                  Manage MoU
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          {MOCK_COLLEGE_PROJECTS.map((prj) => (
            <div
              key={prj.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    {prj.department} Dept &bull; Industry Project
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1">{prj.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Industry Sponsor: {prj.industryPartner}</p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl ${
                    prj.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {prj.status} ({prj.progressPct}%)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{prj.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span>
                  <strong>{prj.studentsCount}</strong> Students &bull; <strong>{prj.facultyCount}</strong> Faculty Mentors
                </span>
                <button
                  onClick={() => showToast(`Viewing project repository for ${prj.title}`, 'info')}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {MOCK_INDUSTRY_CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    {ch.company} Challenge
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1">{ch.title}</h3>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">Incentive: {ch.prizeOrIncentive}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">Deadline: {ch.deadline}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ch.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  <strong className="text-white">{ch.participantsCount}</strong> Students Participating
                </span>
                <button
                  onClick={() => showToast(`Challenge "${ch.title}" recommended to 84 students.`, 'success')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Recommend to Students
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
