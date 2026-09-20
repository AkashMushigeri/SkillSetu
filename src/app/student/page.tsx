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

  const handleCategoryClick = (category: OpportunityType) => {
    setSelectedOpportunityType(category);
    router.push('/student/opportunities');
  };

  const opportunityTypes = [
    {
      title: 'Internship' as OpportunityType,
      count: '14 live',
      color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: Briefcase,
      iconColor: 'text-emerald-600',
      description: 'Classic 4–24 week guided programs with mentors and PPO tracks.',
    },
    {
      title: 'Micro-Internship' as OpportunityType,
      count: '23 live',
      color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800',
      icon: Zap,
      iconColor: 'text-blue-600',
      description: '1–4 week outcome-based sprints.',
    },
    {
      title: 'Same-Day Task' as OpportunityType,
      count: '19 live',
      color: 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-orange-900',
      badgeBg: 'bg-orange-100 text-orange-800',
      icon: Clock,
      iconColor: 'text-orange-600',
      description: 'Short real-world company tasks such as landing pages, bug fixes and design tasks.',
    },
    {
      title: 'Part-Time Job' as OpportunityType,
      count: '10 live',
      color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800',
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      description: 'Async-friendly paid work alongside classes.',
    },
    {
      title: 'Full-Time Job' as OpportunityType,
      count: '5 live',
      color: 'border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-900',
      badgeBg: 'bg-teal-100 text-teal-800',
      icon: Target,
      iconColor: 'text-teal-600',
      description: 'Graduate placements and associate roles.',
    },
    {
      title: 'Industry Challenge' as OpportunityType,
      count: '6 live',
      color: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800',
      icon: Rocket,
      iconColor: 'text-rose-600',
      description: 'Real-world competitions and industry challenges.',
    },
  ];

  // Startup-first recommendations for 3rd year students
  const startupRecommendedOpps = opportunities
    .filter((o) => o.isStartup || o.type === 'Micro-Internship' || o.type === 'Industry Challenge')
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white p-6 sm:p-10 shadow-xl">
        <HeroMapAnimation />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Good morning, {profile.name.split(' ')[0]} 👋
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find opportunities. <br />
            Build skills. <br />
            Shape your career.
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-card hover:shadow-cardHover transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
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
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">{profile.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-600">{profile.degree} &bull; {profile.year}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
                </p>
              </div>
            </div>

            <Link
              href="/student/profile"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
            >
              Complete Profile
            </Link>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Profile Completion</span>
              <span className="font-bold text-brand-teal">{profile.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-teal to-brand-emerald h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${profile.profileCompletion}%` }}
              ></div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-teal" />
                <span>Goal: <strong className="text-slate-700">{profile.careerGoal}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span><strong className="text-slate-700">{verifiedSkillsCount}</strong> Verified Badges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <Zap className="w-3 h-3 text-emerald-600" />
                Your Next Best Step
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">+25% Match Boost</span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {inProgressSkill
                ? `Complete your ${inProgressSkill.name} Assessment`
                : `Verify your ${targetSkill?.name || 'Core'} Skills`}
            </h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {inProgressSkill ? (
                <>
                  <strong>Reason:</strong> You completed {inProgressSkill.progress}% of curriculum. Passing this assessment unlocks verified skill status and boosts your local internship match from <strong>62% to 87%</strong>.
                </>
              ) : (
                <>
                  <strong>Reason:</strong> Take a 10-question skill benchmark in {targetSkill?.name || 'your core area'} to unlock your verified badge and boost your employer match score up to <strong>+25%</strong>.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">10 Questions &bull; 15 mins</span>
            <Link
              href={targetSkill ? `/student/skills/${targetSkill.id}` : '/student/skills'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>{inProgressSkill ? 'Continue Learning' : 'Start Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Career Progress Counters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Career Progress</h2>
          <span className="text-xs text-slate-500">Live Student Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Link
            href="/student/skills"
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card hover:shadow-cardHover hover:border-emerald-300 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 group-hover:scale-105 transition-transform">
                {verifiedSkillsCount}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">Skills Verified</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Badged on SkillSetu</p>
          </Link>

          <Link
            href="/student/learning"
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card hover:shadow-cardHover hover:border-blue-300 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 group-hover:scale-105 transition-transform">
                {inProgressSkillsCount}
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">Skills Learning</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active curriculum</p>
          </Link>

          <Link
            href="/student/profile"
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card hover:shadow-cardHover hover:border-purple-300 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 group-hover:scale-105 transition-transform">
                {projects.length}
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">Projects</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Live GitHub demos</p>
          </Link>

          <Link
            href="/student/applications"
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card hover:shadow-cardHover hover:border-orange-300 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 group-hover:scale-105 transition-transform">
                {applications.length}
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">Applications</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Track pipeline status</p>
          </Link>

          <Link
            href="/student/opportunities"
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card hover:shadow-cardHover hover:border-teal-300 transition-all text-left group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-teal group-hover:scale-105 transition-transform">
                12
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-2">Recommended</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Matching &gt; 60%</p>
          </Link>
        </div>
      </div>

      {/* 4. Six Ways to Start Earning Experience */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Six ways to start earning experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Not just 6-month internships &mdash; pick work that fits your timetable, from a task you finish tonight to a full-time placement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunityTypes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => handleCategoryClick(item.title)}
                className={`p-5 rounded-2xl border text-left transition-all hover:shadow-cardHover hover:scale-101 flex flex-col justify-between ${item.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
                      {item.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Browse live openings</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Startup-First Recommendations (Key Differentiator for 3rd Year) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-1.5">
              <Rocket className="w-3.5 h-3.5" />
              Recommended for your career stage (3rd Year)
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Start small. Build real industry experience before targeting larger companies.
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Early career momentum starts with rapid micro-sprints and agile tasks.
            </p>
          </div>

          <Link
            href="/student/opportunities"
            className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1 shrink-0"
          >
            View all 25+ openings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Career Journey Flow Visualization */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
            SkillSetu Career Readiness Journey
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700">
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-brand-teal">
              1. Learn Skill
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-emerald-700">
              2. Verify Skill ✓
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-blue-700">
              3. Micro Experience
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-orange-700">
              4. Startup Internship
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-purple-700">
              5. Industry Internship
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg shadow-sm font-bold">
              6. Full-Time Placement
            </span>
          </div>
        </div>

        {/* 3 Featured Startup/Micro Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {startupRecommendedOpps.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[11px]">
                    {opp.type}
                  </span>
                  <span className="font-bold text-emerald-700">{opp.matchScore}% Match</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{opp.title}</h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{opp.company}</p>
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" /> {opp.distanceKm} km away &bull; {opp.location}
                  </p>
                  <p className="font-semibold text-slate-800">{opp.stipend}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {opp.requiredSkills.slice(0, 2).map((sk) => (
                    <span key={sk} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
                <Link
                  href="/student/opportunities"
                  className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-0.5"
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
