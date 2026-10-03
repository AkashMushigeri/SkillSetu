'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {  Crosshair, ArrowRight, X } from 'lucide-react';

export interface OpportunityPin {
  id: 'google' | 'swiggy' | 'ayur';
  name: string;
  role: string;
  matchScore: number;
  distanceKm: number;
  stipend: string;
  tag: string;
  initials: string;
  brandColor: string;
  x: number;
  y: number;
  pathD: string;
}

const OPPORTUNITIES: OpportunityPin[] = [
  {
    id: 'google',
    name: 'Google India',
    role: 'AI & Cloud Engineering Intern',
    matchScore: 87,
    distanceKm: 10.0,
    stipend: '₹50,000/mo',
    tag: 'High Match',
    initials: 'G',
    brandColor: '#10B981',
    x: 525,
    y: 85,
    pathD: 'M 310,230 C 360,120 445,85 525,85',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    role: 'Data & Operations Analyst',
    matchScore: 78,
    distanceKm: 3.9,
    stipend: '₹35,000/mo',
    tag: 'Nearby',
    initials: 'S',
    brandColor: '#F59E0B',
    x: 440,
    y: 175,
    pathD: 'M 310,230 C 355,210 400,195 440,175',
  },
  {
    id: 'ayur',
    name: 'AyurBridge Sprint',
    role: 'Full Stack Micro-Internship',
    matchScore: 92,
    distanceKm: 2.4,
    stipend: '₹25,000/mo',
    tag: 'Verified Sprint',
    initials: '⚡',
    brandColor: '#38BDF8',
    x: 180,
    y: 130,
    pathD: 'M 310,230 C 270,185 220,150 180,130',
  },
];

export interface HeroMapAnimationProps {
  userCity?: string;
  activeRoleCount?: number;
  topSkills?: string[];
  onSelectRole?: (roleId: string) => void;
}

