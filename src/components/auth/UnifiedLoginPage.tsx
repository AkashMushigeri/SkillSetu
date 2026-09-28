'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  KeyRound,
  Loader2,
  AlertCircle,
  School,
} from 'lucide-react';
import { PortalSelector, PortalRole } from './PortalSelector';
import { useAuth } from '@/context/AuthContext';
import { UserRole, isNetworkError } from '@/lib/firebase';

export interface PortalConfig {
  id: PortalRole;
  name: string;
  tagline: string;
  badge: string;
  heroTitleMain: string;
  heroTitleGradient: string;
  heroDescription: string;
  demoBadge: string;
  demoStatus: string;
  demoAvatar: string;
  demoTitle: string;
  demoSubtitle: string;
  demoLocation: string;
  demoDetail: string;
  demoButtonText: string;
  cardTitle: string;
  cardSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  defaultEmail: string;
  defaultPassword: string;
  submitButtonText: string;
  destination: string;
  footerModule: string;
}

export const PORTAL_CONFIGS: Record<PortalRole, PortalConfig> = {
  student: {
    id: 'student',
    name: 'Student',
    tagline: 'AYUSH CAREER BRIDGE',
    badge: 'Academia – Industry Skill Intelligence',
    heroTitleMain: 'Find Opportunities.',
    heroTitleGradient: 'Build Your Future.',
    heroDescription:
      'SkillSetu bridges college students with startups, industry internships, micro-sprints, and real-world tasks through verified skill mapping and transparent local opportunity matching.',
    demoBadge: 'Preset Demo Student',
    demoStatus: 'Ready to Test',
    demoAvatar: 'AS',
    demoTitle: 'Aarav Sharma',
    demoSubtitle: 'B.Tech Computer Science • 3rd Year',
    demoLocation: 'Bengaluru, Karnataka',
    demoDetail: 'Career Goal: Software / Data / Product Roles',
    demoButtonText: 'Continue as Demo Student',
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'Student Email Address',
    emailPlaceholder: 'aarav.sharma@rvce.edu.in',
    defaultEmail: 'aarav.sharma@rvce.edu.in',
    defaultPassword: 'demo123',
    submitButtonText: 'Sign In to Student Portal',
    destination: '/student',
    footerModule: 'Student Experience Module',
  },
  industry: {
    id: 'industry',
    name: 'Industry',
    tagline: 'AYUSH CAREER BRIDGE • INDUSTRY PORTAL',
    badge: 'Verified Skill-Based Talent Acquisition',
    heroTitleMain: 'Connect with Talent.',
    heroTitleGradient: 'Build Your Workforce.',
    heroDescription:
      'Move beyond static resumes. Define required technical skills, discover verified student projects, evaluate automated code benchmarks, and hire proven engineering talent.',
    demoBadge: 'Preset Demo Industry',
    demoStatus: 'Ready to Test',
    demoAvatar: 'TN',
    demoTitle: 'TechNova Labs (Bengaluru)',
    demoSubtitle: 'Rahul Verma • HR & Talent Lead',
    demoLocation: 'Indiranagar, Bengaluru, Karnataka',
    demoDetail: '12 Active Jobs • 8 Internships • 14 Colleges',
    demoButtonText: 'Continue as Demo Industry',
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'Industry Email Address',
    emailPlaceholder: 'hr@technova.com',
    defaultEmail: 'hr@technova.com',
    defaultPassword: 'industry123',
    submitButtonText: 'Sign In to Industry Portal',
    destination: '/industry/dashboard',
    footerModule: 'Industry Portal Module',
  },
  college: {
    id: 'college',
    name: 'College',
    tagline: 'AYUSH CAREER BRIDGE • COLLEGE PORTAL',
    badge: 'Institutional Career & Placement Management',
    heroTitleMain: 'Empower Institutions.',
    heroTitleGradient: 'Bridge to Industry.',
    heroDescription:
      'Monitor real-time student skill verification, analyze industry skill gaps, manage startup internship recommendations, and streamline campus placement drives for your institution.',
    demoBadge: 'Preset Demo College',
    demoStatus: 'Ready to Test',
    demoAvatar: 'AI',
    demoTitle: 'AYUSH Institute of Technology',
    demoSubtitle: 'Dr. Priya Sharma • Placement Officer',
    demoLocation: 'Bengaluru, Karnataka',
    demoDetail: '450+ Enrolled Students • 12 MoU Partnerships',
    demoButtonText: 'Continue as Demo College',
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'College Email / Institutional ID',
    emailPlaceholder: 'admin@ayushcollege.edu',
    defaultEmail: 'admin@ayushcollege.edu',
    defaultPassword: 'college123',
    submitButtonText: 'Sign In to College Portal',
    destination: '/college/dashboard',
    footerModule: 'College Portal Module',
  },
};

