'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, Cpu, Brain, ExternalLink, MapPin, RotateCw, Rocket } from 'lucide-react';
import type { Skill, Opportunity } from '@/types/student';
import { computeOpportunityMatch } from '@/lib/matchUtils';

// ponytail: fallback constants live here; swap for API call when a demo-data endpoint exists
const DUMMY = {
  skills: [
    { id: 'py',    name: 'Python',         score: '96%', desc: 'Algorithmic assessment: 96% confidence.' },
    { id: 'react', name: 'React Node',     score: '91%', desc: 'Verified across component architectures.' },
    { id: 'ml',    name: 'Machine Learn.', score: '94%', desc: '94% algorithm precision verified.' },
    { id: 'sql',   name: 'SQL Core',       score: '88%', desc: 'Verified optimization schema queries.' },
    { id: 'dsa',   name: 'Structures',     score: '95%', desc: '95% algorithm architecture alignment.' },
  ],
  gaps: [
    { title: 'System Design', severity: '- Critical',    desc: 'Missing in 94% match ML Engineer target.' },
    { title: 'Cloud Fund.',   severity: '- Medium',      desc: 'Deployment gaps in Kubernetes/AWS.' },
    { title: 'SQL Optimize',  severity: '- Recommended', desc: 'Advanced query profiling missing.' },
  ],
  topOpp: { title: 'ML Engineer Intern', company: 'Google India Research Labs', location: 'Bengaluru', matchScore: 94, matchedSkills: ['Python', 'ML Core', 'SQL Core'] },
  sideOpps: [
    { title: 'Data Analyst Intern', company: 'Swiggy India', score: 83 },
    { title: 'AI Intern',           company: 'Startup XYZ',  score: 76 },
  ],
} as const;

const SEVERITIES = ['- Critical', '- Medium', '- Recommended'] as const;
const OPP_HREF = '/student/opportunities';

export interface HeroCanvasAnimationProps {
  skills?: Skill[];
  opportunities?: Opportunity[];
  className?: string;
}

// Core status tied to animation step — single source of truth
const STEP_STATUS: Record<number, { text: string; color: string }> = {
  0: { text: 'Analyzing Profile...', color: 'text-sky-400' },
  2: { text: 'VECTORIZING...',       color: 'text-purple-400' },
  3: { text: 'ANALYSIS COMPLETE',    color: 'text-emerald-400' },
};

