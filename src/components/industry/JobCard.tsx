'use client';

import React from 'react';
import Link from 'next/link';
import { IndustryJob } from '@/types/industry';
import { useIndustry } from '@/context/IndustryContext';
import {
  Briefcase,
  MapPin,
  Users,
  Sparkles,
  Calendar,
  ChevronRight,
  Search,
  CheckCircle2,
  Copy,
  Clock,
} from 'lucide-react';

interface JobCardProps {
  job: IndustryJob;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { duplicateJob } = useIndustry();

  const isActivelyHiring = job.status === 'Active';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActivelyHiring ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isActivelyHiring
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {job.status === 'Active' ? 'Actively Hiring' : job.status}
              </span>
              <span className="text-[10px] text-slate-400">&bull; {job.jobType}</span>
            </div>

            <h3 className="font-bold text-white text-lg mt-1 group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {job.location} ({job.workMode})
              </span>
              <span>&bull;</span>
              <span className="font-mono text-slate-200 font-medium">{job.salaryRange}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">Openings</span>
            <span className="text-base font-extrabold text-white font-mono">{job.openings}</span>
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((req, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1"
              >
                <span>{req.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold">({req.level[0]})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Applications</span>
            <span className="text-lg font-bold text-white font-mono flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              {job.applicationsCount}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Strong Matches</span>
            <span className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {job.strongMatchesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <Link
          href={`/industry/candidates?skill=${encodeURIComponent(
            job.requiredSkills.map((s) => s.name).join(',')
          )}`}
          className="flex-1 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>Find Candidates</span>
        </Link>

        <Link
          href="/industry/applications"
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <span>Applications</span>
        </Link>

        <button
          onClick={() => duplicateJob(job.id)}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
          title="Duplicate Job"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
