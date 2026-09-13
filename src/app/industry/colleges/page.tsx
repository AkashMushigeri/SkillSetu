'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { industrySkillDemands } from '@/data/industry/industrySkills';
import {
  School,
  Sparkles,
  Users,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Send,
} from 'lucide-react';

export default function AcademiaCollaborationPage() {
  const { colleges, requestCollegePartnership, showToast } = useIndustry();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Potential'>('All');

  const filteredColleges = colleges.filter((col) => {
    if (activeTab === 'All') return true;
    return col.partnershipStatus === activeTab;
  });

  const activeCount = colleges.filter((c) => c.partnershipStatus === 'Active').length;
  const pendingCount = colleges.filter((c) => c.partnershipStatus === 'Pending').length;
  const potentialCount = colleges.filter((c) => c.partnershipStatus === 'Potential').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academia Collaboration &amp; College Partnerships
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {colleges.length} Institutions Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover technical institutions, align curriculum with verified skills, request campus talent drives, and sponsor challenges.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/industry/colleges/mou"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-brand-teal/40 text-brand-teal font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <School className="w-4 h-4" />
            <span>MoUs &amp; Curriculum Studio</span>
          </Link>

          <Link
            href="/industry/challenges/new"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Post College Challenge</span>
          </Link>
        </div>
      </div>

      {/* 1. INDUSTRY -> COLLEGE SKILL DEMAND SECTION ("What Skills Are We Hiring For?") */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" /> Skill Mapping Intelligence
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              What Skills Are We Hiring For? (Industry Demand Index)
            </h2>
            <p className="text-xs text-slate-300">
              Transparent skill demand signals transmitted directly to partner college academic councils and placement officers.
            </p>
          </div>

          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Problem Statement: Skill Gap Bridging
          </span>
        </div>

        {/* Skill Demand Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {industrySkillDemands.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{item.skill}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.category === 'High Demand'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {item.category}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Industry Need:</span>
                  <span className="font-extrabold text-emerald-400">{item.demandPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full"
                    style={{ width: `${item.demandPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/70">
                <span>Growth: <b className="text-white">{item.growth}</b></span>
                <span>Verified Pool: <b className="text-emerald-300">{item.verifiedTalentPercentage}%</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. College Partnerships Directory */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-1">
            {[
              { id: 'All', label: 'All Colleges', count: colleges.length },
              { id: 'Active', label: 'Active Partnerships', count: activeCount },
              { id: 'Pending', label: 'Pending Requests', count: pendingCount },
              { id: 'Potential', label: 'Discover New Colleges', count: potentialCount },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredColleges.map((col) => {
            const isPartner = col.partnershipStatus === 'Active';
            const isPending = col.partnershipStatus === 'Pending';

            return (
              <div
                key={col.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-white text-base shadow-sm">
                        🏛️
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                          {col.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {col.location}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPartner
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {col.partnershipStatus}
                    </span>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Students</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {col.studentsCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Verified Registry</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {col.verifiedStudentsCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Match TechNova</span>
                      <span className="font-mono font-bold text-teal-300 text-sm">
                        {col.matchingStudentsCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Top Skills in College */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      College Core Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {col.topSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Partnership history if active */}
                  {isPartner && (
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                      <div>
                        Internships: <b className="text-white">{col.internshipsOffered}</b>
                      </div>
                      <div>
                        Hired: <b className="text-emerald-400">{col.studentsHired}</b>
                      </div>
                      <div>
                        Challenges: <b className="text-white">{col.industryChallengesActive}</b>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/industry/candidates?college=${encodeURIComponent(col.name.split(' ')[0])}`}
                    className="flex-1 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recruit Students</span>
                  </Link>

                  {!isPartner && !isPending && (
                    <button
                      onClick={() => requestCollegePartnership(col.id)}
                      className="py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Partnership</span>
                    </button>
                  )}

                  {isPending && (
                    <span className="py-2 px-3 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request Pending</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
