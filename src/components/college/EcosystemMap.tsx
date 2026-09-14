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
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Nearby Industry Ecosystem</h3>
            <p className="text-xs text-slate-500">Bengaluru Industry &amp; Startup Hub Mapping</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          5 Active Hubs
        </span>
      </div>

      {/* Styled Interactive Map Area */}
      <div className="relative w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between p-4 group">
        {/* Map Grid Backdrop Styling */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

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
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md scale-105'
                    : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      pt.type === 'Startup'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : pt.type === 'Corporate'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}
                  >
                    {pt.type}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                </div>
                <p className="font-bold mt-1 text-slate-900 truncate">{pt.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{pt.locationName}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Details Drawer */}
        <div className="relative z-10 bg-white/95 border border-slate-200 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-xs shadow-sm">
          {selectedPoint ? (
            <div>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-teal" />
                {selectedPoint.name} &bull; <span className="text-brand-teal">{selectedPoint.locationName}</span>
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {selectedPoint.activeOffers} Active Internship &amp; Placement Roles Available for AYUSH Students
              </p>
            </div>
          ) : (
            <div className="text-slate-500 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Click any corporate hub above to view partnership details &amp; active opportunities.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
