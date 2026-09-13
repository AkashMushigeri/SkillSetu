'use client';

import React from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Swords, Sparkles, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { MOCK_INDUSTRY_CHALLENGES } from '@/data/collegeData';

export default function IndustryChallengesPage() {
  const { showToast } = useCollege();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-extrabold text-white">Industry Challenges</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-world technical challenges posted by hiring companies for student problem solving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_INDUSTRY_CHALLENGES.map((ch) => (
          <div
            key={ch.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {ch.company}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {ch.deadline}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{ch.title}</h3>
                <p className="text-xs text-emerald-400 font-bold mt-1">Prize: {ch.prizeOrIncentive}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{ch.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {ch.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                <strong className="text-white">{ch.participantsCount}</strong> Registered Students
              </span>
              <button
                onClick={() => showToast(`Challenge "${ch.title}" recommended to all eligible students.`, 'success')}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
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
