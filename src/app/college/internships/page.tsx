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
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Internship Opportunities</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect students with curated startup and industry internships matching their verified technical skills.
          </p>
        </div>
      </div>

      {/* STARTUP-FIRST EXPERIENCE SECTION (Prompt Section 20) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Recommended Startup Experience</h2>
              <p className="text-xs text-slate-300">
                Help students in 3rd year gain real-world experience through startup internships before entering large-scale industry roles.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Startup First Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {startupOpportunities.map((st) => (
            <div
              key={st.id}
              className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    Startup Partner &bull; {st.duration}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1">{st.role}</h3>
                  <p className="text-xs text-slate-300">{st.company} &bull; {st.location}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  {st.stipend}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                {st.skillsRequired.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-xs text-slate-400">
                  <strong className="text-emerald-400">{st.eligibleStudentsCount}</strong> eligible 3rd-year students
                </span>
                <button
                  onClick={() => recommendInternship(st.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(['All', 'Startup', 'Corporate'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type} Opportunities
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredInternships.length}</strong> active roles
        </p>
      </div>

      {/* Main Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((intern) => (
          <div
            key={intern.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    intern.isStartup
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {intern.isStartup ? 'Startup' : 'Corporate'} &bull; {intern.mode}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {intern.stipend}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{intern.role}</h3>
                <p className="text-xs text-slate-300 font-semibold">{intern.company}</p>
                <p className="text-[11px] text-slate-400">{intern.location} &bull; {intern.duration}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {intern.skillsRequired.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-200 text-[10px] rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs flex justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Eligible Students</span>
                  <span className="font-bold text-white">{intern.eligibleStudentsCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Applications</span>
                  <span className="font-bold text-emerald-400">{intern.applicationsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => showToast(`Shared ${intern.role} link with eligible student batch.`, 'info')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => recommendInternship(intern.id)}
                className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30"
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
