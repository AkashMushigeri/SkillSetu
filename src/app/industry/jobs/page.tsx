'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { JobCard } from '@/components/industry/JobCard';
import {
  Briefcase,
  Plus,
  Search,
  Users,
  Sparkles,
  Calendar,
  Copy,
  XCircle,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function IndustryJobsPage() {
  const { jobs, closeJob, duplicateJob } = useIndustry();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Draft' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter((job) => {
    if (activeTab !== 'All' && job.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesDept = job.department.toLowerCase().includes(q);
      const matchesSkill = job.requiredSkills.some((s) => s.name.toLowerCase().includes(q));
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Job Postings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 font-mono">
              {jobs.filter((j) => j.status === 'Active').length} Active
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Create, monitor, and configure skill requirements for full-time engineering and analyst roles.
          </p>
        </div>

        <Link
          href="/industry/jobs/new"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-card">
        <div className="flex items-center gap-1">
          {(['All', 'Active', 'Draft', 'Closed'] as const).map((tab) => {
            const count = tab === 'All' ? jobs.length : jobs.filter((j) => j.status === tab).length;
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs or skills..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-2 shadow-card">
          <p className="font-semibold text-slate-900 text-sm">No job postings found</p>
          <p className="text-xs">Create a new job posting with verified skill requirements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
