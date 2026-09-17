'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { ApplicationStage, IndustryApplication } from '@/types/industry';
import { ApplicationModal } from '@/components/industry/ApplicationModal';
import { ScheduleInterviewModal } from '@/components/industry/ScheduleInterviewModal';
import {
  KanbanSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';

export default function HiringPipelinePage() {
  const { applications, moveApplicationStage, candidates, jobs } = useIndustry();

  const [selectedApplication, setSelectedApplication] = useState<IndustryApplication | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewAppTarget, setInterviewAppTarget] = useState<IndustryApplication | null>(null);

  const stages: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'New Application', label: 'New Application', color: 'border-slate-200 bg-slate-100 text-slate-800' },
    { id: 'Screening', label: 'Screening', color: 'border-slate-200 bg-slate-100 text-slate-800' },
    { id: 'Shortlisted', label: 'Shortlisted', color: 'border-purple-200 bg-purple-50 text-purple-900' },
    { id: 'Technical Interview', label: 'Technical Interview', color: 'border-blue-200 bg-blue-50 text-blue-900' },
    { id: 'HR Interview', label: 'HR Interview', color: 'border-cyan-200 bg-cyan-50 text-cyan-900' },
    { id: 'Selected', label: 'Selected', color: 'border-teal-200 bg-teal-50 text-teal-900' },
    { id: 'Offer Sent', label: 'Offer Sent', color: 'border-amber-200 bg-amber-50 text-amber-900' },
    { id: 'Hired', label: 'Hired 🎉', color: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  ];

  const handleNextStage = (app: IndustryApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stages.findIndex((s) => s.id === app.stage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const next = stages[currentIndex + 1].id;
      moveApplicationStage(app.id, next);
    }
  };

  const handlePrevStage = (app: IndustryApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stages.findIndex((s) => s.id === app.stage);
    if (currentIndex > 0) {
      const prev = stages[currentIndex - 1].id;
      moveApplicationStage(app.id, prev);
    }
  };

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
              Hiring Pipeline
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-800 border border-purple-200">
              Interactive Kanban
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Track candidates progressing through screening, technical assessments, HR rounds, and final job offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/industry/interviews"
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Scheduled Interviews</span>
          </Link>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-6 pt-2">
        <div className="flex gap-4 min-w-[1400px]">
          {stages.map((stage, idx) => {
            const stageApps = applications.filter((a) => a.stage === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col max-h-[75vh] shadow-card overflow-hidden"
              >
                {/* Stage Header */}
                <div
                  className={`p-3.5 border-b flex items-center justify-between font-bold text-xs ${stage.color}`}
                >
                  <span className="font-bold">{stage.label}</span>
                  <span className="w-5 h-5 rounded-full bg-white/90 text-slate-800 border border-slate-200 font-mono text-[10px] flex items-center justify-center font-bold shadow-xs">
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards in Stage */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[11px]">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApplication(app)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-all shadow-xs hover:shadow-card space-y-2.5 group"
                      >
                        {/* Header: Avatar, Name, Match */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={app.candidateAvatar}
                              alt={app.candidateName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
                                {app.candidateName}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                {app.candidateCollege}
                              </p>
                            </div>
                          </div>

                          <span className="font-mono font-bold text-emerald-700 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 shrink-0">
                            {app.matchScore}%
                          </span>
                        </div>

                        {/* Job Role applied */}
                        <div className="text-[11px] text-slate-700 font-medium">
                          {app.jobTitle}
                        </div>

                        {/* Matched skills chips */}
                        <div className="flex flex-wrap gap-1">
                          {app.matchedSkills.slice(0, 3).map((s, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-0.5 font-medium"
                            >
                              ✓ {s}
                            </span>
                          ))}
                        </div>

                        {/* Stage Progress Controls */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          {idx > 0 ? (
                            <button
                              onClick={(e) => handlePrevStage(app, e)}
                              className="p-1 hover:text-slate-900 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                              title="Move to Previous Stage"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          ) : (
                            <span />
                          )}

                          {idx < stages.length - 1 && (
                            <button
                              onClick={(e) => handleNextStage(app, e)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-bold flex items-center gap-1 transition-all"
                            >
                              <span>Move &rarr; {stages[idx + 1].id.split(' ')[0]}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
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
