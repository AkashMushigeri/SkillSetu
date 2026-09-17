'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { SkillBadge } from '@/components/industry/SkillBadge';
import { SkillMatchBreakdown } from '@/components/industry/SkillMatchBreakdown';
import { ScheduleInterviewModal } from '@/components/industry/ScheduleInterviewModal';
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Globe,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params?.id as string;

  const {
    candidates,
    jobs,
    toggleSaveCandidate,
    shortlistCandidateForJob,
    getCandidateMatchBreakdown,
    showToast,
  } = useIndustry();

  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);

  const candidate = candidates.find((c) => c.id === candidateId) || candidates[0];
  const isSaved = candidate.savedToTalentPool;

  // Calculate matching breakdown against primary active role (AI/ML Engineer)
  const matchBreakdown = getCandidateMatchBreakdown(candidate.id, jobs[0].id);

  const handleShortlist = () => {
    shortlistCandidateForJob(candidate.id, jobs[0].id, jobs[0].title);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveCandidate(candidate.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved in Talent Pool' : 'Save Candidate'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6 text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {candidate.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  {matchBreakdown.overall}% Match with TechNova Roles
                </span>
              </div>

              <p className="text-sm font-semibold text-emerald-700">{candidate.role}</p>

              <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{candidate.education.degree}</span> &bull; <span>{candidate.college}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {candidate.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.email}
                </span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-semibold">{candidate.availability}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleShortlist}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Shortlist Candidate</span>
            </button>

            <button
              onClick={() => setInterviewModalOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>

            <button
              onClick={() => setResumeModalOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>View Resume</span>
            </button>
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          {candidate.github && (
            <a
              href={candidate.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          )}
          {candidate.linkedin && (
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {candidate.portfolio && (
            <a
              href={candidate.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Portfolio Website</span>
            </a>
          )}
          <span className="ml-auto text-[11px] text-slate-500">
            Current CGPA: <b className="text-white font-mono">{candidate.education.cgpa}</b> / 10.0
          </span>
        </div>
      </div>

      {/* Grid: Left column Details, Right column Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Verified Skills, Projects, Experience, Education */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verified Skills */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Verified Skills &amp; Assessments
                </h3>
                <p className="text-xs text-slate-500">
                  Scores audited and verified by National Skill Registry &amp; Institutional Labs.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {candidate.skills.filter((s) => s.verified).length} Badges Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    skill.verified
                      ? 'bg-slate-50 border-emerald-200'
                      : 'bg-slate-50/50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      {skill.name}
                      {skill.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Level: <span className="text-slate-800 font-semibold">{skill.level}</span>
                    </p>
                    {skill.verifiedBy && (
                      <p className="text-[10px] text-slate-400">{skill.verifiedBy}</p>
                    )}
                  </div>

                  <div className="text-right">
                    {skill.verified ? (
                      <div>
                        <span className="text-lg font-black text-brand-dark font-mono">
                          {skill.score}%
                        </span>
                        <span className="text-[9px] block uppercase font-bold text-emerald-700">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded">
                        Self-Reported
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-teal-600" />
                Featured Engineering Projects
              </h3>
              <span className="text-xs text-slate-500">{candidate.projects.length} Projects</span>
            </div>

            <div className="space-y-4">
              {candidate.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{project.title}</h4>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {project.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience / Sprints */}
          {candidate.experience.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 text-slate-900">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Internship &amp; Research Experience
              </h3>

              <div className="space-y-4">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                        <p className="text-xs text-brand-teal font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Achievements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-amber-600" />
              Certifications &amp; Hackathon Accolades
            </h3>

            <div className="space-y-2">
              {candidate.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{cert}</span>
                </div>
              ))}
              {candidate.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Matching Engine Radar Breakdown & Education */}
        <div className="lg:col-span-5 space-y-6">
          {/* Candidate Matching Engine Breakdown */}
          <SkillMatchBreakdown match={matchBreakdown} candidateName={candidate.name} />

          {/* Education Details Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Institutional Background
            </h3>

            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <span className="text-slate-500 block text-[11px]">College / University:</span>
                <span className="font-bold text-slate-900 text-sm">{candidate.college}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Degree &amp; Branch:</span>
                <span>{candidate.education.degree}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">Graduation:</span>
                  <span className="font-mono font-bold text-slate-900">{candidate.education.graduationYear}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Current Standing:</span>
                  <span className="font-semibold text-emerald-700">{candidate.education.currentYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Viewer Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">{candidate.name} — Verified Resume</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Downloading verified resume PDF...', 'success')}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors font-semibold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-800 font-mono bg-slate-50 leading-relaxed whitespace-pre-wrap">
              {candidate.resumeText}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidate={candidate}
        job={jobs[0]}
      />
    </div>
  );
}
