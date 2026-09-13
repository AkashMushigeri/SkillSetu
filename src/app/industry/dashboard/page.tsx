'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { IndustryStatCard } from '@/components/industry/IndustryStatCard';
import { JobCard } from '@/components/industry/JobCard';
import { IndustryEcosystemMap } from '@/components/industry/IndustryEcosystemMap';
import { ApplicationModal } from '@/components/industry/ApplicationModal';
import { ScheduleInterviewModal } from '@/components/industry/ScheduleInterviewModal';
import { SkillBadge } from '@/components/industry/SkillBadge';
import { IndustryApplication } from '@/types/industry';
import { skillGapInsights } from '@/data/industry/industrySkills';
import {
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  ShieldCheck,
  School,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  Plus,
  Compass,
  AlertCircle,
  ExternalLink,
  KanbanSquare,
  Calendar,
} from 'lucide-react';

export default function IndustryDashboardPage() {
  const {
    company,
    jobs,
    internships,
    applications,
    colleges,
    candidates,
    showToast,
  } = useIndustry();

  const [selectedApplication, setSelectedApplication] = useState<IndustryApplication | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewAppTarget, setInterviewAppTarget] = useState<IndustryApplication | null>(null);

  // Active jobs for dashboard display
  const activeJobs = jobs.filter((j) => j.status === 'Active').slice(0, 3);
  const recentApplications = applications.slice(0, 5);

  const handleOpenInterviewFromApp = (app: IndustryApplication) => {
    setSelectedApplication(null);
    setInterviewAppTarget(app);
    setInterviewModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Value Proposition Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {company.recruiter.name.split(' ')[0]}
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Here's your hiring and verified talent intelligence overview for{' '}
            <span className="text-emerald-400 font-semibold">{company.name}</span> &bull; {company.recruiter.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/industry/jobs/new"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Job</span>
          </Link>

          <Link
            href="/industry/internships/new"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Post Internship</span>
          </Link>

          <Link
            href="/industry/candidates"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Find Talent</span>
          </Link>
        </div>
      </div>

      {/* Prominent Core Banner: Hire by Skills, Not Just Resumes */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 border border-emerald-500/30 p-6 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            SKILLSETU Core Value Proposition
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Hire by Skills, Not Just Resumes.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover verified undergraduate talent based on real coding assessments, verified institutional registries, portfolio projects, and custom skill importance weighting.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-400 flex items-center gap-1">
              ✓ Verified Registry Badges Full Weight
            </span>
            <span className="text-teal-300 flex items-center gap-1">
              ✓ Transparent 100-Point Matching Engine
            </span>
            <span className="text-sky-300 flex items-center gap-1">
              ✓ 14 Local Partner Colleges Connected
            </span>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards (Active Jobs: 12, Internships: 8, Apps: 684, Shortlisted: 126, Verified: 2184, College Partners: 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <IndustryStatCard
          title="Active Jobs"
          value="12"
          subtitle="3 new this month"
          icon={Briefcase}
          color="emerald"
          href="/industry/jobs"
        />
        <IndustryStatCard
          title="Active Internships"
          value="8"
          subtitle="2 starting soon"
          icon={GraduationCap}
          color="teal"
          href="/industry/internships"
        />
        <IndustryStatCard
          title="Applications"
          value="684"
          subtitle="+18% this month"
          icon={Users}
          trend="+18%"
          color="blue"
          href="/industry/applications"
        />
        <IndustryStatCard
          title="Shortlisted"
          value="126"
          subtitle="32 awaiting interview"
          icon={CheckCircle2}
          color="purple"
          href="/industry/pipeline"
        />
        <IndustryStatCard
          title="Verified Talent"
          value="2,184"
          subtitle="Available in pool"
          icon={ShieldCheck}
          color="amber"
          href="/industry/candidates"
        />
        <IndustryStatCard
          title="College Partners"
          value="14"
          subtitle="3 new partnerships"
          icon={School}
          color="rose"
          href="/industry/colleges"
        />
      </div>

      {/* 3. Skill-Matched Talent Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Skill-Matched Talent
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              184 candidates strongly match your active technical roles at TechNova Labs.
            </p>
          </div>

          <Link
            href="/industry/candidates"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All 184 Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Donut / Match Quality Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Strong Match (80%+)
              </span>
              <span className="text-2xl font-black text-white font-mono">84</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              Possess 80%+ required skills with verified credentials &amp; production projects.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Good Match (60–79%)
              </span>
              <span className="text-2xl font-black text-white font-mono">68</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              Possess primary languages and basic frameworks with rapid ramp-up potential.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Potential Match (40–59%)
              </span>
              <span className="text-2xl font-black text-white font-mono">32</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '32%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              High academic CGPA candidates ideal for startup micro-internships &amp; upskilling.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Active Hiring Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Active Hiring
            </h3>
            <p className="text-xs text-slate-400">
              Live role postings with real-time application and skill matching volume.
            </p>
          </div>

          <Link
            href="/industry/jobs"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>View All 12 Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 5. Recent Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Recent Applications
            </h3>
            <p className="text-xs text-slate-400">
              Candidates who recently applied across active jobs and internships.
            </p>
          </div>

          <Link
            href="/industry/applications"
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open Application Manager &rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Skills Match</th>
                <th className="py-3 px-4">Experience / Projects</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.candidateAvatar}
                        alt={app.candidateName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{app.candidateName}</p>
                        <p className="text-[10px] text-slate-400">{app.candidateCollege}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200">{app.jobTitle}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {app.matchScore}%
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {app.matchedSkills.length > 0 ? `${app.matchedSkills.length} verified skills` : 'Projects: 3'}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.stage === 'Shortlisted'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : app.stage === 'Technical Interview' || app.stage === 'HR Interview'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : app.stage === 'Selected' || app.stage === 'Hired'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {app.stage}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">{app.appliedDate}</td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-[11px] transition-colors border border-slate-700"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Talent Skill Gap Insights Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Talent Skill Gap &amp; Industry Demands
            </h3>
            <p className="text-xs text-slate-400">
              Real-time analytics highlighting supply-demand misalignments across partner institutions.
            </p>
          </div>

          <Link
            href="/industry/analytics"
            className="text-xs font-semibold text-slate-400 hover:text-white"
          >
            View Full Analytics &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillGapInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {insight.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
              </div>

              <Link
                href={`/industry/candidates?skill=${encodeURIComponent(insight.actionSkill)}`}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-emerald-300 font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{insight.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Nearby Talent & Hiring Ecosystem (Leaflet Map) */}
      <IndustryEcosystemMap />

      {/* 8. College Collaboration Feature Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-brand-dark/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
            <School className="w-3.5 h-3.5" /> Featured Academia Partnership
          </div>
          <h3 className="text-xl font-bold text-white">
            AYUSH Institute of Technology &bull; Bengaluru
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            1,742 verified students &bull; 684 students match your active Python, Machine Learning, and SQL job roles.
            Collaborate on industry challenges, offer micro-sprints, or recruit directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/industry/candidates?college=AYUSH"
            className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-all"
          >
            View Verified Students
          </Link>
          <Link
            href="/industry/colleges"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
          >
            Manage Partnerships
          </Link>
        </div>
      </div>

      {/* Application Details Drawer/Modal */}
      <ApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onOpenScheduleInterview={handleOpenInterviewFromApp}
      />

      {/* Schedule Interview Modal */}
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
