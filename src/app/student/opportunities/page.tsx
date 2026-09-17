'use client';

import React, { useState, useMemo } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Opportunity, OpportunityType } from '@/types/student';
import { OpportunityMap } from '@/components/map/OpportunityMap';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplyModal } from '@/components/opportunities/ApplyModal';
import {
  Compass,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Crosshair,
  Filter,
  CheckCircle2,
  Building2,
  Briefcase
} from 'lucide-react';

export default function OpportunitiesExplorePage() {
  const {
    opportunities,
    userCoords,
    isUsingGeolocation,
    requestUserLocation,
    locationStatusMessage,
    selectedCity,
    setSelectedCityByName,
    cities,
    searchRadius,
    setSearchRadius,
    selectedOpportunityType,
    setSelectedOpportunityType,
    searchQuery,
    setSearchQuery,
    workModeFilter,
    setWorkModeFilter,
  } = useStudent();

  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<Opportunity | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Available skills in opportunities for filter dropdown
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => o.requiredSkills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [opportunities]);

  // Radius options
  const radiusOptions = [2, 5, 10, 25, 50];

  // Opportunity categories
  const categories: (OpportunityType | 'All')[] = [
    'All',
    'Internship',
    'Micro-Internship',
    'Same-Day Task',
    'Part-Time Job',
    'Full-Time Job',
    'Industry Challenge',
  ];

  // Geolocation button handler
  const handleUseMyLocation = async () => {
    setIsLocating(true);
    await requestUserLocation();
    setIsLocating(false);
  };

  // Filter logic: Radius + Type + Search + Work Mode + Skill
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // 1. Radius filter: opp distance must be <= searchRadius (or remote if work mode is remote)
      const matchesRadius =
        opp.workMode === 'Remote' || (opp.distanceKm !== undefined && opp.distanceKm <= searchRadius);
      if (!matchesRadius) return false;

      // 2. Category filter
      if (selectedOpportunityType !== 'All' && opp.type !== selectedOpportunityType) {
        return false;
      }

      // 3. Work mode filter
      if (workModeFilter !== 'All' && opp.workMode !== workModeFilter) {
        return false;
      }

      // 4. Skill filter
      if (
        selectedSkillFilter !== 'All' &&
        !opp.requiredSkills.some((s) => s.toLowerCase() === selectedSkillFilter.toLowerCase())
      ) {
        return false;
      }

      // 5. Keyword search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inTitle = opp.title.toLowerCase().includes(query);
        const inCompany = opp.company.toLowerCase().includes(query);
        const inSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(query));
        const inLocation = opp.location.toLowerCase().includes(query);
        if (!inTitle && !inCompany && !inSkills && !inLocation) {
          return false;
        }
      }

      return true;
    });
  }, [
    opportunities,
    searchRadius,
    selectedOpportunityType,
    workModeFilter,
    selectedSkillFilter,
    searchQuery,
  ]);

  // Clear filters
  const handleClearFilters = () => {
    setSelectedOpportunityType('All');
    setWorkModeFilter('All');
    setSelectedSkillFilter('All');
    setSearchQuery('');
    setSearchRadius(25);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            Location-Aware Career Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Opportunities Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Discover internships, micro-sprints, and tasks from nearby companies matching your skills.
          </p>
        </div>

        {/* Location Controls & Geolocation */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-card flex flex-wrap items-center gap-2">
          {/* Use My Location Button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isUsingGeolocation
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-brand-teal hover:bg-brand-dark text-white'
            }`}
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isUsingGeolocation ? 'Using GPS Location' : 'Use My Location'}</span>
          </button>

          {/* City Selector Dropdown */}
          <div className="flex items-center gap-1.5 pl-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity.name}
              onChange={(e) => setSelectedCityByName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location Status Message banner */}
      <div className="text-xs text-slate-600 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{locationStatusMessage}</span>
        </div>
        <span className="text-[11px] font-bold text-brand-teal">
          {filteredOpportunities.length} opportunities within {searchRadius} km
        </span>
      </div>

      {/* Radius Controls & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or required skill (e.g. Python, SQL)..."
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
            />
          </div>

          {/* Radius Selector Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Radius:
            </span>
            <div className="flex items-center gap-1">
              {radiusOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSearchRadius(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    searchRadius === r
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunity Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedOpportunityType(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedOpportunityType === cat
                  ? 'bg-brand-teal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Work Mode, Skill & Clear Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Work Mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Work Mode:</span>
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Required Skill */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Skill:</span>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="All">All Skills</option>
                {availableSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Map & Right Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-6 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Interactive Opportunity Map</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {filteredOpportunities.length} Pins
              </span>
            </div>
            <span className="text-[11px] text-slate-400">OpenStreetMap &bull; Leaflet</span>
          </div>

          {/* Leaflet Map */}
          <div className="h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden">
            <OpportunityMap
              userCoords={userCoords}
              isUsingGeolocation={isUsingGeolocation}
              opportunities={filteredOpportunities}
              onSelectOpportunity={(opp) => setActiveModalOpp(opp)}
              radiusKm={searchRadius}
            />
          </div>
        </div>

        {/* Right Column: Opportunities List Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-sm">
              Nearby Opportunities List ({filteredOpportunities.length})
            </h3>
            <span className="text-xs text-slate-500">Sorted by proximity &amp; skill match</span>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">No opportunities found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No opportunities match your current filters within {searchRadius} km. Try expanding your radius or clearing selected filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-brand-teal text-white text-xs font-bold shadow-xs hover:bg-brand-dark transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onViewDetails={(selected) => setActiveModalOpp(selected)}
                  onApply={(selected) => setApplyModalOpp(selected)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModalOpp && (
        <OpportunityDetailModal
          opportunity={activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          onApply={(opp) => setApplyModalOpp(opp)}
        />
      )}

      {applyModalOpp && (
        <ApplyModal
          opportunity={applyModalOpp}
          onClose={() => setApplyModalOpp(null)}
        />
      )}
    </div>
  );
}