export const HeroCanvasAnimation: React.FC<HeroCanvasAnimationProps> = ({
  skills,
  opportunities,
  className = '',
}) => {
  // Derived canvas data — only recomputes when array lengths change
  const { canvasSkills, topOpp, gaps, sideOpps, isLive } = useMemo(() => {
    const sk = skills ?? [];
    const op = opportunities ?? [];

    const realSkills = sk
      .filter((s) => s.isVerified || s.progress > 0 || s.category === 'Resume')
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        name: s.name.length > 14 ? s.name.slice(0, 13) + '.' : s.name,
        score: s.bestScore != null ? `${s.bestScore}%` : s.isVerified ? '✓ Verified' : `${s.progress}%`,
        desc: s.resumeEvidence
          ? `Resume evidence: "${s.resumeEvidence.slice(0, 80)}"`
          : s.isVerified
          ? `Verified skill: ${s.name}. Assessment passed.`
          : `${s.progress}% progress tracked toward verification.`,
      }));

    if (realSkills.length < 3 || !op.length) {
      return { canvasSkills: DUMMY.skills, topOpp: DUMMY.topOpp, gaps: DUMMY.gaps, sideOpps: DUMMY.sideOpps, isLive: false };
    }

    const scored = op
      .map((o) => ({ opp: o, r: computeOpportunityMatch(o, sk) }))
      .sort((a, b) => b.r.matchScore - a.r.matchScore);

    const best = scored[0];
    const missing = best.r.missingSkills.slice(0, 3);

    return {
      canvasSkills: realSkills,
      isLive: true,
      topOpp: {
        title: best.opp.title,
        company: best.opp.company,
        location: best.opp.city || best.opp.location,
        matchScore: Math.round(best.r.matchScore),
        matchedSkills: best.r.matchedSkills.slice(0, 3),
      },
      gaps: missing.length
        ? missing.map((name, i) => ({
            title: name.length > 11 ? name.slice(0, 10) + '.' : name,
            severity: SEVERITIES[i] ?? '- Recommended',
            desc: `Missing for "${best.opp.title}" at ${best.opp.company}.`,
          }))
        : DUMMY.gaps,
      // fill to 2 with dummy if fewer real side-opps exist
      sideOpps: [
        ...scored.slice(1, 3).map((s) => ({ title: s.opp.title, company: s.opp.company, score: Math.round(s.r.matchScore) })),
        ...DUMMY.sideOpps,
      ].slice(0, 2),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills?.length, opportunities?.length]);

  const [activeStep, setActiveStep] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  // Merge status text+color into one object to halve setState calls
  const [coreStatus, setCoreStatus] = useState(STEP_STATUS[0]);

  const counterRef = useRef<NodeJS.Timeout | null>(null);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const startTimeline = (target: number) => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (counterRef.current) clearInterval(counterRef.current);

    setActiveStep(0); setMatchPercent(0); setCoreStatus(STEP_STATUS[0]);

    const at = (fn: () => void, ms: number) => { timeouts.current.push(setTimeout(fn, ms)); };

    at(() => setActiveStep(1), 1500);
    at(() => { setActiveStep(2); setCoreStatus(STEP_STATUS[2]); }, 2500);
    at(() => { setActiveStep(3); setCoreStatus(STEP_STATUS[3]); }, 4000);
    at(() => setActiveStep(4), 5500);
    at(() => setActiveStep(5), 7000);
    at(() => {
      setActiveStep(6);
      let n = 0;
      counterRef.current = setInterval(() => {
        n += 1; setMatchPercent(n);
        if (n >= target && counterRef.current) clearInterval(counterRef.current);
      }, Math.max(10, 1800 / target));
    }, 8500);
    at(() => setActiveStep(7), 11500);
    at(() => startTimeline(target), 13000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveStep(6); setMatchPercent(topOpp.matchScore); setCoreStatus(STEP_STATUS[3]);
      return;
    }
    startTimeline(topOpp.matchScore);
    return () => { timeouts.current.forEach(clearTimeout); if (counterRef.current) clearInterval(counterRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topOpp.matchScore]);

  return (
    <div className={`relative w-full max-w-[920px] mx-auto select-none ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Interactive Intelligence Simulation
        </span>
        <button
          onClick={() => startTimeline(topOpp.matchScore)}
          className="text-[10px] tracking-wider uppercase font-semibold text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 border border-emerald-500/30 hover:border-emerald-400 px-2.5 py-1 rounded-lg bg-brand-dark/80 backdrop-blur-md transition-all active:scale-95"
        >
          <RotateCw className="w-3 h-3 text-emerald-400" />
          Restart Simulation
        </button>
      </div>

      <div className="w-full overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-none">
        <div className="relative w-full min-w-[780px] lg:min-w-0 max-w-[920px] aspect-[88/50] bg-[#031920]/95 border border-emerald-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(5,150,105,0.30),0_0_100px_rgba(5,150,105,0.10)] overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* SVG connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 880 500" fill="none">
            <defs>
              <filter id="canvasGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Skill → Core */}
            {[137, 189, 241, 292, 344].map((y) => (
              <React.Fragment key={y}>
                <path d={`M 234 ${y} C ${y < 200 ? 280 : 290} ${y}, 325 185, 366 185`} stroke="rgba(16,185,129,0.45)" strokeWidth="1.5" />
                <circle cx="234" cy={y} r="2.5" fill="#10B981" opacity="1" />
              </React.Fragment>
            ))}
            <circle cx="366" cy="185" r="3.5" fill="#34D399" opacity="1" filter="url(#canvasGlow)" />

            {/* Gap detection trunk + branches */}
            <g opacity={activeStep >= 2 ? 1 : 0.35} className="transition-opacity duration-500">
              <path d="M 440 275 L 440 360" stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="440" cy="360" r="2.5" fill="#F59E0B" opacity="0.9" />
              {(['M 440 360 C 440 382, 354 382, 354 404', 'M 440 360 L 440 404', 'M 440 360 C 440 382, 526 382, 526 404'] as const).map((d) => (
                <path key={d} d={d} stroke="rgba(245,158,11,0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
              ))}
              {[354, 440, 526].map((cx) => <circle key={cx} cx={cx} cy="404" r="2" fill="#F59E0B" opacity="0.85" />)}
              {activeStep >= 3 && [
                { d: 'M 440 275 L 440 360 C 440 382, 354 382, 354 404', begin: '0s' },
                { d: 'M 440 275 L 440 404', begin: '0.3s' },
                { d: 'M 440 275 L 440 360 C 440 382, 526 382, 526 404', begin: '0.6s' },
              ].map(({ d, begin }) => (
                <circle key={d} r="2.5" fill="#F59E0B" opacity="0.95" filter="url(#canvasGlow)">
                  <animateMotion dur="2.4s" begin={begin} repeatCount="indefinite" path={d} />
                </circle>
              ))}
            </g>

            {/* Core → top match */}
            <path d="M 514 185 C 540 185, 570 210, 602 210" stroke={activeStep >= 6 ? 'rgba(167,139,250,0.55)' : 'rgba(167,139,250,0.2)'} strokeWidth="2" className="transition-all duration-500" />
            {activeStep >= 6 && (
              <circle r="3" fill="#A78BFA" opacity="0.95" filter="url(#canvasGlow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 514 185 C 540 185, 570 210, 602 210" />
              </circle>
            )}

            {/* Flowing particles: skills → core */}
            {activeStep >= 1 && [0, 0.8, 1.6, 2.4, 3.2].map((begin, i) => (
              <circle key={i} r="3" fill="#34D399" opacity="0.95" filter="url(#canvasGlow)">
                <animateMotion dur="4s" begin={`${begin}s`} repeatCount="indefinite"
                  path={`M 234 ${[137, 189, 241, 292, 344][i]} C 285 ${[137, 189, 241, 292, 344][i]}, 325 185, 366 185`} />
              </circle>
            ))}
          </svg>

          {/* ── LEFT: Skill cards ── */}
          <div style={{ left: '28px', top: '30px', bottom: '30px', width: '206px' }} className="absolute flex flex-col justify-between z-10 pointer-events-none">
            <div className="text-[10px] tracking-wider text-emerald-400/60 uppercase font-bold border-b border-emerald-500/30 pb-1.5">Verified Profile</div>
            <div className="space-y-3 my-auto pointer-events-auto">
              {canvasSkills.map((skill, idx) => (
                <div
                  key={skill.id}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                  className={`group relative flex items-center justify-between h-[38px] bg-[#020e12] border px-3 py-2 rounded-lg text-xs cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    activeStep === 0
                      ? 'border-emerald-400/80 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                      : 'border-emerald-900/80 hover:border-emerald-500 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 text-slate-100 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-medium text-[11px] truncate">{skill.name}</span>
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold font-mono shrink-0 border border-emerald-500/30">{skill.score}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#020e12] border border-emerald-500/50 p-2.5 rounded-lg text-left shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                    <p className="font-semibold text-emerald-300 text-[10px] mb-0.5">VERIFIED {skill.name}</p>
                    <p className="text-slate-400 text-[9px] leading-tight">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>{isLive ? `${(skills ?? []).filter((s) => s.isVerified).length} verified` : 'Demo data'}</span>
              <span>SETU.PROFILE</span>
            </div>
          </div>

          {/* ── CENTER: AI Engine ── */}
          <div
            id="ai-engine-core"
            style={{ left: '50%', top: '37%', transform: 'translate(-50%, -50%)' }}
            className="pointer-events-auto group absolute w-[180px] h-[180px] flex flex-col items-center justify-center z-20 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full border border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Rocket className="w-4 h-4 text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.99)] rotate-45" />
                <span className="absolute -left-1.5 w-1 h-1 rounded-full bg-emerald-300 shadow-[0_0_8px_#34D399] animate-ping" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#10B981]" />
              </div>
            </div>
            <div className="absolute inset-2 rounded-full border border-dashed border-teal-400/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
              {[0, 120, 240].map((angle) => (
                <div key={angle} className="absolute inset-0 flex items-start justify-center pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
                  <div className="w-1.5 h-1.5 -mt-[3px] rounded-full bg-emerald-300 shadow-[0_0_10px_#10B981]" />
                </div>
              ))}
            </div>
            <div className="absolute inset-4 rounded-full bg-[#020e12] border-2 border-emerald-400/60 shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center text-center p-3">
              <Cpu className="w-4 h-4 text-emerald-300 animate-pulse drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <h4 className="text-white text-[11px] font-bold tracking-widest uppercase mt-1">AI ENGINE</h4>
              <div className={`text-[9px] uppercase tracking-wider font-bold mt-0.5 transition-colors duration-300 ${coreStatus.color}`}>{coreStatus.text}</div>
              <div className="absolute bottom-2.5 text-[8px] font-mono text-slate-500 flex items-center space-x-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                <span>GAP_ENGINE.v2</span>
              </div>
            </div>
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#020e12] border border-emerald-400/60 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300 tracking-wider uppercase whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.2)]">Profile Vector</div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#020e12] border border-purple-400/60 px-2 py-0.5 rounded text-[8px] font-mono text-purple-300 tracking-wider uppercase whitespace-nowrap shadow-[0_0_10px_rgba(167,139,250,0.2)]">Role Matcher</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-[#020e12] border border-emerald-400/50 p-3 rounded-lg text-left shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
              <h5 className="font-bold text-emerald-300 text-[11px] flex items-center gap-1.5 mb-1"><Brain className="w-3.5 h-3.5" />CAREER INTELLIGENCE ENGINE</h5>
              <p className="text-slate-300 text-[9.5px] leading-tight mb-1">Vectorizing verified skills against live opportunity requirement schemas.</p>
              <div className="text-[8.5px] text-slate-400 font-mono mt-2 border-t border-slate-800 pt-1.5 flex justify-between">
                <span>ACTIVE PIPES: {canvasSkills.length}</span>
                <span className="text-emerald-400">HEALTHY</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Gap boxes ── */}
          <div
            style={{ left: '50%', transform: 'translateX(-50%)', bottom: '26px' }}
            className={`absolute w-[260px] h-[95px] flex flex-col justify-between z-10 transition-all duration-500 ${activeStep >= 4 ? 'opacity-100' : 'opacity-25'}`}
          >
            <div className="text-center">
              <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                {gaps.length} Gap{gaps.length !== 1 ? 's' : ''} Identified
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {gaps.map((gap) => (
                <div key={gap.title} className="relative flex flex-col items-center p-1.5 rounded bg-[#020e12] border border-dashed border-amber-400/50 hover:border-amber-300 hover:shadow-[0_0_8px_rgba(245,158,11,0.25)] transition-all duration-200 group cursor-pointer">
                  <span className="text-[8.5px] text-slate-200 font-semibold truncate max-w-full">{gap.title}</span>
                  <span className="text-[7.5px] text-amber-300 font-mono font-bold mt-0.5">{gap.severity}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#020e12] border border-amber-400/50 p-2.5 rounded-lg text-left shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                    <p className="font-semibold text-amber-300 text-[10px] mb-0.5">GAP: {gap.title}</p>
                    <p className="text-slate-400 text-[9px] leading-tight">{gap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Opportunity pipeline ── */}
          <div style={{ right: '28px', top: '30px', bottom: '30px', width: '250px' }} className="absolute flex flex-col justify-between z-10 pointer-events-none">
            <div className="text-[10px] tracking-wider text-emerald-400/60 uppercase font-bold border-b border-emerald-500/30 pb-1.5 text-right">Matching Pipeline</div>

            <div className="space-y-3 my-auto relative pointer-events-auto">
              {/* Secondary #1 */}
              <div className={`relative flex items-center justify-between p-2.5 rounded-lg bg-[#020e12] border border-emerald-900/60 text-xs transition-all duration-500 ${activeStep >= 6 ? 'opacity-25 scale-95' : activeStep >= 5 ? 'opacity-70' : 'opacity-20 scale-95'}`}>
                <div>
                  <h5 className="font-bold text-white text-[11px]">{sideOpps[0].title}</h5>
                  <p className="text-[9px] text-slate-400">{sideOpps[0].company}</p>
                </div>
                <span className="font-bold text-teal-300 text-[10px] bg-teal-400/20 border border-teal-500/30 px-2 py-0.5 rounded font-mono">{sideOpps[0].score}%</span>
              </div>

              {/* Primary match */}
              <div className={`group relative flex flex-col p-3.5 rounded-xl bg-[#020e12] border transition-all duration-500 z-30 ${
                activeStep >= 6
                  ? 'border-purple-400/80 shadow-[0_0_30px_rgba(167,139,250,0.30),inset_0_1px_0_rgba(167,139,250,0.1)] scale-102 opacity-100'
                  : 'border-emerald-900/60 opacity-30 scale-95'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/40 px-1.5 py-0.2 rounded uppercase font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />Verified
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-purple-300" />{topOpp.location}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-purple-200 transition-colors">{topOpp.title}</h4>
                <p className="text-[9px] text-slate-400 mb-2">{topOpp.company}</p>
                <div className="flex items-center justify-between mb-1 border-t border-slate-800/60 pt-1.5">
                  <span className="text-[9px] font-bold text-slate-300">Target Compatibility:</span>
                  <span className="text-xs sm:text-sm font-black text-purple-300 font-mono drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]">{matchPercent}% MATCH</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_6px_rgba(52,211,153,0.5)]" style={{ width: `${matchPercent}%` }} />
                </div>
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {topOpp.matchedSkills.map((s) => (
                    <span key={s} className="text-[7px] sm:text-[8px] bg-slate-800 border border-slate-700 text-slate-200 px-1.5 py-0.2 rounded">{s}</span>
                  ))}
                </div>
                <Link href={OPP_HREF} className="block w-full text-center bg-purple-900/40 hover:bg-purple-600 hover:text-white border border-purple-400/40 hover:border-purple-400 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-slate-200 py-1.5 rounded-md transition-all duration-200">
                  View Opportunity<ExternalLink className="w-2.5 h-2.5 inline-block ml-1" />
                </Link>
              </div>

              {/* Secondary #2 */}
              <div className={`relative flex items-center justify-between p-2 rounded-lg bg-[#020e12] border border-emerald-900/60 text-xs transition-all duration-500 ${activeStep >= 6 ? 'opacity-25 scale-95' : activeStep >= 5 ? 'opacity-70' : 'opacity-20 scale-95'}`}>
                <div>
                  <h5 className="font-bold text-white text-[10px] sm:text-[11px]">{sideOpps[1].title}</h5>
                  <p className="text-[8px] sm:text-[9px] text-slate-400">{sideOpps[1].company}</p>
                </div>
                <span className="font-bold text-teal-300 text-[9px] sm:text-[10px] bg-teal-400/20 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono">{sideOpps[1].score}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-slate-500 font-mono">
              <span>Routing Engines</span>
              <span className={isLive ? 'text-emerald-400' : ''}>{isLive ? 'Live Data' : 'Demo Mode'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
