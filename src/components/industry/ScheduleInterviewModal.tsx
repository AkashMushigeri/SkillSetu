'use client';

import React, { useState } from 'react';
import { useIndustry } from '@/context/IndustryContext';
import { Candidate, IndustryJob } from '@/types/industry';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
  job?: IndustryJob | null;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidate,
  job,
}) => {
  const { scheduleNewInterview, candidates, jobs, showToast } = useIndustry();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidate?.id || (candidates[0]?.id ?? ''));
  const [selectedJobId, setSelectedJobId] = useState<string>(job?.id || (jobs[0]?.id ?? ''));
  const [round, setRound] = useState<'Technical Interview' | 'HR Interview' | 'Leadership Round' | 'Coding Assessment Review'>(
    'Technical Interview'
  );
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('02:30 PM');
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/technova-eval');
  const [interviewers, setInterviewers] = useState('Rahul Verma (HR Lead), Technical Lead');
  const [notes, setNotes] = useState('Review verified skill assessment scores and evaluate live coding problem.');

  if (!isOpen) return null;

  const currentCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidate || candidates[0];
  const currentJob = jobs.find((j) => j.id === selectedJobId) || job || jobs[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCandidate || !currentJob) {
      showToast('Please select candidate and role', 'error');
      return;
    }

    scheduleNewInterview({
      candidateId: currentCandidate.id,
      candidateName: currentCandidate.name,
      candidateAvatar: currentCandidate.avatar,
      candidateCollege: currentCandidate.college,
      jobId: currentJob.id,
      jobTitle: currentJob.title,
      round,
      date,
      time,
      mode,
      meetingLink: mode === 'Online' ? meetingLink : undefined,
      interviewers: interviewers.split(',').map((s) => s.trim()),
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Schedule Candidate Interview</h3>
              <p className="text-xs text-slate-500">Book interview round &amp; auto-generate invite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Candidate Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Candidate</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
            >
              {candidates.map((cand) => (
                <option key={cand.id} value={cand.id}>
                  {cand.name} &bull; {cand.college} ({cand.matchScore || 90}% match)
                </option>
              ))}
            </select>
          </div>

          {/* Job Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Role / Job Opportunity</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} &bull; {j.department}
                </option>
              ))}
            </select>
          </div>

          {/* Round & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Interview Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
              >
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Coding Assessment Review">Coding Assessment Review</option>
                <option value="Leadership Round">Leadership Round</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('Online')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-all ${
                    mode === 'Online'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Online (Meet)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('Offline')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-all ${
                    mode === 'Offline'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  On-site Office
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                placeholder="e.g. 02:30 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
              />
            </div>
          </div>

          {/* Online link */}
          {mode === 'Online' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Meeting Link</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs font-mono"
              />
            </div>
          )}

          {/* Interviewers */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Interviewers</label>
            <input
              type="text"
              value={interviewers}
              onChange={(e) => setInterviewers(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-teal text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Send Invite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
