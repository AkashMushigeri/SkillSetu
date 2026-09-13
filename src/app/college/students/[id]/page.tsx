'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCollege } from '@/context/CollegeContext';
import {
  User,
  ArrowLeft,
  GraduationCap,
  BadgeCheck,
  Briefcase,
  Trophy,
  Award,
  FileText,
  CheckCircle2,
  BookOpen,
  Code,
  Sparkles,
  Mail,
  Phone,
  Building
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { students } = useCollege();

  const studentId = params?.id as string;
  const student = students.find((s) => s.id === studentId) || students[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/college/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Management</span>
        </Link>
        <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
          USN: {student.usn}
        </span>
      </div>

      {/* Student Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/50 shadow-2xl shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.name}</h1>
              {student.verificationStatus === 'Verified' && (
                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" title="Verified Skill Profile">
                  <BadgeCheck className="w-5 h-5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              {student.department} Department &bull; {student.year} &bull; CGPA: <strong className="text-emerald-400">{student.gpa}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {student.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {student.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Readiness Metric Badge */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-1 shrink-0 w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Career Readiness Score
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono">{student.readinessScore}%</p>
          <span className="text-[10px] text-slate-400 bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full inline-block font-semibold">
            Industry Eligible
          </span>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills & Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verified Skill Badges */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-emerald-400" />
              Verified Skill Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.verifiedSkills.map((sk) => (
                <div
                  key={sk}
                  className="p-3.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-center gap-3 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{sk} &ndash; Verified</p>
                    <p className="text-[10px] text-slate-400">Issued by AYUSH Institute Cell</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Set & Proficiency */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code className="w-5 h-5 text-blue-400" />
              Technical Skill Profile
            </h3>

            <div className="flex flex-wrap gap-2">
              {student.skills.map((sk) => (
                <span
                  key={sk}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Assessment History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Assessment History
            </h3>

            <div className="space-y-2">
              {student.assessmentHistory.map((asm, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{asm.skill} ({asm.level})</p>
                    <p className="text-[10px] text-slate-400">Date: {asm.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{asm.score}%</span>
                    <span className="block text-[10px] text-emerald-300 font-semibold">{asm.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Internship, Placement & Resume Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Career Status Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Briefcase className="w-5 h-5 text-amber-400" />
              Career &amp; Placement Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Internship Status</span>
                <span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {student.internshipStatus}
                </span>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Placement Status</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {student.placementStatus}
                </span>
              </div>

              {student.companyPlaced && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Company Placed</span>
                  <span className="font-bold text-amber-300">{student.companyPlaced} ({student.offerPackage})</span>
                </div>
              )}

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Resume Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Verified ATS Score 88/100
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Skills */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Recommended Growth Skills
            </h3>

            <p className="text-xs text-slate-400">
              Based on industry demand trends for {student.department} department:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-200">Cloud Architecture (AWS)</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                  High Demand Gap
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-200">Docker &amp; Kubernetes</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
