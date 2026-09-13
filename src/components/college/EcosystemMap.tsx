'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Building2, Briefcase, GraduationCap, Compass } from 'lucide-react';

interface EcosystemPoint {
  id: string;
  name: string;
  type: 'Startup' | 'Corporate' | 'Partner' | 'Training';
  locationName: string;
  coordinates: { lat: number; lng: number };
  activeOffers: number;
}

export const EcosystemMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<EcosystemPoint | null>(null);

  const points: EcosystemPoint[] = [
    {
      id: 'p1',
      name: 'TechNova Labs (AI & Web)',
      type: 'Startup',
      locationName: 'Indiranagar, Bengaluru',
      coordinates: { lat: 12.9784, lng: 77.6408 },
      activeOffers: 18,
    },
    {
      id: 'p2',
      name: 'Infosys Campus',
      type: 'Corporate',
      locationName: 'Electronic City Phase I',
      coordinates: { lat: 12.8452, lng: 77.6602 },
      activeOffers: 85,
    },
    {
      id: 'p3',
      name: 'Bosch Engineering Center',
      type: 'Partner',
      locationName: 'Adugodi / Koramangala',
      coordinates: { lat: 12.9389, lng: 77.6163 },
      activeOffers: 40,
    },
    {
      id: 'p4',
      name: 'TCS Innovation Hub',
      type: 'Corporate',
      locationName: 'Whitefield, Bengaluru',
      coordinates: { lat: 12.9698, lng: 77.7499 },
      activeOffers: 120,
    },
    {
      id: 'p5',
      name: 'InnovateAI Incubator',
      type: 'Startup',
      locationName: 'HSR Layout, Bengaluru',
      coordinates: { lat: 12.9121, lng: 77.6445 },
      activeOffers: 12,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Nearby Industry Ecosystem</h3>
            <p className="text-xs text-slate-400">Bengaluru Industry &amp; Startup Hub Mapping</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          5 Active Hubs
        </span>
      </div>

      {/* Styled Interactive Map Area */}
      <div className="relative w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 group">
        {/* Map Grid Backdrop Styling */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Floating Hub Badges */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {points.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            return (
              <button
                key={pt.id}
                onClick={() => setSelectedPoint(pt)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-900/30 scale-105'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      pt.type === 'Startup'
                        ? 'bg-blue-500/20 text-blue-300'
                        : pt.type === 'Corporate'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {pt.type}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="font-bold mt-1 text-white truncate">{pt.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{pt.locationName}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Details Drawer */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-xs">
          {selectedPoint ? (
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                {selectedPoint.name} &bull; <span className="text-emerald-400">{selectedPoint.locationName}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedPoint.activeOffers} Active Internship &amp; Placement Roles Available for AYUSH Students
              </p>
            </div>
          ) : (
            <div className="text-slate-400 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Click any corporate hub above to view partnership details &amp; active opportunities.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
