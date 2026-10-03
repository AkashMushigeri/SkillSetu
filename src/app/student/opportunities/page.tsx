'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { isResumeSkill, resumeOpportunityFit } from '@/lib/resumeSkillMapping';
import { Opportunity, OpportunityType } from '@/types/student';
import { OpportunityMap } from '@/components/map/OpportunityMap';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplyModal } from '@/components/opportunities/ApplyModal';
import {
  MapPin,
  Search,
  Crosshair,
  SlidersHorizontal,
  Sparkles,
  X,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  SearchX,
} from 'lucide-react';

const DEFAULT_RADIUS = 25;
const RADIUS_OPTIONS = [2, 5, 10, 25, 50];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'] as const;
const CATEGORIES: (OpportunityType | 'All')[] = [
  'All',
  'Internship',
  'Micro-Internship',
  'Same-Day Task',
  'Part-Time Job',
  'Full-Time Job',
  'Industry Challenge',
];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-1';
const controlBase = `h-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 ${focusRing}`;

type Fit = { matchedSkills: string[]; coverage: number };

/* ---------- Compact opportunity card ---------- */
function CompactCard({
  opp,
  fit,
  onViewDetails,
  onApply,
}: {
  opp: Opportunity;
  fit?: Fit;
  onViewDetails: (o: Opportunity) => void;
  onApply: (o: Opportunity) => void;
}) {
  const matched = new Set((fit?.matchedSkills ?? []).map((s) => s.toLowerCase()));
  // Show matched skills first so the match is visible without expanding anything.
  const skills = [...opp.requiredSkills].sort(
    (a, b) => Number(matched.has(b.toLowerCase())) - Number(matched.has(a.toLowerCase()))
  );
  const visible = skills.slice(0, 4);
  const extra = skills.length - visible.length;
  const distance =
    opp.workMode === 'Remote'
      ? null
      : opp.distanceKm !== undefined
        ? `${opp.distanceKm.toFixed(1)} km`
        : null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-700">{opp.company}</span>
            <span aria-hidden="true"> · </span>
            <span className="text-brand-teal font-semibold">{opp.type}</span>
          </p>
          <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-slate-900">
            <button
              type="button"
              onClick={() => onViewDetails(opp)}
              className={`text-left hover:underline rounded ${focusRing}`}
            >
              {opp.title}
            </button>
          </h3>
        </div>
        {fit && (
          <span
            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-2 py-0.5 text-[11px] font-bold text-brand-teal"
            title="Share of this listing's skills found in your analyzed resume"
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            {fit.coverage}% skill match
          </span>
        )}
      </div>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-600">
        <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>{opp.location}</span>
        <span aria-hidden="true">·</span>
        <span>{opp.workMode}</span>
        {distance && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800">{distance} away</span>
          </>
        )}
      </p>

      {visible.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Required skills">
          {visible.map((s) => {
            const isMatch = matched.has(s.toLowerCase());
            return (
              <li
                key={s}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  isMatch
                    ? 'bg-brand-teal/10 text-brand-teal ring-1 ring-brand-teal/30'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isMatch && <span className="sr-only">Matches your resume: </span>}
                {s}
              </li>
            );
          })}
          {extra > 0 && (
            <li className="rounded-md px-2 py-0.5 text-[11px] font-medium text-slate-500">
              +{extra} more
            </li>
          )}
        </ul>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(opp)}
          className={`h-9 rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 ${focusRing}`}
          aria-label={`View details for ${opp.title}`}
        >
          View details
        </button>
        <button
          type="button"
          onClick={() => onApply(opp)}
          className={`h-9 rounded-lg bg-brand-teal px-4 text-xs font-bold text-white hover:bg-brand-dark ${focusRing}`}
          aria-label={`Apply to ${opp.title}`}
        >
          Apply
        </button>
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
export default function OpportunitiesExplorePage() {
  const {
    opportunities,
    skills,
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
  const [matchResume, setMatchResume] = useState(false);
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<Opportunity | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const resumeSkills = useMemo(() => skills.filter(isResumeSkill), [skills]);

  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => o.requiredSkills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [opportunities]);

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    await requestUserLocation();
    setIsLocating(false);
  };

  // Close the filter popover on outside click / Escape
  useEffect(() => {
    if (!filtersOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFiltersOpen(false);
        filterBtnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  // Filter logic (unchanged from the original page)
  const filteredOpportunities = useMemo(() => {
    const filtered = opportunities.filter((opp) => {
      const matchesRadius =
        opp.workMode === 'Remote' || opp.distanceKm === undefined || opp.distanceKm <= searchRadius;
      if (!matchesRadius) return false;

      if (selectedOpportunityType !== 'All' && opp.type !== selectedOpportunityType) return false;
      if (workModeFilter !== 'All' && opp.workMode !== workModeFilter) return false;

      if (
        selectedSkillFilter !== 'All' &&
        !opp.requiredSkills.some((s) => s.toLowerCase() === selectedSkillFilter.toLowerCase())
      ) {
        return false;
      }

      if (matchResume && resumeOpportunityFit(opp.requiredSkills, resumeSkills).matchedSkills.length === 0) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inTitle = opp.title.toLowerCase().includes(query);
        const inCompany = opp.company.toLowerCase().includes(query);
        const inSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(query));
        const inLocation = opp.location.toLowerCase().includes(query);
        if (!inTitle && !inCompany && !inSkills && !inLocation) return false;
      }
      return true;
    });
    return matchResume
      ? filtered.sort(
          (a, b) =>
            resumeOpportunityFit(b.requiredSkills, resumeSkills).coverage -
            resumeOpportunityFit(a.requiredSkills, resumeSkills).coverage
        )
      : filtered;
  }, [
    opportunities,
    searchRadius,
    selectedOpportunityType,
    workModeFilter,
    selectedSkillFilter,
    searchQuery,
    matchResume,
    resumeSkills,
  ]);

  // Compute resume fit once per listing (only when matching is on)
  const fitById = useMemo(() => {
    const map = new Map<string, Fit>();
    if (!matchResume) return map;
    filteredOpportunities.forEach((o) => {
      map.set(String(o.id), resumeOpportunityFit(o.requiredSkills, resumeSkills));
    });
    return map;
  }, [matchResume, filteredOpportunities, resumeSkills]);

  const pinCount = filteredOpportunities.filter((opp) => opp.coordinates).length;
  const unmappedCount = filteredOpportunities.length - pinCount;

  const handleClearFilters = () => {
    setSelectedOpportunityType('All');
    setWorkModeFilter('All');
    setSelectedSkillFilter('All');
    setSearchQuery('');
    setSearchRadius(DEFAULT_RADIUS);
    setMatchResume(false);
  };

  // Active filter chips
  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (searchQuery.trim() !== '')
    chips.push({ key: 'q', label: `“${searchQuery.trim()}”`, onRemove: () => setSearchQuery('') });
  if (selectedOpportunityType !== 'All')
    chips.push({
      key: 'type',
      label: selectedOpportunityType,
      onRemove: () => setSelectedOpportunityType('All'),
    });
  if (workModeFilter !== 'All')
    chips.push({ key: 'mode', label: workModeFilter, onRemove: () => setWorkModeFilter('All') });
  if (selectedSkillFilter !== 'All')
    chips.push({ key: 'skill', label: selectedSkillFilter, onRemove: () => setSelectedSkillFilter('All') });
  if (searchRadius !== DEFAULT_RADIUS)
    chips.push({ key: 'radius', label: `${searchRadius} km`, onRemove: () => setSearchRadius(DEFAULT_RADIUS) });
  if (matchResume)
    chips.push({ key: 'resume', label: 'Resume match', onRemove: () => setMatchResume(false) });

  // Filters-popover badge counts only the controls inside the popover
  const popoverActiveCount =
    (workModeFilter !== 'All' ? 1 : 0) + (selectedSkillFilter !== 'All' ? 1 : 0) + (matchResume ? 1 : 0);

  const resumeUnavailable = resumeSkills.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900">
            Opportunities Near You
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Discover internships, jobs, projects and tasks matched to your skills.
          </p>
        </div>

        {/* Unified location control */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <label htmlFor="city-select" className="sr-only">
              City
            </label>
            <MapPin
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <select
              id="city-select"
              value={selectedCity.name}
              onChange={(e) => setSelectedCityByName(e.target.value)}
              disabled={isUsingGeolocation}
              className={`${controlBase} pl-9 pr-8 font-semibold disabled:bg-slate-50 disabled:text-slate-500`}
            >
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            aria-pressed={isUsingGeolocation}
            className={`h-10 inline-flex items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition-colors disabled:opacity-70 ${focusRing} ${
              isUsingGeolocation
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Crosshair className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isLocating ? 'Locating…' : isUsingGeolocation ? 'GPS active' : 'Use my location'}
          </button>
        </div>
      </header>

      {/* Location status (compact, announced to screen readers) */}
      <p className="text-xs text-slate-500 flex items-center gap-2" role="status" aria-live="polite">
        <span
          className={`h-1.5 w-1.5 rounded-full ${isUsingGeolocation ? 'bg-emerald-500' : 'bg-slate-400'}`}
          aria-hidden="true"
        />
        <span>{locationStatusMessage}</span>
      </p>

      {/* Search + primary filters toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <label htmlFor="opp-search" className="sr-only">
              Search opportunities
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="opp-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities, companies, skills…"
              className={`${controlBase} w-full pl-9 pr-3 bg-slate-50`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div>
              <label htmlFor="cat-select" className="sr-only">
                Opportunity type
              </label>
              <select
                id="cat-select"
                value={selectedOpportunityType}
                onChange={(e) => setSelectedOpportunityType(e.target.value as OpportunityType | 'All')}
                className={`${controlBase} px-3 font-medium`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All types' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="radius-select" className="sr-only">
                Search radius
              </label>
              <select
                id="radius-select"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className={`${controlBase} px-3 font-medium`}
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    Within {r} km
                  </option>
                ))}
              </select>
            </div>

            {/* Filters popover */}
            <div className="relative" ref={filterWrapRef}>
              <button
                ref={filterBtnRef}
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls="more-filters"
                className={`h-10 inline-flex items-center gap-1.5 rounded-lg border px-3.5 text-sm font-semibold ${focusRing} ${
                  popoverActiveCount > 0
                    ? 'border-brand-teal text-brand-teal bg-brand-teal/5'
                    : 'border-slate-200 text-slate-800 bg-white hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {popoverActiveCount > 0 && (
                  <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-teal px-1 text-[11px] font-bold text-white">
                    {popoverActiveCount}
                    <span className="sr-only"> active</span>
                  </span>
                )}
              </button>

              {filtersOpen && (
                <div
                  id="more-filters"
                  role="dialog"
                  aria-label="More filters"
                  className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 shadow-lg space-y-4"
                >
                  <fieldset>
                    <legend className="text-xs font-bold text-slate-700 mb-1.5">Work mode</legend>
                    <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
                      {WORK_MODES.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWorkModeFilter(m)}
                          aria-pressed={workModeFilter === m}
                          className={`h-8 rounded-md text-xs font-semibold ${focusRing} ${
                            workModeFilter === m
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="skill-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Required skill
                    </label>
                    <select
                      id="skill-select"
                      value={selectedSkillFilter}
                      onChange={(e) => setSelectedSkillFilter(e.target.value)}
                      className={`${controlBase} w-full px-3`}
                    >
                      <option value="All">All skills</option>
                      {availableSkills.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p id="resume-label" className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <Sparkles className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                          Match my resume
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {matchResume
                            ? 'Showing opportunities that match your analyzed skills.'
                            : 'Show only opportunities that match your analyzed skills.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={matchResume}
                        aria-labelledby="resume-label"
                        disabled={resumeUnavailable}
                        onClick={() => setMatchResume((v) => !v)}
                        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${focusRing} ${
                          matchResume ? 'bg-brand-teal' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            matchResume ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {resumeUnavailable && (
                      <Link
                        href="/student/resume"
                        className="mt-2 inline-block text-xs font-semibold text-brand-teal underline"
                      >
                        Analyze and approve resume skills first
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className={`text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline rounded ${focusRing}`}
                    >
                      Clear all
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className={`h-9 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 ${focusRing}`}
                    >
                      Show {filteredOpportunities.length} results
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            {chips.map((c) => (
              <span
                key={c.key}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1 text-xs font-semibold text-slate-700"
              >
                {c.label}
                <button
                  type="button"
                  onClick={c.onRemove}
                  aria-label={`Remove filter ${c.label}`}
                  className={`flex h-5 w-5 items-center justify-center rounded-full hover:bg-slate-200 ${focusRing}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClearFilters}
              className={`ml-1 rounded text-xs font-semibold text-brand-teal hover:underline ${focusRing}`}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Map + results */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-5">
        {/* Map */}
        <section
          aria-label="Opportunity map"
          className="order-1 overflow-hidden rounded-xl border border-slate-200 bg-white lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-100">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <MapIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Map
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {pinCount} {pinCount === 1 ? 'pin' : 'pins'}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setMapExpanded((v) => !v)}
              aria-expanded={mapExpanded}
              className={`lg:hidden inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 ${focusRing}`}
            >
              {mapExpanded ? 'Collapse' : 'Expand'}
              {mapExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
            <span className="hidden lg:inline text-[11px] text-slate-400">OpenStreetMap · Leaflet</span>
          </div>

          {/* key remounts Leaflet when the container height changes so tiles size correctly */}
          <div
            key={mapExpanded ? 'expanded' : 'collapsed'}
            className={`w-full ${mapExpanded ? 'h-[360px]' : 'h-[180px]'} sm:h-[320px] lg:h-[min(620px,calc(100vh-11rem))]`}
          >
            <OpportunityMap
              userCoords={userCoords}
              isUsingGeolocation={isUsingGeolocation}
              opportunities={filteredOpportunities}
              onSelectOpportunity={(opp) => setActiveModalOpp(opp)}
              radiusKm={searchRadius}
            />
          </div>
          {unmappedCount > 0 && (
            <p className="px-3 py-2 text-[11px] text-slate-500 border-t border-slate-100">
              {unmappedCount} {unmappedCount === 1 ? 'listing has' : 'listings have'} no map location (radius not
              applied).
            </p>
          )}
        </section>

        {/* Results */}
        <section aria-label="Results" className="order-2 min-w-0 space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <div>
              <h2 className="text-lg font-bold text-slate-900" aria-live="polite">
                {filteredOpportunities.length}{' '}
                {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
              </h2>
              <p className="text-xs text-slate-500">
                {matchResume
                  ? 'Matched to your resume, best skill coverage first'
                  : 'Nearby opportunities matching your search'}
              </p>
            </div>
            <p className="text-xs text-slate-500 shrink-0">
              {selectedCity.name} · {searchRadius} km
            </p>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <SearchX className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                No opportunities match your current filters
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Try expanding your radius or removing a filter.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className={`mt-4 h-10 rounded-lg bg-brand-teal px-5 text-sm font-bold text-white hover:bg-brand-dark ${focusRing}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredOpportunities.map((opp) => (
                <li key={opp.id}>
                  <CompactCard
                    opp={opp}
                    fit={fitById.get(String(opp.id))}
                    onViewDetails={(o) => setActiveModalOpp(o)}
                    onApply={(o) => setApplyModalOpp(o)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Modals */}
      {activeModalOpp && (
        <OpportunityDetailModal
          opportunity={activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          onApply={(opp) => setApplyModalOpp(opp)}
        />
      )}

      {applyModalOpp && <ApplyModal opportunity={applyModalOpp} onClose={() => setApplyModalOpp(null)} />}
    </div>
  );
}
