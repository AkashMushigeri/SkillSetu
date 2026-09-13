'use client';

import React from 'react';
import { MatchResult } from '@/lib/industryMatching';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';

interface SkillMatchBreakdownProps {
  match: MatchResult;
  candidateName?: string;
}

export const SkillMatchBreakdown: React.FC<SkillMatchBreakdownProps> = ({ match, candidateName }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            Candidate Skill-Matching Engine
          </h4>
          <p className="text-[11px] text-slate-400">
            Weighted algorithm comparing requirements vs verified candidate benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              {match.overall}%
            </div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-400">
              Overall Match
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Skill Alignment</span>
            <span className="font-bold text-emerald-400">{match.skillMatch} / 60</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(match.skillMatch / 60) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">60% Max Weight</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" /> Verified Registry
            </span>
            <span className="font-bold text-teal-300">{match.verifiedBonus} / 15</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(match.verifiedBonus / 15) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">15% Max Weight</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Projects Depth</span>
            <span className="font-bold text-sky-400">{match.projectsMatch} / 10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(match.projectsMatch / 10) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">10% Max Weight</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Experience / Sprints</span>
            <span className="font-bold text-indigo-400">{match.experienceMatch} / 5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full"
              style={{ width: `${(match.experienceMatch / 5) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">5% Max Weight</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Education &amp; CGPA</span>
            <span className="font-bold text-purple-400">{match.educationMatch} / 5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${(match.educationMatch / 5) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">5% Max Weight</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Location Radius</span>
            <span className="font-bold text-amber-400">{match.locationMatch} / 5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${(match.locationMatch / 5) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">5% Max Weight</span>
        </div>
      </div>

      {/* Individual Skill Details */}
      {match.details.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h5 className="text-xs font-semibold text-slate-300">Required Skills Evaluation:</h5>
          <div className="space-y-1.5">
            {match.details.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{item.skill}</span>
                  <span className="text-[10px] text-slate-400">
                    Req: {item.requiredLevel} &bull; Cand: {item.candidateLevel}
                  </span>
                  {item.verified && (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 80
                          ? 'bg-emerald-400'
                          : item.score >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span
                    className={`font-mono font-bold text-xs ${
                      item.score >= 80 ? 'text-emerald-400' : item.score >= 50 ? 'text-amber-300' : 'text-rose-400'
                    }`}
                  >
                    {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
