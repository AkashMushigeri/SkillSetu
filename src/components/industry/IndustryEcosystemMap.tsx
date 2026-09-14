'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useIndustry } from '@/context/IndustryContext';
import { Compass, MapPin, Building2, Users, Loader2, Sparkles } from 'lucide-react';

const DynamicMap = dynamic(() => import('./IndustryMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] lg:min-h-[420px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
      <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
      <span className="text-xs font-semibold text-slate-500 mt-2">
        Loading Nearby Talent &amp; Ecosystem Map...
      </span>
    </div>
  ),
});

export const IndustryEcosystemMap: React.FC = () => {
  const { company, colleges, searchRadiusKm, setSearchRadiusKm, showToast } = useIndustry();

  // Calculate mock nearby stats based on radius
  const nearbyCollegesCount =
    searchRadiusKm <= 5 ? 4 : searchRadiusKm <= 10 ? 8 : searchRadiusKm <= 25 ? 14 : searchRadiusKm <= 50 ? 28 : 42;
  const verifiedCandidatesNearby =
    searchRadiusKm <= 5 ? 340 : searchRadiusKm <= 10 ? 860 : searchRadiusKm <= 25 ? 2184 : 4500;
  const partnerCompaniesNearby =
    searchRadiusKm <= 5 ? 6 : searchRadiusKm <= 10 ? 12 : searchRadiusKm <= 25 ? 18 : 35;

  const handleRadiusChange = (r: number) => {
    setSearchRadiusKm(r);
    showToast(`Hiring radius updated to ${r} km`, 'info');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      {/* Header with Title and Radius Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-inner">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              Nearby Talent &amp; Hiring Ecosystem
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Live Geolocation
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive OpenStreetMap mapping TechNova Labs HQ with 14 partner colleges &amp; verified candidate clusters.
            </p>
          </div>
        </div>

        {/* Radius Pill Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 pl-2 pr-1">Radius:</span>
          {[5, 10, 25, 50, 100].map((r) => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                searchRadiusKm === r
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {r}km
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Map Component */}
      <DynamicMap
        companyCoords={company.coordinates}
        companyName={company.name}
        colleges={colleges}
        radiusKm={searchRadiusKm}
      />

      {/* Dynamic Radius Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900 font-mono">{verifiedCandidatesNearby.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500">Verified candidates within {searchRadiusKm} km</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900 font-mono">{nearbyCollegesCount} Institutions</p>
            <p className="text-[11px] text-slate-500">Engineering &amp; AYUSH colleges nearby</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-900 font-mono">{partnerCompaniesNearby} Partner Startups</p>
            <p className="text-[11px] text-slate-500">Collaborating in Bengaluru cluster</p>
          </div>
        </div>
      </div>
    </div>
  );
};
