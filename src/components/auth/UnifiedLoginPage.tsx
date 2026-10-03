'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  KeyRound,
  Loader2,
  AlertCircle,
  Award,
  Briefcase,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { PortalSelector, PortalRole } from './PortalSelector';
import { useAuth } from '@/context/AuthContext';
import { UserRole, isNetworkError } from '@/lib/firebase';

export interface PortalPillar {
  title: string;
  description: string;
}

export interface PortalConfig {
  id: PortalRole;
  name: string;
  tagline: string;
  badge: string;
  heroTitleMain: string;
  heroTitleGradient: string;
  heroDescription: string;
  cardTitle: string;
  cardSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButtonText: string;
  destination: string;
  pillars: PortalPillar[];
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
      'SkillSetu connects students, colleges, and industry through skill mapping, internships, real-world opportunities, and career pathways.',
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'Student Email Address',
    emailPlaceholder: 'Enter your student email',
    submitButtonText: 'Sign In to Student Portal',
    destination: '/student',
    pillars: [
      {
        title: 'Academia–Industry Skill Intelligence',
        description: 'SkillSetu connects students, colleges, and industry through skill mapping, internships, real-world opportunities, and career pathways.',
      },
      {
        title: 'Direct Industry Internships',
        description: 'Access curated startup sprints, research opportunities, and fast-track interview pipelines.',
      },
      {
        title: 'Dynamic Opportunity Radar',
        description: 'Discover nearby verified opportunities and apply in one click with your verified skills portfolio.',
      },
    ],
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
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'Work Email Address',
    emailPlaceholder: 'Enter your work email',
    submitButtonText: 'Sign In to Industry Portal',
    destination: '/industry/dashboard',
    pillars: [
      {
        title: '100-Point Match Engine',
        description: 'Transparent candidate scoring combining verified skills, projects, and academic rigor.',
      },
      {
        title: 'Kanban Hiring Pipeline',
        description: 'Streamlined multi-stage pipeline from screening to digital offer letter issuance.',
      },
      {
        title: 'Academia Partnerships',
        description: 'Direct bilateral MoUs, syllabus upgrade proposals, and sponsored hackathon challenges.',
      },
    ],
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
    cardTitle: 'Sign In to SkillSetu',
    cardSubtitle: 'Select your role to access your dedicated portal.',
    emailLabel: 'Institutional Email Address',
    emailPlaceholder: 'Enter your institutional email',
    submitButtonText: 'Sign In to College Portal',
    destination: '/college/dashboard',
    pillars: [
      {
        title: 'Batch Placement Intelligence',
        description: 'Track student readiness scores, department competency heatmaps, and placement drives in real-time.',
      },
      {
        title: 'Curriculum-Skill Alignment',
        description: 'Identify curriculum blindspots with real-time employer demand analytics and upgrade recommendations.',
      },
      {
        title: 'Bilateral MoU Studio',
        description: 'Formally collaborate with verified corporate employers under structured bilateral frameworks.',
      },
    ],
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
  const searchParams = useSearchParams();
  const {
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signUpWithGoogle,
    sendPasswordReset,
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
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const college = '';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [signupNotice, setSignupNotice] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Sync role if query parameter changes externally
  useEffect(() => {
    const roleParam = searchParams?.get('role')?.toLowerCase();
    if (roleParam === 'industry' || roleParam === 'company') {
      setSelectedRole('industry');
      setError(null);
    } else if (roleParam === 'college') {
      setSelectedRole('college');
      setError(null);
    } else if (roleParam === 'student') {
      setSelectedRole('student');
      setError(null);
    }
  }, [searchParams]);

  const config = PORTAL_CONFIGS[selectedRole];

  const handleRoleChange = (role: PortalRole) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsForgotPassword(false);
    setError(null);
    setSignupNotice(null);
    setResetSuccess(null);

    // Update browser URL query parameter without triggering page reload/flicker
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', role);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Confirm Password validation on signup
    if (isSignup) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify and try again.');
        setIsLoading(false);
        return;
      }
    }

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
        const result = await signUpWithEmailPassword(
          email,
          password,
          displayName || (selectedRole === 'student' ? 'Student' : config.name),
          fbRole,
          selectedRole === 'student' ? '' : phone,
          selectedRole === 'student' ? '' : college
        );
        if (result.pendingApproval) {
          setSignupNotice('Your organization access request was submitted. You can sign in after an administrator approves it.');
          return;
        }
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
            // Auto-provision uncreated accounts cleanly
            const result = await signUpWithEmailPassword(
              email,
              password,
              displayName || config.name,
              fbRole,
              phone,
              college
            );
            if (result.pendingApproval) {
              setSignupNotice('Your organization access request was submitted. You can sign in after an administrator approves it.');
              return;
            }
          } else {
            throw loginErr;
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email sign-in is not enabled. Please enable it in Firebase Console.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials and try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Account not found. Please sign up to create a new account.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.message?.includes('auth/popup-blocked')) {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (isNetworkError(err)) {
        setError('Network connection interrupted. Please check your internet connection.');
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
        const result = await signUpWithGoogle(fbRole, displayName || config.name, phone, college);
        if (result.pendingApproval) {
          setSignupNotice('Your organization access request was submitted. You can sign in after an administrator approves it.');
        }
      } else {
        await signInWithGoogle();
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in Firebase Console.');
      } else if (err.code === 'auth/popup-closed-timeout' || err.message?.includes('popup')) {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else if (isNetworkError(err)) {
        setError('Unable to reach Google authentication service. Please verify your network.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resetEmail.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsResetLoading(true);
    setError(null);
    setResetSuccess(null);

    try {
      await sendPasswordReset(targetEmail);
      // Security standard: generic success message prevents email enumeration
      setResetSuccess(
        'If an account exists with this email, you will receive a password reset link. Please check your inbox and spam folder.'
      );
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Do not expose whether an account exists for security reasons
        setResetSuccess(
          'If an account exists with this email, you will receive a password reset link. Please check your inbox and spam folder.'
        );
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many reset attempts. Please wait a few moments before trying again.');
      } else if (isNetworkError(err)) {
        setError('Network connection interrupted. Please check your internet connection.');
      } else {
        setError(err.message || 'Unable to process password reset request. Please try again.');
      }
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:px-10 lg:py-3.5 relative selection:bg-emerald-100 selection:text-emerald-950">
      {/* Subtle soft ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,92,104,0.07),rgba(255,255,255,0))] -z-10" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(56,189,248,0.1),rgba(255,255,255,0))] -z-10" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-md shadow-brand-teal/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
              Skill<span className="text-emerald-700">Setu</span>
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-emerald-800">
              {config.tagline}
            </div>
          </div>
        </div>

        <div className="text-xs bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 text-slate-700 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-700">Official Placement &amp; Skill Network</span>
        </div>
      </header>

      {/* Main Login Card Grid */}
      <main className="flex-1 my-auto max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-2 sm:py-3">
        {/* Left Side: Product Mission & Platform Pillars */}
        <section className="lg:col-span-6 space-y-4 lg:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/90 text-emerald-800 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>{config.badge}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              <span>{config.heroTitleMain} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800">
                {config.heroTitleGradient}
              </span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed">
              {config.heroDescription}
            </p>
          </div>

          {/* Clean Capability Highlights */}
          <div className="space-y-2.5 pt-1">
            {config.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white/85 border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-start gap-3 backdrop-blur-xs transition-all hover:bg-white"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  {idx === 0 ? (
                    <Award className="w-4 h-4 text-emerald-700" />
                  ) : idx === 1 ? (
                    <Briefcase className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Shared Login Card with Portal Selector */}
        <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-blue-950/8 space-y-4">
          {isForgotPassword ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Forgot Password?
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Enter your registered email address and we&apos;ll send you a password reset link.
                </p>
              </div>

              {/* Success Banner */}
              {resetSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{resetSuccess}</div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </div>
              )}

              {/* Password Reset Form */}
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3.5 pt-0.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                      placeholder="Enter your registered email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50 mt-1"
                >
                  {isResetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-slate-100 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      if (resetEmail) setEmail(resetEmail);
                      setError(null);
                      setResetSuccess(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {isSignup ? `Create ${config.name} Account` : config.cardTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSignup
                    ? `Enter your details to register as a verified ${config.name}.`
                    : config.cardSubtitle}
                </p>
              </div>

              {/* Reusable Portal Selector Component: [ Student ] [ Industry ] [ College ] */}
              <PortalSelector selectedRole={selectedRole} onRoleChange={handleRoleChange} />

              {signupNotice && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-900" role="status">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>{signupNotice}</span>
                </div>
              )}

              {/* Sign In vs Sign Up Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError(null);
                    setSignupNotice(null);
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    !isSignup
                      ? 'bg-white text-emerald-950 font-bold shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError(null);
                    setSignupNotice(null);
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    isSignup
                      ? 'bg-white text-emerald-950 font-bold shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3 pt-0.5">
                {/* Signup Only: Display Name */}
                {isSignup && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {selectedRole === 'student'
                        ? 'Full Name'
                        : selectedRole === 'industry'
                        ? 'Company / Recruiter Name'
                        : 'Institution Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={isSignup}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                        placeholder={
                          selectedRole === 'student'
                            ? 'Enter your full name'
                            : selectedRole === 'industry'
                            ? 'Enter company or recruiter name'
                            : 'Enter institution authority name'
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {config.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                      placeholder={config.emailPlaceholder}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={isSignup ? 6 : 1}
                      className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                      placeholder={isSignup ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link in Sign In mode */}
                  {!isSignup && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetEmail(email);
                          setError(null);
                          setResetSuccess(null);
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Signup Only: Confirm Password */}
                {isSignup && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={isSignup}
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Signup Only: Phone Number (Industry / College) */}
                {isSignup && selectedRole !== 'student' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-sans"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50 mt-1"
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
                          ? (selectedRole === 'student' ? 'Create Student Account' : `Create ${config.name} Account`)
                          : config.submitButtonText}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Google Sign-in Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading || authLoading}
                className="w-full py-2 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 text-xs sm:text-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-xs"
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
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full py-1.5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 shrink-0">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge &bull; Ministry of Ayush &bull; All rights reserved.</span>
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacy Policy</span>
          <span>&bull;</span>
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Terms of Service</span>
          <span>&bull;</span>
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Help &amp; Support</span>
        </div>
      </footer>
    </div>
  );
}

export function UnifiedLoginPage({ initialRole = 'student' }: UnifiedLoginPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EFF6FA]" />}>
      <UnifiedLoginContent initialRole={initialRole} />
    </Suspense>
  );
}

export default UnifiedLoginPage;
