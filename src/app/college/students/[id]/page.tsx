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
    <div className="space-y-6 animate-in fade-in text-slate-900">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/college/students"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Management</span>
        </Link>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 font-medium">
          USN: {student.usn}
        </span>
      </div>

      {/* Student Profile Card Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{student.name}</h1>
              {student.verificationStatus === 'Verified' && (
                <span className="p-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" title="Verified Skill Profile">
                  <BadgeCheck className="w-5 h-5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              {student.department} Department &bull; {student.year} &bull; CGPA: <strong className="text-brand-dark font-extrabold">{student.gpa}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {student.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {student.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Readiness Metric Badge */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 shrink-0 w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase text-slate-500 block tracking-wider">
            Career Readiness Score
          </span>
          <p className="text-3xl font-black text-brand-dark font-mono">{student.readinessScore}%</p>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block font-semibold">
            Industry Eligible
          </span>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills & Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verified Skill Badges */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              Verified Skill Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.verifiedSkills.map((sk) => (
                <div
                  key={sk}
                  className="p-3.5 bg-slate-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{sk} &ndash; Verified</p>
                    <p className="text-[10px] text-slate-500">Issued by AYUSH Institute Cell</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Set & Proficiency */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Code className="w-5 h-5 text-blue-600" />
              Technical Skill Profile
            </h3>

            <div className="flex flex-wrap gap-2">
              {student.skills.map((sk) => (
                <span
                  key={sk}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Assessment History */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Assessment History
            </h3>

            <div className="space-y-2">
              {student.assessmentHistory.map((asm, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{asm.skill} ({asm.level})</p>
                    <p className="text-[10px] text-slate-500">Date: {asm.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-brand-dark text-sm">{asm.score}%</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">{asm.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Internship, Placement & Resume Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Career Status Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-amber-600" />
              Career &amp; Placement Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Internship Status</span>
                <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {student.internshipStatus}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Placement Status</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {student.placementStatus}
                </span>
              </div>

              {student.companyPlaced && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Company Placed</span>
                  <span className="font-bold text-amber-800">{student.companyPlaced} ({student.offerPackage})</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Resume Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Verified ATS Score 88/100
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Skills */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Recommended Growth Skills
            </h3>

            <p className="text-xs text-slate-500">
              Based on industry demand trends for {student.department} department:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-800">Cloud Architecture (AWS)</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  High Demand Gap
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-800">Docker &amp; Kubernetes</span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
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
