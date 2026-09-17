'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Users,
  Award,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Zap,
  Code2,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { challenges, submissions, updateSubmissionStatus, fastTrackSubmissionToInterview } = useIndustry();

  const challengeId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const challenge = challenges.find((c) => c.id === challengeId) || challenges[0];

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubForReview, setSelectedSubForReview] = useState<any | null>(null);

  // Filter submissions for this challenge
  const challengeSubmissions = submissions.filter((s) => s.challengeId === challenge?.id || s.challengeId === 'chal-01');

  const filteredSubmissions = challengeSubmissions.filter((sub) => {
    const matchesSearch =
      sub.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.teamLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.college.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'fast-tracked') return matchesSearch && sub.status === 'Interview Fast-Tracked';
    if (statusFilter === 'winners') return matchesSearch && sub.status === 'Winner';
    if (statusFilter === 'shortlisted') return matchesSearch && sub.status === 'Shortlisted';
    return matchesSearch;
  });

  if (!challenge) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Challenge not found.</p>
        <Link href="/industry/challenges" className="text-brand-teal hover:underline mt-2 inline-block">
          Back to Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Link & Title */}
      <div>
        <Link
          href="/industry/challenges"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-3 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Challenges</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {challenge.title}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {challenge.difficulty} Difficulty
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {challenge.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/industry/challenges/new"
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              Post Another Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Challenge Specifications Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Prize Pool &amp; Reward</span>
            <span className="text-xs font-semibold text-emerald-700 mt-1 block">{challenge.prize}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Submission Deadline</span>
            <span className="text-xs font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {challenge.deadline}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Submissions</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block font-mono">
              {challengeSubmissions.length} Teams Evaluated
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fast-Tracked to Interview</span>
            <span className="text-base font-extrabold text-amber-700 mt-1 block font-mono">
              {challengeSubmissions.filter((s) => s.status === 'Interview Fast-Tracked').length} Candidates
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Problem Statement:</span>
          <p className="text-xs text-slate-700 leading-relaxed">{challenge.problemStatement}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-500">Target Competencies:</span>
          {challenge.requiredSkills.map((sk, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Submissions Section Header & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>Evaluated Student Submissions &amp; Code Benchmark</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated test suite reports, semantic code quality metrics, and 1-click recruitment pipeline fast-tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or college..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'fast-tracked', label: 'Interview Fast-Tracked' },
            { id: 'winners', label: 'Winners' },
            { id: 'shortlisted', label: 'Shortlisted' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-all space-y-4 text-slate-900"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Team Lead & College */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={sub.teamLeadAvatar}
                    alt={sub.teamLead}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{sub.teamName}</h3>
                      <span className="text-xs text-slate-500">· Lead: {sub.teamLead}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          sub.status === 'Interview Fast-Tracked'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : sub.status === 'Winner'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : sub.status === 'Shortlisted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{sub.college}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">Submitted on {sub.submissionDate}</span>
                  </div>
                </div>

                {/* Benchmark Metrics */}
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Benchmark Score</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">{sub.score} / 100</span>
                  </div>

                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Unit Test Pass Rate</span>
                    <span className="text-xs font-bold text-slate-900 font-mono mt-1 block">{sub.testPassRate}</span>
                  </div>
                </div>
              </div>

              {/* AI Evaluation Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-emerald-800">Automated Technical Audit: </span>
                  {sub.aiSummary}
                </div>
              </div>

              {/* Competencies Demonstrated & External Links */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Skills Verified:</span>
                  {sub.skillsDemonstrated.map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={sub.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Repo</span>
                  </a>

                  {sub.liveDemoUrl && (
                    <a
                      href={sub.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {sub.status !== 'Interview Fast-Tracked' ? (
                    <button
                      onClick={() => fastTrackSubmissionToInterview(sub.id)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Fast-Track to Interview</span>
                    </button>
                  ) : (
                    <span className="px-3 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-700" />
                      <span>Interview Booked</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
