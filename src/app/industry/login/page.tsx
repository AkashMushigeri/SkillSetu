'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Sparkles,
  Building2,
  GraduationCap,
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building,
  KeyRound,
  CheckCircle2,
  Briefcase,
  MapPin,
  Users,
} from 'lucide-react';

export default function IndustryLoginPage() {
  const router = useRouter();
  const { showToast } = useIndustry();

  const [email, setEmail] = useState('hr@technova.com');
  const [password, setPassword] = useState('industry123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<'industry' | 'student' | 'college'>('industry');

  const handleRoleSwitch = (role: 'industry' | 'student' | 'college') => {
    setActiveRole(role);
    if (role === 'student') {
      router.push('/login');
    } else if (role === 'college') {
      router.push('/college/login');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      showToast('Welcome back, Rahul! Signed in to TechNova Labs.', 'success');
      router.push('/industry/dashboard');
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setEmail('hr@technova.com');
    setPassword('industry123');
    setIsLoading(true);

    setTimeout(() => {
      showToast('Signed in with Demo Credentials as TechNova HR Lead.', 'success');
      router.push('/industry/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
              Skill<span className="text-emerald-400">Setu</span>
            </div>
            <div className="text-[10px] tracking-widest uppercase font-bold text-emerald-300">
              AYUSH CAREER BRIDGE &bull; INDUSTRY PORTAL
            </div>
          </div>
        </div>

        <div className="text-xs bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SIH-GAT054 Prototype</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Overview & Demo Company Credentials */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Verified Skill-Based Talent Acquisition
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Connect with verified talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Build your future workforce.
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Move beyond static resume keywords. Define required technical skills, discover verified student projects, collaborate with colleges, and recruit proven engineering talent.
          </p>

          {/* Quick Demo Credentials Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Preset Demo Company: TechNova Labs
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                SIH Demo Ready
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Company:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>🚀</span> TechNova Labs (Bengaluru)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Recruiter Lead:</span>
                <span className="font-medium text-slate-200">Rahul Verma (HR &amp; Talent Lead)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Company Email:</span>
                <code className="text-emerald-300 font-mono font-bold">hr@technova.com</code>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Demo Password:</span>
                <code className="text-emerald-300 font-mono font-bold">industry123</code>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>12 Active Jobs &bull; 8 Internships</span>
                <span>14 Partner Colleges</span>
              </div>
            </div>

            <button
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 text-xs transition-all transform active:scale-98"
            >
              {isLoading ? (
                <span>Accessing TechNova Dashboard...</span>
              ) : (
                <>
                  <span>Login as TechNova HR (1-Click Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Role Selector & Custom Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Industry Portal Sign In</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect with verified talent. Build your future workforce.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'college', label: 'College', icon: School },
              { id: 'industry', label: 'Industry', icon: Building2 },
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSwitch(role.id as any)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[11px]">{role.label}</span>
                  {isSelected && <span className="text-[9px] text-emerald-400 font-normal">Active</span>}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
                  placeholder="hr@technova.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Password recovery sent to hr@technova.com', 'info');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl border border-slate-600 text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Sign In with Credentials</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              Switch to Student Portal &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 pt-4">
        <span>&copy; 2026 SKILLSETU &bull; AYUSH Career Bridge &bull; Ministry of Ayush &amp; SIH 2026</span>
        <span>Team ID: GAT054 &bull; Industry Portal Module</span>
      </div>
    </div>
  );
}
