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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Industry Challenges &amp; Hackathons
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 border border-amber-500/40 font-mono">
              {challenges.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Publish real-world engineering problem statements for student teams, evaluate code submissions, and fast-track top performers.
          </p>
        </div>

        <Link
          href="/industry/challenges/new"
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 self-start md:self-auto transition-all"
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
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between space-y-5 group text-slate-900"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  {chal.difficulty} Difficulty
                </span>

                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Deadline: {chal.deadline}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                  {chal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{chal.description}</p>
              </div>

              {/* Problem statement */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Problem Statement:
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {chal.problemStatement}
                </p>
              </div>

              {/* Required Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chal.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prize & College scope */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Prize &amp; Recognition:</span>
                  <span className="font-semibold text-emerald-700 text-[11px]">{chal.prize}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Eligibility:</span>
                  <span className="text-slate-700 text-[11px]">{chal.collegeParticipation}</span>
                </div>
              </div>
            </div>

            {/* Footer metrics & action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-900 font-semibold">
                  <Users className="w-4 h-4 text-blue-600" />
                  {chal.participantsCount} registered
                </span>
                <span className="text-slate-500">
                  {chal.submissionsCount} submissions
                </span>
              </div>

              <Link
                href={`/industry/challenges/${chal.id}`}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Review Submissions</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
