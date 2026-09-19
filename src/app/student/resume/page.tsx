'use client';

import React from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import {
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

export default function ResumePage() {
  const { profile, skills, projects } = useStudent();

  const verifiedSkills = skills.filter((s) => s.isVerified);
  const otherSkills = skills.filter((s) => !s.isVerified && s.progress > 0);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Action Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/student/profile"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Verified ATS-Ready Resume
            </h1>
            <p className="text-xs text-slate-500">
              Generated automatically from your verified SkillSetu credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-teal hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Resume Document */}
      <div className="print-container bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-8 font-sans text-slate-900">
        {/* 1. Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {profile.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SkillSetu Verified Profile
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {profile.degree} &bull; {profile.year} ({profile.gpa}) &bull; {profile.college}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone}
            </span>
            {profile.github && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                  {profile.github.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. Career Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Career Objective &amp; Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {profile.bio || 'Motivated professional focused on software engineering, technology innovation, and applied technical solutions.'}
          </p>
        </div>

        {/* 3. Education */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="flex justify-between items-start text-xs sm:text-sm">
            <div>
              <strong className="font-bold text-slate-900 block">
                {profile.college || 'Institution'}
              </strong>
              <span className="text-slate-600">
                {profile.degree || 'Degree Program'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 block">{profile.year || 'Academic Year'}</span>
              {profile.gpa && (
                <span className="text-emerald-700 font-bold">
                  {profile.gpa.toLowerCase().includes('cgpa') || profile.gpa.includes('/')
                    ? profile.gpa
                    : `CGPA: ${profile.gpa} / 10`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Skills & Verified Competencies */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Skills &amp; Technical Competencies
          </h2>

          {/* Verified Badges Section */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Competencies (Proctored on SkillSetu):
            </span>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {sk.name} &bull; {sk.level} (✓ Verified)
                </span>
              ))}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="space-y-1 pt-1">
            <span className="text-xs font-bold text-slate-700">Additional Working Proficiencies:</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {otherSkills.map((s) => s.name).join(' &bull; ')} &bull; Git &amp; GitHub &bull; REST APIs &bull; Data Structures &bull; Object-Oriented Design &bull; Agile Scrum.
            </p>
          </div>
        </div>

        {/* 5. Projects */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Academic &amp; Industry Projects
          </h2>
          <div className="space-y-4 text-xs sm:text-sm">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {proj.techStack.join(', ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Experience & Relevant Work */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Experience &amp; Industry Engagements
          </h2>
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between">
                <strong className="font-bold text-slate-900">
                  Open Source Contributor &amp; Student Researcher
                </strong>
                <span className="text-slate-500">2025 &ndash; Present</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Contributed bug fixes and responsive layout patches to open healthcare repositories; participated in hackathon sprints focusing on AYUSH practitioner indexing.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Achievements */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Honors &amp; Extracurriculars
          </h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
            <li>Smart India Hackathon Finalist (SIH 2026) &mdash; Team GAT054</li>
            <li>Awarded SkillSetu Verified Developer Badge in Web and Python tracks</li>
            <li>Member of RVCE Open Source Software Development Club</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
