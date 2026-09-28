'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { ScheduleInterviewModal } from '@/components/industry/ScheduleInterviewModal';
import { AIInterviewModal } from '@/components/AIInterviewModal';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  ExternalLink,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function InterviewsPage() {
  const { interviews, candidates, jobs } = useIndustry();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedCandidateForAI, setSelectedCandidateForAI] = useState<{ name: string; title: string }>({
    name: 'Akash Mushigeri',
    title: 'Full Stack Engineering Candidate',
  });
  const [activeTab, setActiveTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');

  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const completedInterviews = interviews.filter((i) => i.status === 'Completed');

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === 'Upcoming') return i.status === 'Scheduled';
    if (activeTab === 'Completed') return i.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
              {upcomingInterviews.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Coordinate technical evaluations, coding assessment reviews, and culture fit rounds with students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              setSelectedCandidateForAI({
                name: candidates[0]?.name || 'Akash Mushigeri',
                title: jobs[0]?.title || 'Full Stack Engineer',
              });
              setAiModalOpen(true);
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Launch AI Interview Room (Voice &amp; Mic)</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Interview</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl w-fit shadow-xs">
        {(['All', 'Upcoming', 'Completed'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const count =
            tab === 'All'
              ? interviews.length
              : tab === 'Upcoming'
              ? upcomingInterviews.length
              : completedInterviews.length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span className="text-[10px] font-mono opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInterviews.map((int) => {
          const isCompleted = int.status === 'Completed';

          return (
            <div
              key={int.id}
              className={`bg-white border rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between ${
                isCompleted ? 'border-slate-200 opacity-90' : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Candidate & Round Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={int.candidateAvatar}
                      alt={int.candidateName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{int.candidateName}</h3>
                      <p className="text-[11px] text-slate-500">{int.candidateCollege}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{int.jobTitle}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Scheduled'}
                  </span>
                </div>

                {/* Round details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{int.round}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                      {int.mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {int.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {int.time}
                    </span>
                  </div>

                  {int.score && (
                    <div className="pt-1 flex items-center justify-between text-[11px] border-t border-slate-200">
                      <span className="text-slate-500">Assessment Score:</span>
                      <span className="font-bold text-emerald-700 font-mono">{int.score}%</span>
                    </div>
                  )}
                </div>

                {/* Interviewers & Notes */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Interviewers:
                  </span>
                  <p className="text-slate-700 text-[11px]">{int.interviewers.join(', ')}</p>
                  {int.notes && (
                    <p className="text-[10px] text-slate-500 italic pt-1 line-clamp-2">
                      "{int.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                {int.meetingLink ? (
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Join Google Meet</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>On-site TechNova Bengaluru Lab</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        candidate={candidates[0]}
        job={jobs[0]}
      />

      {/* AI Interview Room Modal */}
      <AIInterviewModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        candidateName={selectedCandidateForAI.name}
        roleTitle={selectedCandidateForAI.title}
      />
    </div>
  );
}
