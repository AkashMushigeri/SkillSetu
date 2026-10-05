'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Opportunity } from '@/types/student';
import { useStudent } from '@/context/StudentContext';
import {
  X,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Paperclip
} from 'lucide-react';

interface ApplyModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ opportunity, onClose }) => {
  const { profile, skills, submitApplication } = useStudent();
  const resumeFileName = `${(profile?.name || 'Candidate').replace(/\s+/g, '_')}_Resume_2026.pdf`;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [coverNote, setCoverNote] = useState(
    'I am excited to apply for this role. My verified skillset, engineering background, and hands-on projects match your requirements.'
  );
  const [isMounted, setIsMounted] = useState(false);

  // Portals need a real DOM node, which does not exist during SSR.
  useEffect(() => setIsMounted(true), []);

  if (!opportunity || !isMounted) return null;

  const verifiedSkills = skills.filter((s) => s.isVerified);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication(opportunity.id);
    setIsSubmitted(true);
  };

  // Rendered into <body> rather than in place: the page is wrapped in
  // .student-page-transition, which creates a stacking context, so an in-place
  // `fixed z-50` overlay painted below the z-40 header and bottom nav instead of
  // over them. `my-auto` on the card keeps it centred while `items-start` on the
  // overlay lets the top of a tall card still be reached by scrolling.
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal dark:text-teal-400">
              Application Submission
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {opportunity.company} &bull; {opportunity.stipend}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Application submitted successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Your verified SkillSetu credentials, resume, and skills report have been sent to <strong>{opportunity.company}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
              <div className="flex justify-between">
                <span>Application Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Under Review</span>
              </div>
              <div className="flex justify-between">
                <span>Match Score at Apply:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{opportunity.matchScore}% Match</span>
              </div>
              <div className="flex justify-between">
                <span>Attached Resume:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{resumeFileName}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/student/applications"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-all"
              >
                Track in Applications
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Back to Opportunities
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Student Info Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    {profile.name
                      ? profile.name
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'ST'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">{profile.name || 'Student'}</span>
                    <span className="text-slate-500 dark:text-slate-400">{profile.degree || 'Candidate'}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                  {opportunity.matchScore}% Match
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Attached Verified Skills:</span>
                {verifiedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {verifiedSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {sk.name} ✓
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                    No verified skills attached yet
                  </span>
                )}
              </div>
            </div>

            {/* Resume Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Candidate Resume
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700">
                <div className="flex items-center gap-2 text-xs">
                  <Paperclip className="w-4 h-4 text-brand-teal dark:text-teal-400" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{resumeFileName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">SkillSetu ATS-Verified Format</span>
                  </div>
                </div>
                <Link
                  href="/student/resume"
                  target="_blank"
                  className="text-xs text-brand-teal dark:text-teal-400 font-bold hover:underline"
                >
                  Preview
                </Link>
              </div>
            </div>

            {/* Note to Hiring Manager */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Note to Hiring Team (Optional)
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-teal hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
