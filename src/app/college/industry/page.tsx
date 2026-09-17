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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Industry Collaboration</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Manage corporate partnerships, MoUs, collaborative industry projects, and hackathon challenges.
          </p>
        </div>

        <button
          onClick={() => showToast('New Industry Collaboration workflow initiated.', 'info')}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Collaboration</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
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
                  ? 'bg-brand-emerald text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {partner.partnershipType}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{partner.status}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{partner.name}</h3>
                  <p className="text-xs text-slate-500">{partner.industry}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Programs</span>
                    <span className="font-bold text-slate-900 text-sm">{partner.activePrograms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Internships</span>
                    <span className="font-bold text-emerald-700 text-sm">{partner.internshipsOffered}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hiring</span>
                    <span className="font-bold text-blue-700 text-sm">{partner.hiringOpportunities}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Last: {partner.lastCollaboration}</span>
                <button
                  onClick={() => showToast(`Opening collaboration portal for ${partner.name}`, 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
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
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                    {prj.department} Dept &bull; Industry Project
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-1">{prj.title}</h3>
                  <p className="text-xs text-emerald-700 font-semibold">Industry Sponsor: {prj.industryPartner}</p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    prj.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {prj.status} ({prj.progressPct}%)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{prj.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-500">
                <span>
                  <strong className="text-slate-800">{prj.studentsCount}</strong> Students &bull; <strong className="text-slate-800">{prj.facultyCount}</strong> Faculty Mentors
                </span>
                <button
                  onClick={() => showToast(`Viewing project repository for ${prj.title}`, 'info')}
                  className="text-emerald-700 hover:underline font-bold"
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
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    {ch.company} Challenge
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-1">{ch.title}</h3>
                  <p className="text-xs text-amber-700 font-bold mt-0.5">Incentive: {ch.prizeOrIncentive}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">Deadline: {ch.deadline}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  <strong className="text-slate-900">{ch.participantsCount}</strong> Students Participating
                </span>
                <button
                  onClick={() => showToast(`Challenge "${ch.title}" recommended to 84 students.`, 'success')}
                  className="px-4 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
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
