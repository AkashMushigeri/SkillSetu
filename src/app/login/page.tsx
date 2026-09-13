'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | 'college'>('student');
  const [email, setEmail] = useState('aarav.sharma@rvce.edu.in');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoStudentLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/student');
    }, 400);
  };

  const handleRoleChange = (role: 'student' | 'company' | 'college') => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('aarav.sharma@rvce.edu.in');
      setPassword('demo123');
    } else if (role === 'company') {
      setEmail('hr@technova.com');
      setPassword('industry123');
    } else if (role === 'college') {
      setEmail('admin@ayushcollege.edu');
      setPassword('college123');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectedRole === 'student') {
      setTimeout(() => {
        router.push('/student');
      }, 400);
    } else if (selectedRole === 'college') {
      setTimeout(() => {
        router.push('/college/login');
      }, 400);
    } else if (selectedRole === 'company') {
      setTimeout(() => {
        router.push('/industry/login');
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-dark to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
              Skill<span className="text-emerald-400">Setu</span>
            </div>
            <div className="text-[10px] tracking-widest uppercase font-semibold text-emerald-300">
              AYUSH CAREER BRIDGE
            </div>
          </div>
        </div>

        <div className="text-xs bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SIH-GAT054 Prototype</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Product Mission & Credentials */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Academia &ndash; Industry Skill Intelligence
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find Opportunities. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Build Your Future.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            SkillSetu bridges college students with startups, industry internships, micro-sprints, and real-world tasks through verified skill mapping and transparent local opportunity matching.
          </p>

          {/* Quick Demo Student Card */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Preset Demo Student
              </span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-medium">
                Ready to Test
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center font-bold text-white text-base shadow-sm">
                AS
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-slate-100 text-sm">Aarav Sharma</p>
                <p className="text-slate-300">B.Tech Computer Science &bull; 3rd Year</p>
                <p className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Bengaluru, Karnataka
                </p>
                <p className="text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-brand-orange" /> Career Goal: Software / Data / Product Roles
                </p>
              </div>
            </div>

            <button
              onClick={handleDemoStudentLogin}
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-emerald to-brand-teal hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 text-sm transition-all transform active:scale-98"
            >
              {isLoading ? (
                <span>Loading Student Dashboard...</span>
              ) : (
                <>
                  <span>Continue as Demo Student</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">Sign In to SkillSetu</h2>
            <p className="text-xs text-slate-400 mt-1">Select your role to access your dedicated portal.</p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'company', label: 'Company', icon: Building2 },
              { id: 'college', label: 'College', icon: School },
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="font-bold text-slate-100">{role.label}</div>
                  <span className="text-[10px] text-emerald-400 font-normal mt-0.5">Active Module</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                placeholder="student@college.edu.in"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-600 text-sm transition-colors flex items-center justify-center gap-2"
            >
              Sign In with Credentials
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={handleDemoStudentLogin}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              Skip login &amp; explore Student Experience as Aarav &rarr;
            </button>
            <button
              type="button"
              onClick={() => router.push('/industry/login')}
              className="text-xs text-teal-300 hover:text-teal-200 font-semibold flex items-center gap-1 mt-1"
            >
              <span>🚀 Access Industry Portal (TechNova Labs) &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 pt-4">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge &bull; Ministry of Ayush &amp; SIH 2026</span>
        <span>Team ID: GAT054 &bull; College Student Experience Module</span>
      </div>
    </div>
  );
}
