'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Sparkles, Crosshair, Building2, Zap } from 'lucide-react';

export const HeroMapAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Base 2D Google Maps Style Vector Grid */}
      <svg
        className="absolute right-0 top-0 w-full h-full object-cover opacity-35 md:opacity-50 transition-opacity"
        viewBox="0 0 900 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="mapFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#082F38" stopOpacity="1" />
            <stop offset="40%" stopColor="#082F38" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#0D5C68" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0D5C68" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="roadHwy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
          </linearGradient>

          {/* Radar animation pulse */}
          <radialGradient id="radarPing">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* City Blocks & Land Use Patches (2D Map terrain) */}
        <rect x="420" y="40" width="130" height="90" rx="12" fill="#0A3F49" fillOpacity="0.5" />
        <rect x="580" y="30" width="160" height="110" rx="16" fill="#0C4854" fillOpacity="0.45" />
        <rect x="760" y="60" width="120" height="85" rx="10" fill="#0A3F49" fillOpacity="0.4" />

        <rect x="460" y="160" width="150" height="120" rx="14" fill="#0D515E" fillOpacity="0.4" />
        <rect x="630" y="170" width="140" height="100" rx="12" fill="#093842" fillOpacity="0.6" />
        <rect x="790" y="180" width="100" height="130" rx="12" fill="#0A3F49" fillOpacity="0.45" />

        <rect x="440" y="310" width="160" height="110" rx="16" fill="#0B4450" fillOpacity="0.4" />
        <rect x="620" y="300" width="170" height="120" rx="14" fill="#0D515E" fillOpacity="0.35" />
        <rect x="810" y="330" width="80" height="90" rx="8" fill="#093842" fillOpacity="0.5" />

        {/* Water body / Lake (Like Bellandur / Ulsoor Lake) */}
        <path
          d="M 680,60 C 720,40 760,80 790,110 C 820,140 800,190 770,210 C 740,230 710,190 690,160 C 670,130 650,80 680,60 Z"
          fill="url(#riverGrad)"
        />

        {/* Secondary Street Network (White translucent 2D grid) */}
        <g stroke="#E2E8F0" strokeWidth="2" strokeOpacity="0.15">
          {/* Horizontal avenues */}
          <line x1="380" y1="50" x2="900" y2="50" />
          <line x1="360" y1="100" x2="900" y2="100" />
          <line x1="380" y1="150" x2="900" y2="150" />
          <line x1="350" y1="210" x2="900" y2="210" />
          <line x1="370" y1="280" x2="900" y2="280" />
          <line x1="350" y1="340" x2="900" y2="340" />
          <line x1="380" y1="400" x2="900" y2="400" />

          {/* Vertical roads */}
          <line x1="430" y1="0" x2="430" y2="450" />
          <line x1="500" y1="0" x2="500" y2="450" />
          <line x1="570" y1="0" x2="570" y2="450" />
          <line x1="640" y1="0" x2="640" y2="450" />
          <line x1="720" y1="0" x2="720" y2="450" />
          <line x1="790" y1="0" x2="790" y2="450" />
          <line x1="860" y1="0" x2="860" y2="450" />
        </g>

        {/* Primary Arterial Roads & Ring Roads (Yellow/Amber highway styling like Google Maps) */}
        <g stroke="url(#roadHwy)" strokeWidth="4" strokeLinecap="round">
          {/* Outer Ring Road (Curved Highway) */}
          <path d="M 380,380 C 490,320 540,240 600,210 C 660,180 730,130 880,90" />
          {/* Diagonal Expressway */}
          <path d="M 460,20 C 510,120 620,220 740,310 C 800,360 850,410 900,430" />
          {/* Major cross link */}
          <path d="M 400,150 L 900,150" strokeWidth="3" />
          <path d="M 640,0 L 640,450" strokeWidth="3" />
        </g>

        {/* Active Route Trajectory with Moving Light Dot */}
        <path
          d="M 520,290 C 560,260 590,240 650,210 C 700,180 740,160 760,130"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeDasharray="6, 6"
          fill="none"
          strokeOpacity="0.8"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Radar Range Rings from Student Location */}
        <circle cx="520" cy="290" r="45" fill="url(#radarPing)">
          <animate attributeName="r" values="20;75;110" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="520" cy="290" r="90" stroke="#10B981" strokeWidth="1" strokeDasharray="3, 4" strokeOpacity="0.3" />
        <circle cx="520" cy="290" r="160" stroke="#10B981" strokeWidth="1" strokeDasharray="4, 6" strokeOpacity="0.2" />

        {/* Left Darkening Mask Gradient (Protects Text Readability) */}
        <rect x="0" y="0" width="550" height="450" fill="url(#mapFade)" />
      </svg>

      {/* 2. Interactive Animated HTML Pins & Floating Badges */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* User Location Marker: Bengaluru (RVCE / Tech Corridor) */}
        <div
          className="absolute hidden md:flex items-center gap-2"
          style={{ left: '57%', top: '64%' }}
        >
          <div className="relative">
            <span className="flex h-6 w-6 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white shadow-lg items-center justify-center text-white">
                <Navigation className="w-3 h-3 transform -rotate-45" />
              </span>
            </span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-400/40 px-2.5 py-1 rounded-xl shadow-lg text-[11px] text-emerald-300 font-bold whitespace-nowrap animate-pulse">
            📍 You are here &bull; Bengaluru
          </div>
        </div>

        {/* Pin 1: Google India (Internship - Green) */}
        <div
          className="absolute hidden lg:flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          style={{ right: '14%', top: '22%' }}
        >
          <div className="bg-slate-900/85 backdrop-blur-md border border-emerald-400 px-2 py-0.5 rounded-lg shadow-xl text-[10px] text-white font-bold mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Google &bull; 87% Match
          </div>
          <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black">
            G
          </div>
        </div>

        {/* Pin 2: Swiggy (Business Analyst - Orange) */}
        <div
          className="absolute hidden md:flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          style={{ right: '28%', top: '44%' }}
        >
          <div className="bg-slate-900/85 backdrop-blur-md border border-orange-400 px-2 py-0.5 rounded-lg shadow-xl text-[10px] text-white font-bold mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Swiggy &bull; 3.9 km
          </div>
          <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black">
            S
          </div>
        </div>

        {/* Pin 3: AyurBridge Startup Sprint (Micro-Internship - Blue) */}
        <div
          className="absolute hidden lg:flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          style={{ right: '40%', top: '28%' }}
        >
          <div className="bg-slate-900/85 backdrop-blur-md border border-blue-400 px-2 py-0.5 rounded-lg shadow-xl text-[10px] text-white font-bold mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            AyurBridge &bull; 2.4 km
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Floating Mini Radar HUD Card on Right Side */}
        <div
          className="absolute hidden xl:flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/75 backdrop-blur-lg border border-white/20 shadow-2xl text-xs text-white"
          style={{ right: '2.5rem', bottom: '2rem' }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              Live Opportunity Radar
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              GPS Active
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>Nearby Radius:</span>
              <strong className="text-white font-mono">10 km</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Matching Roles:</span>
              <strong className="text-emerald-400 font-mono">19 Live</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Top Skill Demanded:</span>
              <strong className="text-amber-300">Python &bull; SQL</strong>
            </div>
          </div>

          <Link
            href="/student/opportunities"
            className="mt-1 w-full py-1 px-2.5 bg-white/10 hover:bg-white/20 text-center rounded-lg text-[11px] font-bold text-slate-200 transition-colors block"
          >
            Open Interactive Map &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
