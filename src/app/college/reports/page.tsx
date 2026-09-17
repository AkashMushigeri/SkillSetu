'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { FileSpreadsheet, Download, FileText, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { ReportPreviewModal } from '@/components/college/ReportPreviewModal';

export default function ReportsPage() {
  const { profile } = useCollege();
  const [selectedReport, setSelectedReport] = useState<string>('Student Skill Report');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reportTypes = [
    { title: 'Student Skill Report', desc: 'Verified technical skills, score breakdown, and department distribution across student body.', icon: FileSpreadsheet },
    { title: 'Department Report', desc: 'Department-wise readiness, verification percentages, and internship rates.', icon: FileText },
    { title: 'Placement Report', desc: 'Hiring company offers, salary CTC averages, highest package, and job domain splits.', icon: FileSpreadsheet },
    { title: 'Internship Report', desc: 'Startup and corporate internship participation, stipend averages, and conversion stats.', icon: FileText },
    { title: 'Industry Collaboration Report', desc: 'Active MoUs, partner companies, collaborative R&D projects, and hackathons.', icon: FileSpreadsheet },
    { title: 'Skill Gap Report', desc: 'Deficit analysis comparing student skill counts against corporate hiring demand.', icon: FileText },
  ];

  const handleOpenReport = (title: string) => {
    setSelectedReport(title);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Report Generation</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Generate and export official institutional audit reports for NAAC, NIRF, and university accreditation.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.title}
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-brand-teal border border-teal-200 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rep.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  AY {profile.academicYear}
                </span>
                <button
                  onClick={() => handleOpenReport(rep.title)}
                  className="px-4 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ReportPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={selectedReport}
      />
    </div>
  );
}
