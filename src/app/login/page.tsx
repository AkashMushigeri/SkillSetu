'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/firebase';
import {
  Sparkles,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Briefcase,
  Loader2,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Phone,
  KeyRound,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signUpWithGoogle,
    loading: authLoading,
  } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleLabels: Record<UserRole, { label: string; icon: React.ElementType; desc: string; demoEmail: string; demoPass: string }> = {
    STUDENT: {
      label: 'Student',
      icon: GraduationCap,
      desc: 'Browse jobs, apply to internships, and build your verified skill portfolio.',
      demoEmail: 'aarav.sharma@rvce.edu.in',
      demoPass: 'demo123',
    },
    INDUSTRY: {
      label: 'Industry / Company',
      icon: Building2,
      desc: 'Post jobs, search verified candidates, schedule interviews, and manage hiring pipelines.',
      demoEmail: 'hr@technova.com',
      demoPass: 'industry123',
    },
    COLLEGE: {
      label: 'College',
      icon: School,
      desc: 'Monitor student placements, manage curriculum modules, and track industry partnerships.',
      demoEmail: 'admin@ayushcollege.edu',
      demoPass: 'college123',
    },
  };

  const RoleIcon = roleLabels[selectedRole].icon;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await signUpWithEmailPassword(
          email,
          password,
          displayName || roleLabels[selectedRole].label,
          selectedRole,
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
            await signUpWithEmailPassword(
              email,
              password,
              roleLabels[selectedRole].label,
              selectedRole,
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
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method > Google.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Account not found. Try signing up instead.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password. Please try again or sign up.');
      } else if (err.message?.includes('auth/popup-blocked')) {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
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
    try {
      if (isSignup) {
        await signUpWithGoogle(selectedRole, displayName || roleLabels[selectedRole].label, phone, college);
      } else {
        await signInWithGoogle();
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console: Authentication → Sign-in method → Google → Enable.');
      } else if (err.code === 'auth/popup-closed-timeout' || err.message?.includes('popup')) {
        setError('Popup closed or blocked. Please check your browser settings and try again.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCredentials = () => {
    setEmail(roleLabels[selectedRole].demoEmail);
    setPassword(roleLabels[selectedRole].demoPass);
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

      {/* Main Auth Card Grid */}
      <div className="max-w-5xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Product Mission & Info */}
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
            SkillSetu bridges college students with startups, industry
            internships, micro-sprints, and real-world tasks through verified
            skill mapping and transparent local opportunity matching.
          </p>

          {/* Role Info Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => {
              const Icon = roleLabels[role].icon;
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1.5 ${
                      isSelected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="font-bold text-sm">{roleLabels[role].label}</span>
                  {isSelected && (
                    <span className="text-[9px] text-emerald-400 font-normal mt-0.5">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500">
            <span className="text-emerald-400 font-semibold">{roleLabels[selectedRole].label}:</span> {roleLabels[selectedRole].desc}
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isSignup ? 'Create Your SkillSetu Account' : 'Sign In to SkillSetu'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isSignup
                ? `Signing up as ${roleLabels[selectedRole].label}. Use Google or email.`
                : `Signing in as ${roleLabels[selectedRole].label}. Use Google or email.`}
            </p>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 pt-1">
            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignup && (
              <>
                {selectedRole === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="RV College of Engineering"
                      className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSignup ? 'Creating Account...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isSignup ? `Sign Up as ${roleLabels[selectedRole].label}` : `Sign In as ${roleLabels[selectedRole].label}`}</span>
                </>
              )}
            </button>
          </form>

          {/* Google Sign-in */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading || authLoading}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl border border-slate-600 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    fillOpacity="0.5"
                    d="M43.611 20.083H42V20L40.091 20.023 40.091 20 40.091 20H2.072v3.515h.921c.847 0 1.615.465 2.035 1.184l-.04.328-2.485 7.454-3.088 9.244C.091 39.304 0 39.862 0 40.418v5.076h.921c1.015 0 1.954-.33 2.728-.949l.072-.054 5.28-4.01 5.28-.032v-.032c.02-.03 5.937-4.56 9.857-7.73l3.838-2.74c.846-.613 1.631-.205 1.631-.205l2.907-1.448 5.637-2.818c.41-.205.832-.41 1.252-.615 0 0 .09-.045.268-.133a4.663 4.663 0 0 0 1.443-1.162 4.455 4.455 0 0 0 .794-1.302l.07-.15c.105-.223.212-.446.313-.669l.02-.042C44.131 24.422 44 23.922 44 23.405c0-.613-.092-1.205-.256-1.769Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.272 1.253 8.147 3.386a8.405 8.405 0 0 1 3.025 5.388 8.404 8.404 0 0 1-3.293 6.735 8.26 8.26 0 0 1-6.083 2.317c-1.305 0-2.487-.36-3.413-.927l-.004.004-5.183 3.913a8.368 8.368 0 0 1-3.135-.32l.001-.001-1.993-6.036-.032-.096c-.03-.086-.062-.172-.09-.261.06-.052.123-.105.185-.156l.016-.013 5.399-4.074.05-.037c.87-.67 1.933-1.047 3.03-1.047m0-2.55c-3.656 0-6.9 1.418-9.237 3.724-.082-.21-.164-.427-.243-.646l.04-.12c.11-.33.254-.66.414-.986l5.25-7.86.013-.019c.014-.021.029-.042.044-.063l4.326-6.48 5.186-7.76c.016-.024 5.864 2.74 5.864 2.74 3.05.434 3.983 3.758 3.044 6.76-.937 3-3.427 5.007-6.34 5.904-.06.02-.126.043-.19.064z"
                  />
                </svg>
                <span>
                  {isSignup
                    ? `Sign Up with Google`
                    : 'Sign In with Google'}
                </span>
              </>
            )}
          </button>

          {/* Demo Credentials Shortcut */}
          {!isSignup && (
            <div className="border-t border-slate-800/80 pt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  loadDemoCredentials();
                  setPassword(roleLabels[selectedRole].demoPass);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
              >
                Load demo credentials for {roleLabels[selectedRole].label}
              </button>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="border-t border-slate-800/80 pt-3 text-center">
            {isSignup ? (
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setError(null);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
              >
                Already have an account? Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError(null);
                  setPassword('');
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
              >
                Need to create an account? Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 pt-4">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge &bull; Ministry of Ayush &amp; SIH 2026</span>
        <span>Team ID: GAT054</span>
      </div>
    </div>
  );
}
