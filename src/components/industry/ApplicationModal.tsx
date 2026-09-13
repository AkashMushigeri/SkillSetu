'use client';

import React, { useState } from 'react';
import { IndustryApplication, ApplicationStage } from '@/types/industry';
import { useIndustry } from '@/context/IndustryContext';
import { SkillBadge } from './SkillBadge';
import {
  X,
  User,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  FileText,
  Download,
  FolderGit2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ApplicationModalProps {
  application: IndustryApplication | null;
  onClose: () => void;
  onOpenScheduleInterview: (app: IndustryApplication) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  application,
  onClose,
  onOpenScheduleInterview,
}) => {
  const { candidates, moveApplicationStage, rejectApplication, showToast } = useIndustry();
  const [activeTab, setActiveTab] = useState<'details' | 'resume' | 'history'>('details');
  const [recruiterNote, setRecruiterNote] = useState('');

  if (!application) return null;

  const candidate = candidates.find((c) => c.id === application.candidateId) || candidates[0];

  const stages: ApplicationStage[] = [
    'New Application',
    'Screening',
    'Shortlisted',
    'Technical Interview',
    'HR Interview',
    'Selected',
    'Offer Sent',
    'Hired',
  ];

  const handleNextStage = () => {
    const currentIndex = stages.indexOf(application.stage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      moveApplicationStage(application.id, nextStage, recruiterNote || `Advanced to ${nextStage}`);
      setRecruiterNote('');
    }
  };

  const handleReject = () => {
    rejectApplication(application.id, recruiterNote || 'Application did not meet requirements.');
    setRecruiterNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg">{candidate.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  {application.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Applying for: <span className="text-emerald-400 font-semibold">{application.jobTitle}</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>{candidate.college}</span> &bull; <span>{candidate.education.degree}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                application.stage === 'Hired' || application.stage === 'Selected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : application.stage === 'Rejected'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {application.stage}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-900 text-xs font-semibold">
          {[
            { id: 'details', label: 'Candidate & Skills Evaluation' },
            { id: 'resume', label: 'Resume Preview' },
            { id: 'history', label: 'Application Pipeline History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Verified Skills Section */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified Skill Assessment Badges
                  </h4>
                  <span className="text-[10px] text-emerald-400">
                    {candidate.skills.filter((s) => s.verified).length} Skills Formally Verified
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {candidate.skills.map((skill, idx) => (
                    <SkillBadge key={idx} skill={skill} size="md" />
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-teal-400" />
                  Student Portfolio Projects
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {candidate.projects.map((proj, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="font-bold text-white text-xs">{proj.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Notes & Actions */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block font-bold text-white text-xs">Recruiter Assessment Note</label>
                <textarea
                  rows={2}
                  value={recruiterNote}
                  onChange={(e) => setRecruiterNote(e.target.value)}
                  placeholder="Enter evaluation notes before moving candidate to the next hiring stage..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm font-sans">{candidate.name} — Resume</h4>
                  <p className="text-[11px] text-slate-400">{candidate.email} &bull; {candidate.phone}</p>
                </div>
                <button
                  onClick={() => showToast('Downloading candidate verified resume PDF...', 'success')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 text-xs transition-colors font-sans"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>

              <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-xs">
                {candidate.resumeText}
              </pre>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Application Pipeline Timeline
              </h4>
              <div className="space-y-2">
                {application.history.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{ev.stage}</span>
                        <span className="text-[10px] text-slate-400">{ev.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">Updated by: {ev.updatedBy}</p>
                      {ev.note && <p className="text-[11px] text-emerald-400/90 italic">"{ev.note}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Application</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenScheduleInterview(application)}
              className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 font-bold transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>

            {application.stage !== 'Hired' && (
              <button
                onClick={handleNextStage}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5"
              >
                <span>Move to Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
