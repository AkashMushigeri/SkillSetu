'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Check,
  Rocket,
} from 'lucide-react';

export default function IndustryProfilePage() {
  const { company, updateCompanyProfile, jobs, internships } = useIndustry();

  const [isEditing, setIsEditing] = useState(false);
  const [tagline, setTagline] = useState(company.tagline);
  const [about, setAbout] = useState(company.about);
  const [mission, setMission] = useState(company.mission);
  const [website, setWebsite] = useState(company.website);

  const handleSave = () => {
    updateCompanyProfile({
      tagline,
      about,
      mission,
      website,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cover & Brand Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Banner Image */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-gradient-to-r from-slate-950 via-brand-dark to-slate-900">
          <img
            src={company.coverImage}
            alt="Company Cover"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Company Header Info Box */}
        <div className="p-6 sm:p-8 pt-0 relative z-10 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 border-4 border-slate-900 shadow-2xl flex items-center justify-center text-4xl shadow-emerald-950/50">
              🚀
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{company.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {company.type}
                </span>
              </div>

              <p className="text-xs text-emerald-400 font-medium">{company.industry}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {company.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {company.employees} Employees
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Founded {company.founded}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-4 h-4 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            )}

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Company */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Building2 className="w-5 h-5 text-emerald-400" />
              About {company.name}
            </h2>

            {isEditing ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Company Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Overview</label>
                  <textarea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-sm text-emerald-400">"{company.tagline}"</p>
                <p>{company.about}</p>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Our Mission
                  </span>
                  <p className="text-slate-300">{company.mission}</p>
                </div>
              </div>
            )}
          </div>

          {/* Technology Stack */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Core Engineering Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {company.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Perks & Benefits for Students */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Rocket className="w-5 h-5 text-amber-400" />
              Student &amp; Intern Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {company.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recruiter Lead Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Talent Acquisition Lead
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={company.recruiter.avatar}
                alt={company.recruiter.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
              <div>
                <p className="font-bold text-white text-sm">{company.recruiter.name}</p>
                <p className="text-xs text-emerald-400">{company.recruiter.title}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{company.recruiter.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Organization Footprint
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Active Full-Time Roles:</span>
                <span className="font-mono font-bold text-white">{jobs.length} Jobs</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Active Internships:</span>
                <span className="font-mono font-bold text-emerald-400">{internships.length} Internships</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Partner Colleges:</span>
                <span className="font-mono font-bold text-purple-300">14 Institutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
