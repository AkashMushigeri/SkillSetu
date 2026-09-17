'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { BarChart3, TrendingUp, DollarSign, Trophy, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { HISTORICAL_ANALYTICS_DATA } from '@/data/collegeData';
import { ReportPreviewModal } from '@/components/college/ReportPreviewModal';

export default function AnalyticsPage() {
  const { profile } = useCollege();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026–27');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">College Analytics</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Historical placement trends, CTC growth, skill verification benchmarks, and hiring domain distributions.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">2026 Placement Rate</span>
          <p className="text-3xl font-black text-slate-900">86%</p>
          <span className="text-[10px] text-emerald-700 font-semibold">+5% growth compared to 2025</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Average Package (CTC)</span>
          <p className="text-3xl font-black text-slate-900">₹7.1 LPA</p>
          <span className="text-[10px] text-amber-700 font-semibold">+10.9% increase YoY</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Highest Package</span>
          <p className="text-3xl font-black text-slate-900">₹24.0 LPA</p>
          <span className="text-[10px] text-purple-700 font-semibold">Offered by Product Partner</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Skill Verified Pool</span>
          <p className="text-3xl font-black text-slate-900">1,742</p>
          <span className="text-[10px] text-blue-700 font-semibold">70% of total institution</span>
        </div>
      </div>

      {/* Visual Chart Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Placement Rate 2023 - 2026 Trend Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-emerald" />
                Placement Rate Trend (2023 – 2026)
              </h3>
              <p className="text-xs text-slate-500">Year-over-year campus placement percentage</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              2026 Goal: 86%
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
            {HISTORICAL_ANALYTICS_DATA.placementRateTrend.map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-mono font-bold text-slate-900">{item.rate}%</span>
                <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden p-0.5 border border-slate-200 h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-brand-emerald to-emerald-400 rounded-t-lg transition-all duration-700"
                    style={{ height: `${item.rate}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{item.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average CTC Trend Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                Average Package CTC Trend (₹ LPA)
              </h3>
              <p className="text-xs text-slate-500">2023 to 2026 salary growth</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
              Avg: ₹7.1 LPA
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
            {HISTORICAL_ANALYTICS_DATA.averagePackageTrend.map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-mono font-bold text-amber-700">₹{item.avg} LPA</span>
                <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden p-0.5 border border-slate-200 h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all duration-700"
                    style={{ height: `${(item.avg / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{item.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Hiring Domains Distribution */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3">
          Top Hiring Domains (AY 2026–27)
        </h3>

        <div className="space-y-3">
          {HISTORICAL_ANALYTICS_DATA.topHiringDomains.map((dom) => (
            <div key={dom.domain} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900">{dom.domain}</span>
                <span className="font-mono text-emerald-700 font-bold">{dom.percentage}% of Offers</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-brand-emerald to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${dom.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReportPreviewModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}
