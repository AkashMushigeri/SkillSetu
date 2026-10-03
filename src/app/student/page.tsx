'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import {
  Compass,
  BookOpen,
  ArrowRight,
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
import { HeroCanvasAnimation } from '@/components/dashboard/HeroCanvasAnimation';

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
      description: 'Classic 4-24 week guided programs with mentors and PPO tracks.',
    },
    {
      title: 'Micro-Internship' as OpportunityType,
      count: '23 live',
      color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800',
      icon: Zap,
      iconColor: 'text-blue-600',
      description: '1-4 week outcome-based sprints.',
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
      {/* 1. AI Career Intelligence Hero Section */}
      <div className="relative rounded-3xl overflow-hidden hero-animated-gradient text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-emerald-500/30 ring-1 ring-inset ring-white/5">
        {/* Glow orbs for depth */}
        <div className="hero-glow-orb w-[420px] h-[420px] bg-emerald-500/20 -top-24 -left-16 z-0" />
        <div className="hero-glow-orb w-[320px] h-[320px] bg-teal-400/15 top-1/2 left-1/3 -translate-y-1/2 z-0" />
        <div className="hero-glow-orb w-[280px] h-[280px] bg-emerald-600/20 -bottom-16 right-1/4 z-0" />
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* LEFT - STRATEGIC VALUE PROPOSITION (5/12 on lg, 4/12 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/50 shadow-[0_0_16px_rgba(16,185,129,0.25)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
                AI Career Engine Active
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-white leading-[1.15]">
                Turn Your Skills <br />
                Into Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  Opportunity.
                </span>
              </h1>
              <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-lg">
                Build a verified skill profile, discover what you are missing in real-time, and seamlessly connect with vetted opportunities that perfectly match your path.
              </p>
            </div>

            {/* Telemetry Chips */}
            <div className="grid grid-cols-3 gap-3 border-y border-emerald-400/25 py-5 max-w-md">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 mb-1">Engine Input</div>
                <div className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38BDF8]"></span>
                  24 Skills
                </div>
              </div>
              <div className="text-left border-x border-emerald-400/25 px-3 sm:px-4">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 mb-1">Vulnerabilities</div>
                <div className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#FBBF24]"></span>
                  6 Gaps
                </div>
              </div>
              <div className="text-left pl-2 sm:pl-3">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 mb-1">Target Accuracy</div>
                <div className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]"></span>
                  94% Match
                </div>
              </div>
            </div>

            {/* CTA Action Block */}
            <div className="flex flex-col sm:flex-row gap-3.5 max-w-md">
              <Link
                href="/student/skills"
                className="group relative flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-400/50 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Analyze My Skills</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/student/opportunities"
                className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-emerald-400/60 backdrop-blur-md transition-all duration-300"
              >
                <span>Explore Roles</span>
              </Link>
            </div>

            {/* Live Pipeline Stats Widget */}
            <div className="flex items-center space-x-3.5 bg-black/30 border border-emerald-400/25 p-3.5 rounded-xl max-w-md backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-emerald-900 flex items-center justify-center text-[10px] font-bold text-white">
                  JD
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500/30 border-2 border-emerald-900 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                  ✓
                </div>
                <div className="w-7 h-7 rounded-full bg-teal-500/30 border-2 border-emerald-900 flex items-center justify-center text-[10px] text-teal-200 font-bold">
                  94
                </div>
              </div>
              <div className="text-xs">
                <span className="text-slate-300">Pipeline telemetry matches: </span>
                <span className="text-emerald-300 font-semibold block">
                  142 Active Internships Verified Today
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT - AI INTELLIGENCE CANVAS (7/12 on lg, 8/12 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 flex items-center justify-center w-full">
            <HeroCanvasAnimation skills={skills} opportunities={opportunities} />
          </div>
        </div>

        {/* 4-Step Trajectory Pathway Steps Indicator */}
        <div className="relative z-10 mt-8 pt-6 border-t border-emerald-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-400">
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-xs text-sky-400 shrink-0 font-extrabold">
                01
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">Verified Skills</h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  System scan maps structural proficiency based on concrete project evidence.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-xs text-emerald-400 shrink-0 font-extrabold">
                02
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">AI Engine Analysis</h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Translates structural profiles into unified intelligence vector networks.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-xs text-amber-400 shrink-0 font-extrabold">
                03
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">Skill Gap Tracking</h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Highlights missing components relative to current target opportunities.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-purple-400/10 border border-purple-400/25 flex items-center justify-center text-xs text-purple-400 shrink-0 font-extrabold">
                04
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">Target Matching</h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Direct path connection to verified opportunities tailored to matching scores.
                </p>
              </div>
            </div>
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
