'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import {
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

export default function StudentLearningPage() {
  const { skills } = useStudent();
  const [activeTab, setActiveTab] = useState<'in_progress' | 'verified' | 'all'>('in_progress');

  const inProgressSkills = skills.filter((s) => s.learningStatus === 'in_progress' && !s.isVerified);
  const verifiedSkills = skills.filter((s) => s.isVerified);
  const targetSkill = inProgressSkills[0] || skills.find((s) => !s.isVerified) || null;
  const unlockedRolesCount = Array.from(new Set(verifiedSkills.flatMap((s) => s.careerRoles || []))).length;

  const displayedSkills = activeTab === 'in_progress'
    ? inProgressSkills
    : activeTab === 'verified'
    ? verifiedSkills
    : skills;

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Personal Learning Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Learning Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track active curriculum progress, pending assessments, and unlocked credentials.
          </p>
        </div>

        <Link
          href="/student/skills"
          className="px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore New Skills</span>
        </Link>
      </div>

      {/* Recommended Next Skill Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-brand-dark to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
            <Zap className="w-3 h-3" />
            {targetSkill ? 'Recommended Next Skill' : 'Build Your Skill Stack'}
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {targetSkill ? `${targetSkill.name} — ${targetSkill.level}` : 'Explore In-Demand Industry Skills'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {targetSkill ? (
              <>
                <strong>Active Track:</strong> Continue learning {targetSkill.name} to complete the curriculum and prepare for verified industry certification.
              </>
            ) : (
              <>
                <strong>Get Started:</strong> Choose technical skills aligned with your career goals to generate personalized roadmaps and micro-internship recommendations.
              </>
            )}
          </p>
        </div>

        <Link
          href={targetSkill ? `/student/skills/${targetSkill.id}` : '/student/skills'}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto"
        >
          <span>{targetSkill ? `Continue ${targetSkill.name}` : 'Explore Skills Catalog'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Learning</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressSkills.length}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">Modules in progress</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Verified Badges</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{verifiedSkills.length}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">SkillSetu verified</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Ready for Assessment</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {skills.filter((s) => s.assessmentStatus === 'ready' && !s.isVerified).length}
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">&ge; 80% curriculum</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Unlocked Roles</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{unlockedRolesCount}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">Industry placements</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'in_progress'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          In Progress ({inProgressSkills.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verified'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Verified ({verifiedSkills.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Skills ({skills.length})
        </button>
      </div>

      {/* Skills Progress Cards List */}
      {displayedSkills.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {activeTab === 'in_progress'
                ? 'No active courses in progress'
                : activeTab === 'verified'
                ? 'No verified skills yet'
                : 'No skills added yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {activeTab === 'in_progress'
                ? 'Explore the skill library and start learning to track your course progress here.'
                : activeTab === 'verified'
                ? 'Complete learning modules and pass benchmark assessments to earn verified badges.'
                : 'Start your learning journey by selecting skills aligned with your career goals.'}
            </p>
          </div>
          <Link
            href="/student/skills"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-white font-bold text-xs hover:bg-brand-dark transition-all shadow-sm"
          >
            <span>Explore Skill Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5">
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</h3>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{skill.level} &bull; {skill.category}</span>
                    </div>
                  </div>

                  {skill.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ✓ Verified
                    </span>
                  ) : skill.assessmentStatus === 'ready' ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                      Test Ready
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">In Progress</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Completed</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        skill.isVerified
                          ? 'bg-emerald-600'
                          : skill.progress >= 80
                          ? 'bg-brand-teal'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {skill.resources.length} curriculum items
                </span>
                <Link
                  href={`/student/skills/${skill.id}`}
                  className="text-xs font-bold text-brand-teal dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