const roleToUserRole: Record<PortalRole, UserRole> = {
  student: 'STUDENT',
  industry: 'INDUSTRY',
  college: 'COLLEGE',
};

interface UnifiedLoginPageProps {
  initialRole?: PortalRole;
}

function UnifiedLoginContent({ initialRole = 'student' }: UnifiedLoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signUpWithGoogle,
    loading: authLoading,
  } = useAuth();

  const getInitialRole = (): PortalRole => {
    const roleParam = searchParams?.get('role')?.toLowerCase();
    if (roleParam === 'industry' || roleParam === 'company') return 'industry';
    if (roleParam === 'college') return 'college';
    if (roleParam === 'student') return 'student';
    return initialRole;
  };

  const [selectedRole, setSelectedRole] = useState<PortalRole>(getInitialRole);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(PORTAL_CONFIGS[getInitialRole()].defaultEmail);
  const [password, setPassword] = useState<string>(PORTAL_CONFIGS[getInitialRole()].defaultPassword);
  const [displayName, setDisplayName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync role if query parameter changes externally
  useEffect(() => {
    const roleParam = searchParams?.get('role')?.toLowerCase();
    if (roleParam === 'industry' || roleParam === 'company') {
      setSelectedRole('industry');
      setEmail(PORTAL_CONFIGS.industry.defaultEmail);
      setPassword(PORTAL_CONFIGS.industry.defaultPassword);
      setError(null);
    } else if (roleParam === 'college') {
      setSelectedRole('college');
      setEmail(PORTAL_CONFIGS.college.defaultEmail);
      setPassword(PORTAL_CONFIGS.college.defaultPassword);
      setError(null);
    } else if (roleParam === 'student') {
      setSelectedRole('student');
      setEmail(PORTAL_CONFIGS.student.defaultEmail);
      setPassword(PORTAL_CONFIGS.student.defaultPassword);
      setError(null);
    }
  }, [searchParams]);

  const config = PORTAL_CONFIGS[selectedRole];

  const handleRoleChange = (role: PortalRole) => {
    setSelectedRole(role);
    setEmail(PORTAL_CONFIGS[role].defaultEmail);
    setPassword(PORTAL_CONFIGS[role].defaultPassword);
    setError(null);

    // Update browser URL query parameter without triggering page reload/flicker
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', role);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    if (selectedRole === 'college') {
      try {
        localStorage.setItem('skillsetu_college_auth', 'true');
      } catch {
        // ignore storage errors
      }
    }

    try {
      await signInWithEmailPassword(config.defaultEmail, config.defaultPassword);
    } catch (err: any) {
      console.warn('Firebase demo login fallback triggered:', err);
      // Seamless fallback to portal destination if offline or network changed
      router.push(config.destination);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fbRole = roleToUserRole[selectedRole];

    if (selectedRole === 'college') {
      try {
        localStorage.setItem('skillsetu_college_auth', 'true');
      } catch {
        // ignore storage errors
      }
    }

    try {
      if (isSignup) {
        await signUpWithEmailPassword(
          email,
          password,
          displayName || config.name,
          fbRole,
          phone,
          college
        );
      } else {
        try {
          await signInWithEmailPassword(email, password);
        } catch (loginErr: any) {
          if (
            loginErr.code === 'auth/user-not-found' ||
            loginErr.code === 'auth/wrong-password' ||
            loginErr.message?.includes('user-not-found') ||
            loginErr.message?.includes('wrong-password')
          ) {
            // If user is trying to log in with an uncreated demo account, auto-provision
            await signUpWithEmailPassword(
              email,
              password,
              displayName || config.name,
              fbRole,
              phone,
              college
            );
          } else {
            throw loginErr;
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email sign-in is not enabled. Please enable it in Firebase Console.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Account not found. Try signing up instead.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password. Please try again or sign up.');
      } else if (err.message?.includes('auth/popup-blocked')) {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (isNetworkError(err)) {
        setError('Network connection interrupted (ERR_NETWORK_CHANGED). Click demo credentials below to test offline.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    const fbRole = roleToUserRole[selectedRole];

    if (selectedRole === 'college') {
      try {
        localStorage.setItem('skillsetu_college_auth', 'true');
      } catch {
        // ignore storage errors
      }
    }

    try {
      if (isSignup) {
        await signUpWithGoogle(fbRole, displayName || config.name, phone, college);
      } else {
        await signInWithGoogle();
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in Firebase Console: Authentication → Sign-in method → Google.');
      } else if (err.code === 'auth/popup-closed-timeout' || err.message?.includes('popup')) {
        setError('Popup was closed or blocked. Please check your browser settings and try again.');
      } else if (isNetworkError(err)) {
        setError('Google service unreachable due to network change. Please use Demo Credentials.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-dark to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
              Skill<span className="text-emerald-400">Setu</span>
            </div>
            <div className="text-[10px] tracking-widest uppercase font-semibold text-emerald-300">
              {config.tagline}
            </div>
          </div>
        </div>

        <div className="text-xs bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SIH-GAT054 Prototype</span>
        </div>
      </header>

      {/* Main Login Card Grid */}
      <main className="max-w-5xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Product Mission & Role Credentials */}
        <section className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{config.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight min-h-[5.5rem] flex flex-col justify-center">
            <span>{config.heroTitleMain}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              {config.heroTitleGradient}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed min-h-[4.5rem]">
            {config.heroDescription}
          </p>

          {/* Quick Demo Credentials Card */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {config.demoBadge}
              </span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-medium">
                {config.demoStatus}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
                {config.demoAvatar}
              </div>
              <div className="space-y-0.5 text-xs min-w-0">
                <p className="font-bold text-slate-100 text-sm truncate">{config.demoTitle}</p>
                <p className="text-slate-300 truncate">{config.demoSubtitle}</p>
                <p className="text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{config.demoLocation}</span>
                </p>
                <p className="text-slate-400 flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3 text-brand-orange shrink-0" />
                  <span className="truncate">{config.demoDetail}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading || authLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-emerald to-brand-teal hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 text-sm transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading {config.name} Portal...</span>
                </>
              ) : (
                <>
                  <span>{config.demoButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Side: Shared Login Card with Portal Selector */}
        <section className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isSignup ? `Create ${config.name} Account` : config.cardTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isSignup
                ? `Create your verified ${config.name} account to access the platform.`
                : config.cardSubtitle}
            </p>
          </div>

          {/* Reusable Portal Selector Component: [ Student ] [ Industry ] [ College ] */}
          <PortalSelector selectedRole={selectedRole} onRoleChange={handleRoleChange} />

          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                !isSignup
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                isSignup
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5 pt-1">
            {/* Signup Only: Display Name */}
            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name / Organization Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required={isSignup}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                    placeholder={
                      selectedRole === 'student'
                        ? 'Aarav Sharma'
                        : selectedRole === 'industry'
                        ? 'TechNova Labs'
                        : 'AYUSH Institute of Technology'
                    }
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {config.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                  placeholder={config.emailPlaceholder}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isSignup ? 6 : 1}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Signup Only: College / University (for Student) */}
            {isSignup && selectedRole === 'student' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                    placeholder="RV College of Engineering"
                  />
                </div>
              </div>
            )}

            {/* Signup Only: Phone Number */}
            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {isSignup
                      ? `Sign Up as ${config.name}`
                      : config.submitButtonText}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              or continue with
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading || authLoading}
            className="w-full py-2.5 px-4 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 text-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-sm"
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Quick 1-Click Navigation Footnote */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              Skip login &amp; explore {config.name} Portal directly &rarr;
            </button>
            <span className="text-[11px] text-slate-500">
              Demo credentials prefilled. Switch tabs above to access other portals.
            </span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 pt-4">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge &bull; Ministry of Ayush &amp; SIH 2026</span>
        <span>Team ID: GAT054 &bull; {config.footerModule}</span>
      </footer>
    </div>
  );
}

export function UnifiedLoginPage({ initialRole = 'student' }: UnifiedLoginPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <UnifiedLoginContent initialRole={initialRole} />
    </Suspense>
  );
}

export default UnifiedLoginPage;
