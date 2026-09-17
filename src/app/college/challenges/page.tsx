'use client';

import React from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Swords, Sparkles, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { MOCK_INDUSTRY_CHALLENGES } from '@/data/collegeData';

export default function IndustryChallengesPage() {
  const { showToast } = useCollege();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Industry Challenges</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Real-world technical challenges posted by hiring companies for student problem solving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_INDUSTRY_CHALLENGES.map((ch) => (
          <div
            key={ch.id}
            className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  {ch.company}
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {ch.deadline}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{ch.title}</h3>
                <p className="text-xs text-emerald-700 font-bold mt-1">Prize: {ch.prizeOrIncentive}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">{ch.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {ch.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                <strong className="text-slate-900">{ch.participantsCount}</strong> Registered Students
              </span>
              <button
                onClick={() => showToast(`Challenge "${ch.title}" recommended to all eligible students.`, 'success')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> Recommend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
