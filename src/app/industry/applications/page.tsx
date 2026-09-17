'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { ApplicationModal } from '@/components/industry/ApplicationModal';
import { ScheduleInterviewModal } from '@/components/industry/ScheduleInterviewModal';
import { IndustryApplication } from '@/types/industry';
import {
  FileSpreadsheet,
  Search,
  Users,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, candidates, jobs } = useIndustry();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<IndustryApplication | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewAppTarget, setInterviewAppTarget] = useState<IndustryApplication | null>(null);

  const tabs = ['All', 'New Application', 'Screening', 'Shortlisted', 'Technical Interview', 'Selected', 'Rejected'];

  const filteredApplications = applications.filter((app) => {
    if (activeTab !== 'All' && app.stage !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = app.candidateName.toLowerCase().includes(q);
      const matchesJob = app.jobTitle.toLowerCase().includes(q);
      const matchesCollege = app.candidateCollege.toLowerCase().includes(q);
      if (!matchesName && !matchesJob && !matchesCollege) return false;
    }
    return true;
  });

  const handleOpenInterview = (app: IndustryApplication) => {
    setSelectedApplication(null);
    setInterviewAppTarget(app);
    setInterviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-700 border border-blue-500/40 font-mono">
              {applications.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Review student applications across verified skill matches, progress candidate stages, and schedule interviews.
          </p>
        </div>

        <Link
          href="/industry/pipeline"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start md:self-auto transition-colors"
        >
          <span>View Kanban Pipeline Board &rarr;</span>
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-card">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => {
            const count =
              tab === 'All'
                ? applications.length
                : applications.filter((a) => a.stage === tab).length;

            const isSelected = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
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
            placeholder="Search candidate, role, college..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Candidate</th>
                <th className="py-4 px-4">Role Applied</th>
                <th className="py-4 px-4">Match %</th>
                <th className="py-4 px-4">Matched Verified Skills</th>
                <th className="py-4 px-4">College</th>
                <th className="py-4 px-4">Applied</th>
                <th className="py-4 px-4">Stage</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.candidateAvatar}
                        alt={app.candidateName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{app.candidateName}</p>
                        <p className="text-[10px] text-slate-500">{app.candidateEmail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{app.jobTitle}</p>
                    <span className="text-[10px] text-brand-teal font-medium">{app.jobType}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-emerald-800 text-xs px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      {app.matchScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {app.matchedSkills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">
                    {app.candidateCollege}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{app.appliedDate}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.stage === 'Shortlisted'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : app.stage === 'Technical Interview' || app.stage === 'HR Interview'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : app.stage === 'Selected' || app.stage === 'Hired'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : app.stage === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.stage}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition-colors border border-slate-200 shadow-xs"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onOpenScheduleInterview={handleOpenInterview}
      />

      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => {
          setInterviewModalOpen(false);
          setInterviewAppTarget(null);
        }}
        candidate={
          interviewAppTarget ? candidates.find((c) => c.id === interviewAppTarget.candidateId) : null
        }
        job={interviewAppTarget ? jobs.find((j) => j.id === interviewAppTarget.jobId) : null}
      />
    </div>
  );
}
