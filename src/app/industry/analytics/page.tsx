'use client';

import React from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function IndustryAnalyticsPage() {
  const { company, applications, colleges } = useIndustry();

  const funnelStages = [
    { label: 'Applications', count: 684, pct: '100%', color: 'bg-blue-500' },
    { label: 'Screened', count: 412, pct: '60.2%', color: 'bg-indigo-500' },
    { label: 'Shortlisted', count: 126, pct: '18.4%', color: 'bg-purple-500' },
    { label: 'Interview', count: 74, pct: '10.8%', color: 'bg-cyan-500' },
    { label: 'Selected', count: 28, pct: '4.1%', color: 'bg-teal-500' },
    { label: 'Hired', count: 22, pct: '3.2%', color: 'bg-emerald-500' },
  ];

  const skillDistribution = [
    { skill: 'Python', percentage: 68, verifiedPct: 52 },
    { skill: 'SQL', percentage: 54, verifiedPct: 44 },
    { skill: 'Java & Spring Boot', percentage: 46, verifiedPct: 38 },
    { skill: 'React & Next.js', percentage: 42, verifiedPct: 35 },
    { skill: 'Machine Learning', percentage: 34, verifiedPct: 24 },
    { skill: 'Cloud (AWS/GCP)', percentage: 21, verifiedPct: 18 },
    { skill: 'SAP / ERP Integration', percentage: 12, verifiedPct: 9 },
  ];

  const collegeTalentBreakdown = [
    {
      college: 'AYUSH Institute of Technology',
      applicants: 186,
      verified: 142,
      shortlisted: 42,
      selected: 12,
      topSkill: 'Python, ML, Health Informatics',
    },
    {
      college: 'Bangalore Institute of Technology (BIT)',
      applicants: 142,
      verified: 98,
      shortlisted: 28,
      selected: 8,
      topSkill: 'Machine Learning, Python, SQL',
    },
    {
      college: 'RV College of Engineering (RVCE)',
      applicants: 124,
      verified: 92,
      shortlisted: 34,
      selected: 10,
      topSkill: 'React, Java, TypeScript',
    },
    {
      college: 'PES University',
      applicants: 110,
      verified: 88,
      shortlisted: 24,
      selected: 7,
      topSkill: 'Java, Spring Boot, Systems',
    },
    {
      college: 'BMS College of Engineering',
      applicants: 78,
      verified: 56,
      shortlisted: 18,
      selected: 5,
      topSkill: 'Python, Django, Full Stack',
    },
    {
      college: 'Ramaiah Institute of Technology (MSRIT)',
      applicants: 44,
      verified: 32,
      shortlisted: 10,
      selected: 3,
      topSkill: 'AWS, Docker, DevOps',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hiring &amp; Skill Intelligence Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Q3 2026 Cohort
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven insights into candidate conversion funnels, skill density, time-to-hire, and institution talent delivery.
          </p>
        </div>

        <Link
          href="/industry/candidates"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <span>Find High-Match Talent &rarr;</span>
        </Link>
      </div>

      {/* Top 4 Performance Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Average Time-to-Hire</span>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>18 Days</span>
            <span className="text-xs text-emerald-400 font-bold">-4 days vs avg</span>
          </div>
          <p className="text-[11px] text-slate-400">From application to offer letter</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Internship &rarr; PPO Rate</span>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-baseline gap-2">
            <span>72%</span>
            <span className="text-xs text-emerald-400 font-bold">+8% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400">12 interns eligible for full-time offer</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Assessment Pass Rate</span>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>86.4%</span>
            <span className="text-xs text-emerald-400 font-bold">Verified pool</span>
          </div>
          <p className="text-[11px] text-slate-400">On coding benchmark evaluation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-slate-400 text-xs font-semibold">College Partner Efficiency</span>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>94%</span>
            <span className="text-xs text-emerald-400 font-bold">Offer acceptance</span>
          </div>
          <p className="text-[11px] text-slate-400">Across 14 technical institutions</p>
        </div>
      </div>

      {/* 1. HIRING FUNNEL VISUALIZATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Recruitment Hiring Funnel
          </h2>
          <p className="text-xs text-slate-400">
            Conversion stages tracking initial applicant volume through verification, interviews, and final hires.
          </p>
        </div>

        <div className="space-y-3">
          {funnelStages.map((stage, idx) => {
            const widthPercentage = (stage.count / funnelStages[0].count) * 100;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{stage.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {stage.pct} of total
                    </span>
                    <span className="font-black text-white font-mono text-sm w-12 text-right">
                      {stage.count}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`${stage.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(4, widthPercentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SKILL DISTRIBUTION & VERIFICATION RATES */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            Candidate Skill Distribution &amp; Verification Ratios
          </h2>
          <p className="text-xs text-slate-400">
            Comparing available candidate claim volume vs audited &amp; verified registry skills in talent pool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillDistribution.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{item.skill}</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  {item.percentage}% Available
                </span>
              </div>

              {/* Progress bar comparing claims vs verified */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Audited Verification Rate:</span>
                  <span className="text-teal-300 font-semibold">{item.verifiedPct}% Formally Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. COLLEGE-WISE TALENT SOURCING TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Institution-Wise Talent Performance
            </h2>
            <p className="text-xs text-slate-400">
              Analysis of applicants, verification integrity, shortlists, and hires per partner college.
            </p>
          </div>

          <Link
            href="/industry/colleges"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Manage Colleges &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">College</th>
                <th className="py-3.5 px-4">Applicants</th>
                <th className="py-3.5 px-4">Verified</th>
                <th className="py-3.5 px-4">Shortlisted</th>
                <th className="py-3.5 px-4">Hired / PPO</th>
                <th className="py-3.5 px-4">Core Skill Strengths</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {collegeTalentBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{row.college}</td>
                  <td className="py-3.5 px-4 font-mono">{row.applicants}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{row.verified}</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300 font-semibold">{row.shortlisted}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-300 bg-emerald-950/20">
                    {row.selected} Hired
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{row.topSkill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
