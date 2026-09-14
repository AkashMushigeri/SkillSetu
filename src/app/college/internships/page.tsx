'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { BriefcaseBusiness, Rocket, Sparkles, CheckCircle2, Share2, Eye, Building2 } from 'lucide-react';

export default function InternshipsPage() {
  const { internships, recommendInternship, showToast } = useCollege();
  const [filterType, setFilterType] = useState<'All' | 'Startup' | 'Corporate'>('All');

  const filteredInternships = internships.filter((i) => {
    if (filterType === 'Startup') return i.isStartup;
    if (filterType === 'Corporate') return !i.isStartup;
    return true;
  });

  const startupOpportunities = internships.filter((i) => i.isStartup);

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Internship Opportunities</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connect students with curated startup and industry internships matching their verified technical skills.
          </p>
        </div>
      </div>

      {/* STARTUP-FIRST EXPERIENCE SECTION (Prompt Section 20) */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 text-emerald-300 border border-white/20 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Recommended Startup Experience</h2>
              <p className="text-xs text-slate-200">
                Help students in 3rd year gain real-world experience through startup internships before entering large-scale industry roles.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-white/20 text-emerald-300 px-3 py-1 rounded-full border border-white/30">
            Startup First Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {startupOpportunities.map((st) => (
            <div
              key={st.id}
              className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-3 shadow-sm text-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-white/20 text-white px-2 py-0.5 rounded">
                    Startup Partner &bull; {st.duration}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1">{st.role}</h3>
                  <p className="text-xs text-slate-200">{st.company} &bull; {st.location}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-white/10 px-2.5 py-1 rounded-xl border border-white/20">
                  {st.stipend}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 text-[11px] text-slate-200">
                {st.skillsRequired.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 bg-white/15 rounded border border-white/20">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <span className="text-xs text-slate-200">
                  <strong className="text-emerald-300">{st.eligibleStudentsCount}</strong> eligible 3rd-year students
                </span>
                <button
                  onClick={() => recommendInternship(st.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-brand-emerald to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommend to Students</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {(['All', 'Startup', 'Corporate'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type} Opportunities
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{filteredInternships.length}</strong> active roles
        </p>
      </div>

      {/* Main Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((intern) => (
          <div
            key={intern.id}
            className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    intern.isStartup
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                  }`}
                >
                  {intern.isStartup ? 'Startup' : 'Corporate'} &bull; {intern.mode}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                  {intern.stipend}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{intern.role}</h3>
                <p className="text-xs text-slate-700 font-semibold">{intern.company}</p>
                <p className="text-[11px] text-slate-500">{intern.location} &bull; {intern.duration}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {intern.skillsRequired.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Eligible Students</span>
                  <span className="font-bold text-slate-900">{intern.eligibleStudentsCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Applications</span>
                  <span className="font-bold text-emerald-700">{intern.applicationsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => showToast(`Shared ${intern.role} link with eligible student batch.`, 'info')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => recommendInternship(intern.id)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
              >
                Recommend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