export const HeroMapAnimation: React.FC<HeroMapAnimationProps> = ({
  userCity = 'Bengaluru',
  activeRoleCount = 19,
  topSkills = ['Python', 'React'],
  onSelectRole,
}) => {
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [hoveredOppId, setHoveredOppId] = useState<string | null>(null);

  const activeOpp = OPPORTUNITIES.find((o) => o.id === (selectedOppId || hoveredOppId));

  const handleSelect = (id: string | null) => {
    setSelectedOppId(id);
    if (id && onSelectRole) onSelectRole(id);
  };

  return (
    <div className="group relative w-full rounded-2xl overflow-hidden bg-slate-950/70 border border-emerald-500/25 shadow-2xl backdrop-blur-sm select-none">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .radar-anim-sweep,
          .radar-anim-pulse,
          .radar-anim-rocket,
          .radar-anim-packet {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {/* 1. Coordinate-Synchronized SVG Spatial Radar Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] overflow-hidden">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 680 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Vignette & Depth Mask */}
            <radialGradient id="mapVignette" cx="45%" cy="58%" r="65%">
              <stop offset="0%" stopColor="#082F38" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#062228" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#03161A" stopOpacity="1" />
            </radialGradient>

            {/* Radar Sweeper 40° Trailing Gradient */}
            <radialGradient id="radarSweepCone" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="65%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>

            {/* Central Origin Wave Pulse */}
            <radialGradient id="userOriginGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>

            {/* Career Launch Trajectory Gradient */}
            <linearGradient id="rocketLaunchGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.6" />
            </linearGradient>

            {/* Ion Flame Glow Filter */}
            <filter id="ionGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Gradient Fill */}
          <rect width="680" height="400" fill="url(#mapVignette)" />

          {/* --- Faint Arterial Grid & City Sector Geometry --- */}
          <g opacity="0.22">
            <rect x="120" y="60" width="110" height="75" rx="8" fill="#0A434E" />
            <rect x="250" y="45" width="135" height="85" rx="10" fill="#0B4B58" />
            <rect x="410" y="55" width="140" height="70" rx="8" fill="#093C46" />

            <rect x="110" y="160" width="125" height="95" rx="10" fill="#0D5361" />
            <rect x="400" y="150" width="130" height="90" rx="10" fill="#0A434E" />

            <rect x="140" y="275" width="140" height="90" rx="10" fill="#0A3F49" />
            <rect x="300" y="280" width="160" height="95" rx="12" fill="#0D515E" />

            <line x1="80" y1="90" x2="620" y2="90" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="80" y1="180" x2="620" y2="180" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="80" y1="280" x2="620" y2="280" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />

            <line x1="180" y1="30" x2="180" y2="370" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="310" y1="30" x2="310" y2="370" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="450" y1="30" x2="450" y2="370" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 4" />
          </g>

          {/* --- Concentric Radar Isochrones (Centered precisely at 310, 230) --- */}
          <g stroke="#10B981" fill="none">
            {/* Expanding Pulse Ring */}
            <circle cx="310" cy="230" r="20" fill="url(#userOriginGlow)" stroke="none" className="radar-anim-pulse">
              <animate attributeName="r" values="10;85;180" dur="4.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;0.22;0" dur="4.2s" repeatCount="indefinite" />
            </circle>

            {/* Fixed Range Circles with Monospace Calibration */}
            <circle cx="310" cy="230" r="55" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.35" />
            <circle cx="310" cy="230" r="115" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.25" />
            <circle cx="310" cy="230" r="185" strokeWidth="1" strokeDasharray="2 8" strokeOpacity="0.15" />

            <text x="315" y="178" fill="#34D399" fillOpacity="0.65" fontSize="7.5" fontFamily="monospace" fontWeight="bold">2.5 KM</text>
            <text x="315" y="118" fill="#34D399" fillOpacity="0.55" fontSize="7.5" fontFamily="monospace" fontWeight="bold">5.0 KM</text>
            <text x="315" y="48" fill="#34D399" fillOpacity="0.4" fontSize="7.5" fontFamily="monospace" fontWeight="bold">10 KM</text>

            {/* Center Precision Crosshairs */}
            <line x1="296" y1="230" x2="324" y2="230" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="310" y1="216" x2="310" y2="244" strokeWidth="1" strokeOpacity="0.5" />
          </g>

          {/* --- Perfectly Centered 360° Rotating Radar Sweep Scanner --- */}
          <g transform="translate(310, 230)" className="radar-anim-sweep">
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="6.5s"
                repeatCount="indefinite"
              />
              {/* 40° Trailing Sector */}
              <path
                d="M 0,0 L 210,0 A 210 210 0 0 0 176,-115 Z"
                fill="url(#radarSweepCone)"
              />
              {/* High-visibility leading scanner beam */}
              <line
                x1="0"
                y1="0"
                x2="210"
                y2="0"
                stroke="#34D399"
                strokeWidth="1.5"
                strokeOpacity="0.85"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* --- Opportunity Telemetry Links & Staggered Sonar Pings --- */}
          {OPPORTUNITIES.map((opp) => {
            const isSelected = selectedOppId === opp.id;
            const isHovered = hoveredOppId === opp.id;
            const isHighlighted = isSelected || isHovered;
            const isAnySelected = Boolean(selectedOppId || hoveredOppId);
            const opacity = isHighlighted ? 1 : isAnySelected ? 0.25 : 0.75;

            // Staggered timing for sonar beam detection illumination (sweep period is 6.5s)
            // AyurBridge: ~60% (3.9s), Google: ~90% (5.85s), Swiggy: ~93% (6.05s)
            const pingKeyTimes =
              opp.id === 'ayur'
                ? '0; 0.58; 0.62; 0.68; 1'
                : opp.id === 'google'
                ? '0; 0.88; 0.92; 0.98; 1'
                : '0; 0.91; 0.95; 1.0; 1';

            return (
              <g key={opp.id} className="transition-opacity duration-300" opacity={opacity}>
                {/* Telemetry Route Track */}
                <path
                  d={opp.pathD}
                  stroke={opp.id === 'google' ? 'url(#rocketLaunchGlow)' : opp.brandColor}
                  strokeWidth={isHighlighted ? 2.5 : opp.id === 'google' ? 2 : 1.25}
                  strokeDasharray="5 5"
                  fill="none"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="60"
                    to="0"
                    dur={opp.id === 'google' ? '2.5s' : '3.5s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Staggered Sonar Sweep Detection Ripple */}
                <circle
                  cx={opp.x}
                  cy={opp.y}
                  r="3"
                  stroke={opp.brandColor}
                  strokeWidth="1.5"
                  fill="none"
                  className="radar-anim-pulse"
                >
                  <animate
                    attributeName="r"
                    values="3; 3; 16; 24; 3"
                    keyTimes={pingKeyTimes}
                    dur="6.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0; 0; 0.85; 0; 0"
                    keyTimes={pingKeyTimes}
                    dur="6.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Data Packet Pulse traveling along route */}
                <circle r={isHighlighted ? 3 : 2} fill="#FFFFFF" opacity="0.9" className="radar-anim-packet">
                  <animateMotion
                    path={opp.pathD}
                    dur={opp.id === 'google' ? '2.5s' : '3.2s'}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* --- Career Rocket Launching on Parabolic Arc (Bengaluru -> Google) --- */}
          <g className="radar-anim-rocket">
            <animateMotion
              path="M 310,230 C 360,120 445,85 525,85"
              dur="4.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <animate
              attributeName="opacity"
              values="0; 0.2; 1; 1; 0.85; 0"
              keyTimes="0; 0.08; 0.2; 0.85; 0.94; 1"
              dur="4.5s"
              repeatCount="indefinite"
            />

            {/* Aerodynamic Aerospace Ship Vector (Enlarged for prominent visibility) */}
            <g transform="scale(1.45)">
              {/* Ion Exhaust Plume */}
              <ellipse cx="-13" cy="0" rx="7.5" ry="2.4" fill="#38BDF8" filter="url(#ionGlow)" opacity="0.9">
                <animate attributeName="rx" values="5.5;9.5;5.5" dur="0.22s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="-7.5" cy="0" rx="3.5" ry="1.3" fill="#FFFFFF" opacity="0.95" />

              {/* Titanium Fuselage */}
              <path
                d="M 11,0 C 8.5,-3 -3.5,-3 -6.5,-2.6 C -7.8,-1.7 -8.8,0 -8.8,0 C -8.8,0 -7.8,1.7 -6.5,2.6 C -3.5,3 8.5,3 11,0 Z"
                fill="#FFFFFF"
                stroke="#082F38"
                strokeWidth="0.5"
              />
              {/* Emerald Accents */}
              <path d="M 11,0 C 8.5,-2 5,-2.6 5,-2.6 L 5,2.6 C 5,2.6 8.5,2 11,0 Z" fill="#10B981" />
              <path d="M -3.5,-2.6 L -7,-6.5 L -6.2,-1.8 Z" fill="#0D5C68" />
              <path d="M -3.5,2.6 L -7,6.5 L -6.2,1.8 Z" fill="#0D5C68" />

              {/* Cyan Visor */}
              <circle cx="1.8" cy="0" r="1.5" fill="#38BDF8" stroke="#082F38" strokeWidth="0.5" />
            </g>
          </g>

          {/* --- Interactive Opportunity Nodes (Rendered in SVG for 100% Coordinate Precision) --- */}
          {OPPORTUNITIES.map((opp) => {
            const isSelected = selectedOppId === opp.id;
            const isHovered = hoveredOppId === opp.id;
            const isHighlighted = isSelected || isHovered;

            // Compute safe label offset (Google above, Swiggy below, Ayur above)
            const labelY = opp.id === 'swiggy' ? opp.y + 24 : opp.y - 20;
            const labelText =
              opp.id === 'google'
                ? `Google India · ${opp.matchScore}%`
                : `${opp.name} · ${opp.distanceKm}km`;

            return (
              <g
                key={opp.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => handleSelect(isSelected ? null : opp.id)}
                onMouseEnter={() => setHoveredOppId(opp.id)}
                onMouseLeave={() => setHoveredOppId(null)}
              >
                {/* Node Aura Glow */}
                <circle
                  cx={opp.x}
                  cy={opp.y}
                  r={isHighlighted ? 15 : 12}
                  fill={opp.brandColor}
                  opacity={isHighlighted ? 0.35 : 0.15}
                  className="transition-all duration-200"
                />

                {/* Node Core Bubble */}
                <circle
                  cx={opp.x}
                  cy={opp.y}
                  r={isHighlighted ? 11 : 9.5}
                  fill={opp.brandColor}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-lg"
                />

                {/* Node Company Initial */}
                <text
                  x={opp.x}
                  y={opp.y + 3.5}
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {opp.initials}
                </text>

                {/* Intelligent Compact Label Pill */}
                <g className="transition-all duration-200">
                  <rect
                    x={opp.x - 48}
                    y={labelY - 9}
                    width="96"
                    height="18"
                    rx="9"
                    fill={isHighlighted ? '#02181E' : '#041B21'}
                    fillOpacity="0.92"
                    stroke={isHighlighted ? '#FFFFFF' : opp.brandColor}
                    strokeWidth={isHighlighted ? '1.2' : '0.8'}
                    strokeOpacity={isHighlighted ? 0.9 : 0.6}
                  />
                  <text
                    x={opp.x}
                    y={labelY + 3.5}
                    fill={isHighlighted ? '#FFFFFF' : '#E2E8F0'}
                    fontSize="7.5"
                    fontWeight={isHighlighted ? 'bold' : '600'}
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}

          {/* --- User Anchor Location: Bengaluru (Centered at 310, 230) --- */}
          <g>
            {/* Outer Beacon Glow */}
            <circle cx="310" cy="230" r="14" fill="#10B981" opacity="0.25" />
            <circle cx="310" cy="230" r="10" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

            {/* Compass Heading Arrow */}
            <path
              d="M 310,224 L 314,233 L 310,231 L 306,233 Z"
              fill="#FFFFFF"
              transform="rotate(45 310 230)"
            />

            {/* Distinct User Location Pill: just "You" */}
            <g>
              <rect
                x="288"
                y="247"
                width="44"
                height="18"
                rx="9"
                fill="#02171C"
                fillOpacity="0.95"
                stroke="#10B981"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <circle cx="297" cy="256" r="2.5" fill="#34D399" />
              <text
                x="316"
                y="259.5"
                fill="#6EE7B7"
                fontSize="8.5"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                You
              </text>
            </g>
          </g>
        </svg>

        {/* Subtle Idle HUD Pill (Visible when idle so the animation is 100% unobstructed) */}
        {!activeOpp && (
          <div className="hidden sm:flex absolute bottom-3 right-3 items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-300 font-mono transition-opacity duration-300 group-hover:opacity-0 pointer-events-none shadow-lg z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Radar · {activeRoleCount} Live</span>
          </div>
        )}

        {/* 2. Desktop Docked Telemetry HUD & Opportunity Detail Card (Hidden by default to reveal animation; smoothly appears on hover or pin selection) */}
        <div
          className={`hidden sm:block absolute bottom-3 right-3 w-[275px] rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/30 p-3.5 shadow-2xl text-xs space-y-2.5 transition-all duration-300 pointer-events-auto z-20 ${
            activeOpp
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
          }`}
        >
          {activeOpp ? (
            /* Selected Opportunity Inspection State */
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                    style={{ backgroundColor: activeOpp.brandColor }}
                  >
                    {activeOpp.initials}
                  </span>
                  <span className="font-bold text-white text-xs truncate">{activeOpp.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono"
                    style={{ backgroundColor: `${activeOpp.brandColor}25`, color: activeOpp.brandColor }}
                  >
                    {activeOpp.matchScore}% Match
                  </span>
                  <button
                    onClick={() => handleSelect(null)}
                    className="text-slate-400 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10"
                    aria-label="Close details"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] leading-tight">{activeOpp.role}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{activeOpp.distanceKm} km away</span>
                <strong className="text-emerald-400 font-mono">{activeOpp.stipend}</strong>
              </div>

              <Link
                href="/student/opportunities"
                className="group w-full py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-[11px] transition-all duration-200 shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center justify-center gap-1.5"
              >
                <span>View Role Details & Apply</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            /* Live Opportunity Radar Telemetry State */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-100">
                  <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '9s' }} />
                  Live Opportunity Radar
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  GPS Active
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Scanning Radius:</span>
                  <span className="text-slate-100 font-mono font-bold bg-slate-800/60 px-1.5 py-0.5 rounded border border-white/5">
                    10.0 km
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Matching Roles:</span>
                  <span className="text-emerald-300 font-mono font-extrabold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                    {activeRoleCount} Live
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Primary Tech Stack:</span>
                  <span className="text-amber-300 font-medium bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded text-[10px]">
                    {topSkills.length > 0 ? topSkills.slice(0, 2).join(' · ') : 'Python · React'}
                  </span>
                </div>
              </div>

              <Link
                href="/student/opportunities"
                className="group w-full py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-[11px] transition-all duration-200 shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center justify-center gap-1.5 border border-emerald-400/30"
              >
                <span>Explore Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 3. Mobile Docked Telemetry Card (< sm viewports) */}
      <div className="sm:hidden p-3.5 border-t border-emerald-500/20 bg-slate-950/90 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            Live Opportunity Radar
          </span>
          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
            {activeRoleCount} Live Roles
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Radius: 10.0 km</span>
          <span className="text-amber-300 font-mono">
            {topSkills.length > 0 ? topSkills.slice(0, 2).join(' · ') : 'Python · React'}
          </span>
        </div>

        <Link
          href="/student/opportunities"
          className="group mt-2 w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Explore Interactive Map</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
