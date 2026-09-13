'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCollege } from '@/context/CollegeContext';
import {
  Users,
  BadgeCheck,
  GraduationCap,
  BriefcaseBusiness,
  Trophy,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Filter,
  BarChart3,
  Calendar,
  Award,
  Zap,
  MapPin
} from 'lucide-react';
import { CreateTrainingModal } from '@/components/college/CreateTrainingModal';
import { EcosystemMap } from '@/components/college/EcosystemMap';
import {
  COLLEGE_KPIS,
  READINESS_BY_LEVEL,
  DEPARTMENT_READINESS_DATA,
  TOP_SKILLS_DATA,
  SKILL_GAP_ANALYSIS_DATA,
  RECENT_ACTIVITY_TIMELINE
} from '@/data/collegeData';

export default function CollegeDashboardPage() {
  const { profile, internships, placements, recommendInternship, showToast } = useCollege();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [presetSkillForModal, setPresetSkillForModal] = useState<string>('Cloud Architecture (AWS / Azure)');

  const handleOpenTrainingModal = (skillName?: string) => {
    if (skillName) setPresetSkillForModal(skillName);
    setIsTrainingModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH Academia–Industry Skill Bridge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {profile.placementOfficer.name}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Here&apos;s your college&apos;s real-time skill verification, internship, and placement overview.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-white font-bold">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              {profile.institutionName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {profile.location}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono font-bold">
              AY {profile.academicYear}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <img
            src={profile.placementOfficer.avatar}
            alt={profile.placementOfficer.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-xl"
          />
          <div className="text-xs">
            <p className="font-bold text-white text-sm">{profile.placementOfficer.name}</p>
            <p className="text-emerald-400 font-medium">{profile.placementOfficer.title}</p>
            <button
              onClick={() => handleOpenTrainingModal('Cloud Architecture')}
              className="mt-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Training Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: 'Total Students',
            value: COLLEGE_KPIS.totalStudents.value.toLocaleString(),
            subtitle: COLLEGE_KPIS.totalStudents.subtitle,
            icon: Users,
            color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
          },
          {
            title: 'Skill Verified',
            value: COLLEGE_KPIS.skillVerifiedStudents.value.toLocaleString(),
            subtitle: COLLEGE_KPIS.skillVerifiedStudents.subtitle,
            icon: BadgeCheck,
            color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
          },
          {
            title: 'Industry Ready',
            value: COLLEGE_KPIS.industryReadyStudents.value.toLocaleString(),
            subtitle: COLLEGE_KPIS.industryReadyStudents.subtitle,
            icon: GraduationCap,
            color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
          },
          {
            title: 'Active Internships',
            value: COLLEGE_KPIS.activeInternships.value,
            subtitle: COLLEGE_KPIS.activeInternships.subtitle,
            icon: BriefcaseBusiness,
            color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
          },
          {
            title: 'Placement Offers',
            value: COLLEGE_KPIS.placementOffers.value,
            subtitle: COLLEGE_KPIS.placementOffers.subtitle,
            icon: Trophy,
            color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
          },
          {
            title: 'Partner Companies',
            value: COLLEGE_KPIS.partnerCompanies.value,
            subtitle: COLLEGE_KPIS.partnerCompanies.subtitle,
            icon: Building2,
            color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 bg-gradient-to-br ${kpi.color} bg-slate-900 border rounded-2xl shadow-xl flex flex-col justify-between space-y-2 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{kpi.title}</span>
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{kpi.value}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{kpi.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Skill Readiness & Department Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Skill Readiness */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Student Skill Readiness</h3>
                <p className="text-xs text-slate-400">Baseline vs Intermediate vs Advanced student readiness</p>
              </div>

              {/* Department & Year Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Depts</option>
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="All Years">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-emerald-400">Basic Skills (Python, C, SQL, Git)</span>
                  <span className="text-white">82% Verified ({Math.round(2486 * 0.82)} students)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-blue-400">Intermediate Skills (React, Node, DSA, ML)</span>
                  <span className="text-white">61% Verified ({Math.round(2486 * 0.61)} students)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-700"
                    style={{ width: '61%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-purple-400">Advanced Skills (Cloud AWS, DevOps, GenAI)</span>
                  <span className="text-white">34% Verified ({Math.round(2486 * 0.34)} students)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                    style={{ width: '34%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target for AY 2026–27: 50% Advanced Skill Verification</span>
            <Link href="/college/skills" className="text-emerald-400 hover:underline font-bold flex items-center gap-1">
              Explore Skill Ecosystem &rarr;
            </Link>
          </div>
        </div>

        {/* Department Performance */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Department Skill Readiness</h3>
              <p className="text-xs text-slate-400">Verification &amp; Placement conversion by department</p>
            </div>
            <Link
              href="/college/students"
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Students &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Students</th>
                  <th className="py-2.5 px-3">Verified %</th>
                  <th className="py-2.5 px-3">Industry Ready</th>
                  <th className="py-2.5 px-3">Placement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {DEPARTMENT_READINESS_DATA.map((dept) => (
                  <tr key={dept.department} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{dept.department}</td>
                    <td className="py-2.5 px-3 text-slate-300">{dept.students}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {dept.verifiedPct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{dept.industryReadyPct}%</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${dept.placementRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-white">{dept.placementRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Top Skills & Skill Gap Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Skills Distribution Horizontal Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Top Skills Across Students</h3>
              <p className="text-xs text-slate-400">Total student counts by validated technical skill</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
              2,486 Total Students
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {TOP_SKILLS_DATA.slice(0, 7).map((sk) => {
              const maxCount = 2000;
              const pct = Math.round((sk.count / maxCount) * 100);
              return (
                <div key={sk.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{sk.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{sk.count.toLocaleString()} students</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Gap Analysis Card */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Skill Gap Analysis
                </h3>
                <p className="text-xs text-slate-400">Student Skills vs Industry Corporate Demand</p>
              </div>
              <button
                onClick={() => handleOpenTrainingModal('Cloud Architecture (AWS / Azure)')}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-lg shadow-emerald-950/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Training Program</span>
              </button>
            </div>

            {/* High Gap Alert Banner */}
            <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-amber-300">Cloud Computing has the highest skill gap this semester.</p>
                  <p className="text-[11px] text-slate-300">Deficit: 818 students needed by partner companies (AWS/Azure).</p>
                </div>
              </div>
            </div>

            {/* Skill Gap Table */}
            <div className="overflow-x-auto pt-3 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2 px-2">Skill</th>
                    <th className="py-2 px-2">Students</th>
                    <th className="py-2 px-2">Demand</th>
                    <th className="py-2 px-2">Gap</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {SKILL_GAP_ANALYSIS_DATA.map((sg) => (
                    <tr key={sg.skill} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-2 font-bold text-white">{sg.skill}</td>
                      <td className="py-2 px-2 text-slate-300">{sg.studentsCount}</td>
                      <td className="py-2 px-2 text-slate-300">{sg.industryDemand}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                            sg.highestGap
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {sg.gap}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => handleOpenTrainingModal(sg.skill)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline font-bold"
                        >
                          + Train
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Upcoming Internships & Placement Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Startup First Experience & Internships */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5 text-emerald-400" />
                Recommended Startup Experience
              </h3>
              <p className="text-xs text-slate-400">
                Startup internships for 3rd year students before corporate drives
              </p>
            </div>
            <Link href="/college/internships" className="text-xs text-emerald-400 hover:underline font-bold">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {internships.slice(0, 2).map((intern) => (
              <div
                key={intern.id}
                className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                      {intern.isStartup ? 'Startup Internship' : 'Corporate Internship'}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{intern.role}</h4>
                    <p className="text-xs text-slate-300">{intern.company} &bull; {intern.location}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    {intern.stipend}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Required Skills:</span>
                  {intern.skillsRequired.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-xs text-slate-400">
                    <strong>{intern.eligibleStudentsCount}</strong> eligible students
                  </span>
                  <button
                    onClick={() => recommendInternship(intern.id)}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-xl text-xs border border-emerald-500/30 transition-all"
                  >
                    Recommend to Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Drives */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Upcoming Placement Drives
              </h3>
              <p className="text-xs text-slate-400">Campus drives &amp; hiring partner pipelines</p>
            </div>
            <Link href="/college/placements" className="text-xs text-amber-400 hover:underline font-bold">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {placements.slice(0, 2).map((drive) => (
              <div
                key={drive.id}
                className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-sm shrink-0">
                      {drive.company.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{drive.company}</h4>
                      <p className="text-xs text-slate-300">{drive.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    {drive.packageOffer}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Drive Date</span>
                    <span className="font-bold text-slate-200">{drive.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Min CGPA</span>
                    <span className="font-bold text-slate-200">{drive.minCgpa}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Depts</span>
                    <span className="font-bold text-slate-200">{drive.eligibleDepts.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Eligible</span>
                    <span className="font-bold text-emerald-400">{drive.eligibleCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => showToast(`Notified ${drive.eligibleCount} eligible students for ${drive.company} drive.`, 'success')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700"
                  >
                    Notify Students
                  </button>
                  <Link
                    href="/college/placements"
                    className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs border border-amber-500/30"
                  >
                    View Drive Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Insights & Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Important Insights */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-emerald-400" />
            Important Insights
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs">
              <span className="text-amber-400 text-base">⚠</span>
              <span className="text-slate-200">
                <strong>818 students</strong> lack Cloud Computing skills required by partner companies.
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs">
              <span className="text-emerald-400 text-base">✓</span>
              <span className="text-slate-200">
                <strong>86% of eligible final-year students</strong> are placement-ready.
              </span>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-xs">
              <span className="text-rose-400 text-base">⚠</span>
              <span className="text-slate-200">
                <strong>42 students</strong> have not completed mandatory assessments.
              </span>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-3 text-xs">
              <span className="text-blue-400 text-base">✓</span>
              <span className="text-slate-200">
                <strong>12 new startup internship opportunities</strong> are available for application.
              </span>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Smart Recommendations
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
              <p className="font-bold text-white">
                &quot;Launch a Cloud Computing bootcamp for CSE and AIML students.&quot;
              </p>
              <p className="text-slate-400 text-[11px]">
                Reason: Cloud skills are currently required in 64% of partner-company roles, while only 18% of students have verified Cloud skills.
              </p>
              <button
                onClick={() => handleOpenTrainingModal('Cloud Architecture (AWS / Azure)')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Training Program</span>
              </button>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
              <p className="font-bold text-white">
                &quot;Recommend startup internships to 3rd-year AIML students.&quot;
              </p>
              <p className="text-slate-400 text-[11px]">
                Reason: 42 students match current AI/ML startup opportunities at TechNova Labs and InnovateAI.
              </p>
              <Link
                href="/college/internships"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                <span>View Opportunities &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Ecosystem Map & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ecosystem Map */}
        <div className="lg:col-span-7">
          <EcosystemMap />
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Recent Activity Timeline
          </h3>

          <div className="space-y-4 text-xs">
            {RECENT_ACTIVITY_TIMELINE.map((grp) => (
              <div key={grp.dateGroup} className="space-y-2">
                <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                  {grp.dateGroup}
                </span>
                <div className="space-y-2 pl-2 border-l-2 border-slate-800">
                  {grp.items.map((it, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{it.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Integration */}
      <CreateTrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        presetSkill={presetSkillForModal}
      />
    </div>
  );
}
