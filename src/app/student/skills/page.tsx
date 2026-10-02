'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  SKILLS_DATA,
  SkillLevelKey,
  SkillItem,
  CAREER_ROLE_MAPPINGS,
} from '@/data/skillsData';

export default function SkillsHubPage() {
  const { skills } = useStudent();
  const [activeLevel, setActiveLevel] = useState<SkillLevelKey>('basic');

  const verifiedCount = skills.filter((s) => s.isVerified).length;

  const tabs: { key: SkillLevelKey; label: string; count: number }[] = [
    { key: 'basic', label: 'Basic Skills', count: SKILLS_DATA.basic.length },
    { key: 'intermediate', label: 'Intermediate Skills', count: SKILLS_DATA.intermediate.length },
    { key: 'advanced', label: 'Advanced Skills', count: SKILLS_DATA.advanced.length },
  ];

  // Helper to resolve live status and progress from StudentContext
  const getSkillLiveState = (item: SkillItem) => {
    const liveSkill = skills.find(
      (s) => s.id === item.id || s.name.toLowerCase() === item.name.toLowerCase()
    );

    const isVerified = Boolean(liveSkill?.isVerified ?? item.isVerified);
    const progress = isVerified
      ? 100
      : liveSkill
      ? liveSkill.progress
      : item.defaultProgress;

    const status = isVerified
      ? 'Verified'
      : progress > 0
      ? 'In Progress'
      : item.defaultStatus;

    return { liveSkill, isVerified, progress, status };
  };

  const currentSkills = SKILLS_DATA[activeLevel];

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Verified Skill Framework
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Build skills that unlock opportunities.
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Learn &rarr; Practice &rarr; Assess &rarr; Verify &rarr; Get Matched. SkillSetu connects verified competencies directly to recruiter pipelines.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs font-medium text-emerald-300 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {verifiedCount} Verified Badges Unlocked
            </span>
            <span>&bull;</span>
            <span className="text-slate-300">Verified status boosts match score by +25%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-center sm:text-right">
          <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
            Recommended Assessment
          </span>
          <p className="text-sm font-bold text-white mt-1">Python Basic Assessment</p>
          <Link
            href="/student/skills/python-basic"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <span>Open Python Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Three Skill Tier Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl w-fit flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveLevel(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeLevel === tab.key
                    ? 'bg-white dark:bg-slate-900 text-brand-dark dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label.toUpperCase()} ({tab.count})
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeLevel === 'basic' && 'Foundational programming, core languages & essential computer science concepts'}
            {activeLevel === 'intermediate' && 'Industry frameworks, full-stack tools, algorithmic problem-solving & databases'}
            {activeLevel === 'advanced' && 'Specialized enterprise competencies (Cloud, AI/ML, DevOps, Cybersecurity) for placements'}
          </p>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5">
          {currentSkills.map((skill) => {
            const { isVerified, progress, status } = getSkillLiveState(skill);

            return (
              <Link
                key={skill.id}
                href={`/student/skills/${skill.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover hover:border-brand-teal/40 dark:hover:border-teal-500/40 transition-all flex flex-col justify-between group h-full"
              >
                <div className="flex-1 flex flex-col">
                  {/* Top Header: Icon, Title, Level, and Status Badge */}
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 leading-none">
                        {skill.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-teal dark:group-hover:text-teal-400 transition-colors truncate">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Level: {skill.level}</span>
                          <span>&bull;</span>
                          <span className="truncate">{skill.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold border border-emerald-300 dark:border-emerald-800 shadow-2xs shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Verified
                      </span>
                    ) : status === 'In Progress' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800/60 shrink-0">
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium border border-slate-200 dark:border-slate-700 shrink-0">
                        Not Started
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed flex-grow">
                    {skill.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Learning Progress</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isVerified
                            ? 'bg-emerald-600'
                            : progress >= 60
                            ? 'bg-brand-teal'
                            : progress > 0
                            ? 'bg-amber-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        style={{ width: `${Math.max(progress, 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Related Career Roles */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">
                      <span>Career Roles</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">{skill.relatedOpportunityCount}+ jobs</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skill.careerRoles.slice(0, 3).map((role) => (
                        <span
                          key={role}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium truncate"
                        >
                          {role}
                        </span>
                      ))}
                      {skill.careerRoles.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 font-medium">
                          +{skill.careerRoles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Learning / Assessment Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-teal dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
                  <span>
                    {skill.recommendedAction ||
                      (isVerified
                        ? 'View Verified Badge & Syllabus'
                        : progress > 0
                        ? 'Continue Curriculum & Assessment'
                        : 'Start Assessment & Syllabus')}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Skill -> Career Role Mapping Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Skill &rarr; Career Role Mapping
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your skills unlock these opportunities
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            SkillSetu maps verified competencies directly to high-demand industry roles and salary brackets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAREER_ROLE_MAPPINGS.map((item) => {
            const isSkillVerified = skills.some(
              (s) =>
                s.isVerified &&
                (s.name.toLowerCase().includes(item.skill.toLowerCase().split(' ')[0]) ||
                  item.skill.toLowerCase().includes(s.name.toLowerCase()))
            );

            return (
              <div
                key={item.skill}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSkillVerified
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.skill}</h3>
                    </div>
                    {isSkillVerified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">In Progress</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1.5">Eligible Career Roles:</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.roles.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500 block">Matched Opportunity:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold truncate block mt-0.5">
                    {item.highlightRole}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
