'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import {
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Rocket,
  Zap,
  Target,
  ChevronRight,
  ShieldCheck,
  FolderKanban
} from 'lucide-react';
import { OpportunityType } from '@/types/student';
import { HeroMapAnimation } from '@/components/dashboard/HeroMapAnimation';
import { computeOpportunityMatch } from '@/lib/matchUtils';

export default function StudentDashboardPage() {
  const router = useRouter();
  const {
    profile,
    skills,
    applications,
    projects,
    opportunities,
    setSelectedOpportunityType,
  } = useStudent();

  const verifiedSkillsCount = skills.filter((s) => s.isVerified).length;
  const inProgressSkillsCount = skills.filter((s) => s.learningStatus === 'in_progress' && !s.isVerified).length;
  const inProgressSkill = skills.find((s) => !s.isVerified && s.progress > 0);
  const targetSkill = inProgressSkill || skills.find((s) => !s.isVerified) || skills[0];

  // Dynamic real count of opportunities matching user's real skills >= 60%
  const recommendedOppsCount = React.useMemo(() => {
    if (skills.length === 0) return 0;
    return opportunities.filter((opp) => {
      const match = computeOpportunityMatch(opp, skills, projects, profile);
      return match.matchScore >= 60;
    }).length;
  }, [opportunities, skills, projects, profile]);

  const handleCategoryClick = (category: OpportunityType) => {
    setSelectedOpportunityType(category);
    router.push('/student/opportunities');
  };

  const opportunityTypes = React.useMemo(() => [
    {
      title: 'Internship' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Internship').length} live`,
      color: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
      icon: Briefcase,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Classic 4–24 week guided programs with mentors and PPO tracks.',
    },
    {
      title: 'Micro-Internship' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Micro-Internship').length} live`,
      color: 'border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-900 dark:text-blue-100',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
      icon: Zap,
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: '1–4 week outcome-based sprints.',
    },
    {
      title: 'Same-Day Task' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Same-Day Task').length} live`,
      color: 'border-orange-200 dark:border-orange-800/60 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-900 dark:text-orange-100',
      badgeBg: 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300',
      icon: Clock,
      iconColor: 'text-orange-600 dark:text-orange-400',
      description: 'Short real-world company tasks such as landing pages, bug fixes and design tasks.',
    },
    {
      title: 'Part-Time Job' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Part-Time Job').length} live`,
      color: 'border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-900 dark:text-purple-100',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
      icon: TrendingUp,
      iconColor: 'text-purple-600 dark:text-purple-400',
      description: 'Async-friendly paid work alongside classes.',
    },
    {
      title: 'Full-Time Job' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Full-Time Job').length} live`,
      color: 'border-teal-200 dark:border-teal-800/60 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-900 dark:text-teal-100',
      badgeBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300',
      icon: Target,
      iconColor: 'text-teal-600 dark:text-teal-400',
      description: 'Graduate placements and associate roles.',
    },
    {
      title: 'Industry Challenge' as OpportunityType,
      count: `${opportunities.filter((o) => o.type === 'Industry Challenge').length} live`,
      color: 'border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-900 dark:text-rose-100',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
      icon: Rocket,
      iconColor: 'text-rose-600 dark:text-rose-400',
      description: 'Real-world competitions and industry challenges.',
    },
  ], [opportunities]);

  // Startup-first recommendations for student career stage
  const startupRecommendedOpps = React.useMemo(() => {
    return opportunities
      .filter((o) => o.isStartup || o.type === 'Micro-Internship' || o.type === 'Industry Challenge')
      .map((opp) => {
        const liveMatch = computeOpportunityMatch(opp, skills, projects, profile);
        return {
          ...opp,
          matchScore: liveMatch.matchScore,
        };
      })
      .slice(0, 3);
  }, [opportunities, skills, projects, profile]);

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* 1. Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white p-6 sm:p-8 lg:p-10 xl:p-12 min-h-[340px] lg:min-h-[380px] xl:min-h-[400px] flex items-center shadow-xl">
        <HeroMapAnimation />
        <div className="relative z-10 max-w-xl lg:max-w-xl xl:max-w-2xl space-y-4">
          <div suppressHydrationWarning className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Good morning, {profile.name ? profile.name.split(' ')[0] : 'Student'} 👋
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find opportunities. <br />
            Build skills. <br />
            Shape your career.
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
            Discover internships, startup projects, jobs and industry challenges matched to your skills, experience and location.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/student/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-sm shadow-md transition-all hover:scale-102"
            >
              <Compass className="w-4 h-4" />
              Explore Opportunities
            </Link>
            <Link
              href="/student/skills"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <Award className="w-4 h-4 text-emerald-300" />
              Build My Skills
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Profile Summary & Next Best Step (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 xl:p-7 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                suppressHydrationWarning
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-extrabold text-lg shadow-sm"
              >
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
                <div className="flex items-center gap-1.5">
                  <h3 suppressHydrationWarning className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{profile.name || 'Student'}</h3>
                  {verifiedSkillsCount > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p suppressHydrationWarning className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {profile.degree ? `${profile.degree}${profile.year ? ` • ${profile.year}` : ''}` : 'Profile in progress'}
                </p>
                <p suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location || 'Location not set'}
                </p>
              </div>
            </div>

            <Link
              href="/student/profile"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shrink-0"
            >
              Complete Profile
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-brand-teal dark:text-teal-400" />
                Career Goal
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100 truncate" title={profile.careerGoal || 'Not set yet'}>
                {profile.careerGoal || 'Not set yet'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {verifiedSkillsCount} Badges
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                In Progress
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {inProgressSkillsCount} Skills
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <FolderKanban className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                Projects
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {projects.length} Built
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Profile Completion</span>
              <span className="font-bold text-brand-teal dark:text-teal-400">{profile.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-teal to-brand-emerald h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${profile.profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 p-5 sm:p-6 xl:p-7 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Your Next Best Step
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">+25% Match Boost</span>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {inProgressSkill
                ? `Complete your ${inProgressSkill.name} Assessment`
                : targetSkill
                ? `Verify your ${targetSkill.name} Skills`
                : 'Explore & Add Your Core Skills'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              {inProgressSkill ? (
                <>
                  <strong>Reason:</strong> You completed {inProgressSkill.progress}% of the curriculum. Passing this assessment unlocks verified skill status and boosts your internship match score.
                </>
              ) : targetSkill ? (
                <>
                  <strong>Reason:</strong> Take a 10-question skill benchmark in {targetSkill.name} to unlock your verified badge and boost your employer match score.
                </>
              ) : (
                <>
                  <strong>Get Started:</strong> Add your technical skills to your profile to unlock benchmark assessments and personalized industry opportunity matches.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {targetSkill ? '10 Questions • 15 mins' : 'Over 200+ skills available'}
            </span>
            <Link
              href={targetSkill ? `/student/skills/${targetSkill.id}` : '/student/skills'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>{inProgressSkill ? 'Continue Learning' : targetSkill ? 'Start Assessment' : 'Explore Skills'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Career Progress Counters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Career Progress</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Live Student Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 xl:gap-5">
          <Link
            href="/student/skills"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 xl:p-6 shadow-card hover:shadow-cardHover hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                {verifiedSkillsCount}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">Skills Verified</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Badged on SkillSetu</p>
          </Link>

          <Link
            href="/student/learning"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 xl:p-6 shadow-card hover:shadow-cardHover hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                {inProgressSkillsCount}
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">Skills Learning</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active curriculum</p>
          </Link>

          <Link
            href="/student/profile"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 xl:p-6 shadow-card hover:shadow-cardHover hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                {projects.length}
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">Projects</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Live GitHub demos</p>
          </Link>

          <Link
            href="/student/applications"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 xl:p-6 shadow-card hover:shadow-cardHover hover:border-orange-300 dark:hover:border-orange-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
                {applications.length}
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">Applications</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Track pipeline status</p>
          </Link>

          <Link
            href="/student/opportunities"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 xl:p-6 shadow-card hover:shadow-cardHover hover:border-teal-300 dark:hover:border-teal-700 transition-all text-left group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-brand-teal dark:text-teal-400 group-hover:scale-105 transition-transform">
                {recommendedOppsCount}
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand-teal dark:text-teal-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">Recommended</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {skills.length === 0 ? 'Add skills to match' : 'Matching ≥ 60%'}
            </p>
          </Link>
        </div>
      </div>

      {/* 4. Six Ways to Start Earning Experience */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Six ways to start earning experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Not just 6-month internships &mdash; pick work that fits your timetable, from a task you finish tonight to a full-time placement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-5">
          {opportunityTypes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => handleCategoryClick(item.title)}
                className={`p-5 sm:p-6 xl:p-7 rounded-2xl border text-left transition-all hover:shadow-cardHover hover:scale-101 flex flex-col justify-between ${item.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
                      {item.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <span>Browse live openings</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Startup-First Recommendations (Key Differentiator for Student Stage) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 xl:p-10 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange text-xs font-bold mb-1.5">
              <Rocket className="w-3.5 h-3.5" />
              Recommended for your career stage ({profile.year || 'Student'})
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Start small. Build real industry experience before targeting larger companies.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Early career momentum starts with rapid micro-sprints and agile tasks.
            </p>
          </div>

          <Link
            href="/student/opportunities"
            className="text-xs font-bold text-brand-teal dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
          >
            View all 25+ openings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Career Journey Flow Visualization */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center sm:text-left">
            SkillSetu Career Readiness Journey
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-brand-teal dark:text-teal-400 text-center flex items-center justify-center">
              1. Learn Skill
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-emerald-700 dark:text-emerald-400 text-center flex items-center justify-center">
              2. Verify Skill ✓
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-blue-700 dark:text-blue-400 text-center flex items-center justify-center">
              3. Micro Experience
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-orange-700 dark:text-orange-400 text-center flex items-center justify-center">
              4. Startup Internship
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-purple-700 dark:text-purple-400 text-center flex items-center justify-center">
              5. Industry Internship
            </div>
            <div className="px-3 py-2 bg-emerald-600 text-white rounded-xl shadow-sm font-bold text-center flex items-center justify-center">
              6. Full-Time Placement
            </div>
          </div>
        </div>

        {/* 3 Featured Startup/Micro Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
          {startupRecommendedOpps.map((opp) => (
            <div
              key={opp.id}
              className="p-5 xl:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold text-[11px]">
                    {opp.type}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{opp.matchScore}% Match</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">{opp.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">{opp.company}</p>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" /> {opp.distanceKm} km away &bull; {opp.location}
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{opp.stipend}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(opp.requiredSkills || []).slice(0, 2).map((sk) => (
                    <span key={sk} className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
                <Link
                  href="/student/opportunities"
                  className="text-xs font-bold text-brand-teal dark:text-teal-400 hover:underline flex items-center gap-0.5"
                >
                  View <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
