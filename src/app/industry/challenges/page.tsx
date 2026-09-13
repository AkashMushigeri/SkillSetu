'use client';

import React from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import {
  Trophy,
  Plus,
  Users,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  School,
  CheckCircle2,
} from 'lucide-react';

export default function IndustryChallengesPage() {
  const { challenges } = useIndustry();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Industry Challenges &amp; Hackathons
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              {challenges.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish real-world engineering problem statements for student teams, evaluate code submissions, and fast-track top performers.
          </p>
        </div>

        <Link
          href="/industry/challenges/new"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Challenge</span>
        </Link>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((chal) => (
          <div
            key={chal.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  {chal.difficulty} Difficulty
                </span>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Deadline: {chal.deadline}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                  {chal.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{chal.description}</p>
              </div>

              {/* Problem statement */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Problem Statement:
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {chal.problemStatement}
                </p>
              </div>

              {/* Required Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chal.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prize & College scope */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Prize &amp; Recognition:</span>
                  <span className="font-semibold text-emerald-300 text-[11px]">{chal.prize}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Eligibility:</span>
                  <span className="text-slate-300 text-[11px]">{chal.collegeParticipation}</span>
                </div>
              </div>
            </div>

            {/* Footer metrics & action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-white font-semibold">
                  <Users className="w-4 h-4 text-blue-400" />
                  {chal.participantsCount} registered
                </span>
                <span className="text-slate-400">
                  {chal.submissionsCount} submissions
                </span>
              </div>

              <Link
                href={`/industry/challenges/${chal.id}`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors group-hover:border-emerald-500/50"
              >
                <span>Review Submissions</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
