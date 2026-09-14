'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { CandidateCard } from '@/components/industry/CandidateCard';
import {
  BookmarkCheck,
  Search,
  Sparkles,
  Users,
  FolderHeart,
  Briefcase,
  ExternalLink,
  Plus,
} from 'lucide-react';

export default function TalentPoolPage() {
  const { candidates } = useIndustry();

  const categories = [
    'All Saved',
    'Top Matches',
    'Saved Candidates',
    'Potential Candidates',
    'Previously Interviewed',
    'Future Hiring',
  ] as const;

  const [activeCategory, setActiveCategory] = useState<string>('All Saved');

  // Filter candidates who are saved in talent pool
  const savedCandidates = candidates.filter((c) => {
    if (!c.savedToTalentPool) return false;
    if (activeCategory === 'All Saved') return true;
    return c.talentPoolCategory === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Talent Pool &amp; Sourced Candidates
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-700 border border-purple-500/40">
              {candidates.filter((c) => c.savedToTalentPool).length} Bookmarked
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Curate pipelines of pre-evaluated students and potential hires across graduation cohorts.
          </p>
        </div>

        <Link
          href="/industry/candidates"
          className="px-4 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start md:self-auto transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Source More Talent</span>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        {categories.map((cat) => {
          const count = candidates.filter(
            (c) => c.savedToTalentPool && (cat === 'All Saved' || c.talentPoolCategory === cat)
          ).length;

          const isSelected = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidates List */}
      {savedCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-card">
          <FolderHeart className="w-10 h-10 text-emerald-600/60 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No candidates in "{activeCategory}"</h3>
          <p className="text-xs max-w-md mx-auto leading-relaxed text-slate-600">
            Bookmark high-potential candidates during candidate discovery to build your organization's future hiring pipelines.
          </p>
          <Link
            href="/industry/candidates"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover Candidates</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
