'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { getOpportunityTypeBadgeColor } from '@/lib/styleUtils';
import {
  FileCheck2,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Paperclip
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications } = useStudent();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected'>('All');

  const filteredApps = applications.filter(
    (app) => statusFilter === 'All' || app.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: CheckCircle2,
          color: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: AlertCircle,
          color: 'text-amber-600 dark:text-amber-400',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          icon: XCircle,
          color: 'text-rose-600 dark:text-rose-400',
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          icon: Clock,
          color: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            Application Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Applications ({applications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track real-time candidate review status, company evaluation, and recruiter responses.
          </p>
        </div>

        <Link
          href="/student/opportunities"
          className="px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply to More Roles</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected'] as const).map((st) => {
          const count = st === 'All' ? applications.length : applications.filter((a) => a.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === st
                  ? 'bg-brand-dark dark:bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === st ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-card">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No applications in this category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Explore open internships, micro-sprints, and tasks to apply with your verified skills.
            </p>
            <Link
              href="/student/opportunities"
              className="inline-block mt-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-dark"
            >
              Discover Opportunities
            </Link>
          </div>
        ) : (
          filteredApps.map((app) => {
            const statusConfig = getStatusBadge(app.status);
            const StatusIcon = statusConfig.icon;
            const typeStyle = getOpportunityTypeBadgeColor(app.type);

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                    >
                      {app.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.bg}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {app.status}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Applied on {app.appliedDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.opportunityTitle}</h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company} &bull; {app.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{app.stipend}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-teal dark:text-teal-400" />
                      Match: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{app.matchScoreAtApply}%</strong>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      {app.resumeUsed}
                    </span>
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6 shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">Status details:</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {app.status === 'Shortlisted'
                      ? 'Recruiter contact pending'
                      : app.status === 'Under Review'
                      ? 'Review in progress'
                      : app.status === 'Rejected'
                      ? 'Position filled'
                      : 'Submitted'}
                  </p>
                  <Link
                    href="/student/opportunities"
                    className="text-xs font-bold text-brand-teal dark:text-teal-400 hover:underline flex items-center gap-0.5"
                  >
                    View Role <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
