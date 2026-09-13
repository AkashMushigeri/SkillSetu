'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { InternshipCard } from '@/components/industry/InternshipCard';
import {
  GraduationCap,
  Plus,
  Search,
  Award,
  TrendingUp,
  Sparkles,
  School,
  CheckCircle2,
} from 'lucide-react';

export default function IndustryInternshipsPage() {
  const { internships } = useIndustry();
  const [filterStartupOnly, setFilterStartupOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInternships = internships.filter((item) => {
    if (filterStartupOnly && !item.isStartupFriendly) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesDept = item.department.toLowerCase().includes(q);
      const matchesSkill = item.requiredSkills.some((s) => s.name.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDept && !matchesSkill) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Internship Opportunities &amp; Sprints
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              {internships.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empower 3rd &amp; 4th year undergraduates with hands-on startup micro-internships, mentorship, and PPO pathways.
          </p>
        </div>

        <Link
          href="/industry/internships/new"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Internship</span>
        </Link>
      </div>

      {/* Startup Priority Philosophy Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-dark/50 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
          <Award className="w-3.5 h-3.5" />
          Startup Internship Priority Program
        </div>
        <h2 className="text-lg font-bold text-white">
          Academia &rarr; Startup Experience &rarr; Industry Pathway
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Students in their 3rd year or beginning of 4th year gain foundational production engineering experience at high-velocity startups before large enterprise hiring cycles begin.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStartupOnly(!filterStartupOnly)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterStartupOnly
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student-Friendly Opportunities Only</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search internships..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Internships */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInternships.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>
    </div>
  );
}
