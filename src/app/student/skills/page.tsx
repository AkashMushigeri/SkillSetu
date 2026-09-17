'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { SkillTier } from '@/types/student';
import {
  Award,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  Briefcase,
  ChevronRight,
  Compass
} from 'lucide-react';

export default function SkillsHubPage() {
  const { skills } = useStudent();
  const [activeTier, setActiveTier] = useState<SkillTier>('Basic');

  const filteredSkills = skills.filter((s) => s.tier === activeTier);
  const verifiedCount = skills.filter((s) => s.isVerified).length;

  const roleMappings = [
    {
      skill: 'Python',
      verified: skills.find((s) => s.name === 'Python')?.isVerified,
      icon: '🐍',
      roles: ['Data Analyst', 'Python Developer', 'Backend Developer', 'Automation Engineer', 'ML Intern'],
      highlightRole: 'Data Analyst Intern @ Google (₹50k/mo)',
    },
    {
      skill: 'HTML / CSS',
      verified: skills.find((s) => s.name === 'HTML')?.isVerified,
      icon: '🌐',
      roles: ['Frontend Developer', 'Web Developer', 'UI Developer'],
      highlightRole: 'Junior Frontend Developer Intern (₹22k/mo)',
    },
    {
      skill: 'React',
      verified: skills.find((s) => s.name === 'React')?.isVerified,
      icon: '⚛️',
      roles: ['Frontend Developer', 'React Developer', 'UI Engineer', 'Web Developer'],
      highlightRole: 'Botanical Database Visualizer Sprint (₹15k)',
    },
    {
      skill: 'SQL',
      verified: skills.find((s) => s.name === 'SQL')?.isVerified,
      icon: '🗄️',
      roles: ['Data Analyst', 'Business Analyst', 'Database Developer'],
      highlightRole: 'Business Analyst Intern @ Swiggy (₹25k/mo)',
    },
    {
      skill: 'SAP',
      verified: skills.find((s) => s.name === 'SAP')?.isVerified,
      icon: '🏢',
      roles: ['SAP Consultant', 'SAP Developer', 'SAP Analyst', 'ERP Specialist'],
      highlightRole: 'Enterprise S/4HANA ERP Associate (₹6.5 LPA)',
    },
    {
      skill: 'AWS',
      verified: skills.find((s) => s.name === 'AWS')?.isVerified,
      icon: '☁️',
      roles: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect'],
      highlightRole: 'Graduate Cloud Support Specialist @ Wipro (₹4.2 LPA)',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
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

          <div className="flex items-center gap-3 pt-2 text-xs font-medium text-emerald-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {verifiedCount} Verified Badges Unlocked
            </span>
            <span>&bull;</span>
            <span className="text-slate-300">Verified status boosts match score by +25%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-center sm:text-right">
          <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
            Primary Demo Flow
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
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
            {(['Basic', 'Intermediate', 'Advanced'] as SkillTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTier === tier
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier.toUpperCase()} SKILLS
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {activeTier === 'Basic' && 'Foundational programming & essential workplace competencies'}
            {activeTier === 'Intermediate' && 'Industry-standard frameworks, libraries, and analytical tools'}
            {activeTier === 'Advanced' && 'Specialized enterprise skills (SAP, Cloud, ML, DevOps) for final years & high-paying placements'}
          </p>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              href={`/student/skills/${skill.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-cardHover hover:border-brand-teal/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-teal transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] text-slate-500">{skill.category}</span>
                    </div>
                  </div>

                  {skill.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ✓ Verified
                    </span>
                  ) : skill.assessmentStatus === 'ready' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                      Assess Ready
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                      {skill.level}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Learning Progress</span>
                    <span className="font-bold text-slate-800">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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

                {/* Roles Unlocked preview */}
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="truncate">Unlocks: {skill.careerRoles.slice(0, 2).join(', ')}</span>
                  <span className="text-slate-400 font-medium shrink-0 ml-1">{skill.relatedOpportunityCount} jobs</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-teal group-hover:translate-x-0.5 transition-transform">
                <span>View Syllabus &amp; Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Skill -> Career Role Mapping Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Skill &rarr; Career Role Mapping
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Your skills unlock these opportunities
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            SkillSetu maps verified competencies directly to high-demand industry roles and salary brackets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleMappings.map((item) => (
            <div
              key={item.skill}
              className={`p-4 rounded-2xl border transition-all ${
                item.verified
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="font-bold text-sm text-slate-900">{item.skill}</h3>
                </div>
                {item.verified ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">In Progress</span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 font-semibold mb-1.5">Eligible Career Roles:</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.roles.map((r) => (
                  <span
                    key={r}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-400 block">Matched Opportunity:</span>
                <strong className="text-slate-800 font-semibold truncate block mt-0.5">
                  {item.highlightRole}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
