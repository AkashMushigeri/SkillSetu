'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { FileSpreadsheet, Download, Printer, CheckCircle2, X, FileText } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const ReportPreviewModal: React.FC<ReportModalProps> = ({ isOpen, onClose, defaultType }) => {
  const { profile, showToast } = useCollege();
  const [reportType, setReportType] = useState(defaultType || 'Skill Gap Report');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      showToast(`${reportType} generated successfully as ${format.toUpperCase()}.`, 'success');
    }, 700);
  };

  const handleDownload = () => {
    // Create mock download file
    const content = `SKILLSETU INSTITUTIONAL REPORT\nInstitution: ${profile.institutionName}\nAcademic Year: ${profile.academicYear}\nReport Type: ${reportType}\nGenerated On: ${new Date().toLocaleDateString()}\nStatus: Verified\n\nMetrics Summary:\n- Total Students: ${profile.totalStudents}\n- Skill Verified Pct: 70%\n- Placement Rate: 86%\n- Active Industry Partners: ${profile.industryPartnersCount}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/\s+/g, '_')}_${profile.academicYear.replace('–', '_')}.${format}`;
    a.click();
    showToast('Downloaded report to your system', 'info');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Generate Institutional Report</h2>
              <p className="text-xs text-slate-400">{profile.institutionName} &bull; AY {profile.academicYear}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Report Category</label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setGenerated(false);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Student Skill Report">Student Skill Report</option>
                <option value="Department Report">Department Performance Report</option>
                <option value="Placement Report">Placement &amp; Salary Audit Report</option>
                <option value="Internship Report">Internship Participation Report</option>
                <option value="Industry Collaboration Report">Industry Collaboration &amp; MoU Report</option>
                <option value="Skill Gap Report">Skill Gap &amp; Training Need Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pdf', label: 'PDF Document' },
                  { id: 'csv', label: 'CSV Table' },
                  { id: 'excel', label: 'Excel Workbook' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      format === f.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Preview Document Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">{reportType}</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Official Document Preview
              </span>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <p>INSTITUTION: {profile.institutionName.toUpperCase()}</p>
              <p>LOCATION: {profile.location} | NAAC: {profile.naacGrade}</p>
              <p>ACADEMIC YEAR: {profile.academicYear} | DATE: {new Date().toLocaleDateString()}</p>
              <p className="text-emerald-400 pt-1">
                ------------------------------------------------------------
              </p>
              <p>KEY EXECUTIVE SUMMARY FINDINGS:</p>
              {reportType === 'Skill Gap Report' && (
                <>
                  <p>1. Cloud Computing (AWS/Azure) exhibits highest deficit (-818 students vs demand).</p>
                  <p>2. SQL &amp; Full Stack JavaScript show moderate gaps requiring targeted bootcamps.</p>
                  <p>3. 70% of overall student body possesses verified baseline certifications.</p>
                </>
              )}
              {reportType === 'Placement Report' && (
                <>
                  <p>1. 2026 Placement Rate reached 86% (+5% increase YoY).</p>
                  <p>2. Average CTC increased to ₹7.1 LPA (Highest Offer: ₹24 LPA).</p>
                  <p>3. Software Development and AI/ML accounted for 64% of total job offers.</p>
                </>
              )}
              {reportType !== 'Skill Gap Report' && reportType !== 'Placement Report' && (
                <>
                  <p>1. Verified skill scores across 6 academic departments average 74.2%.</p>
                  <p>2. Active industry partnerships stand at 74 validated corporate partners.</p>
                  <p>3. Internship conversion rate stands at 76% for 3rd year engineering students.</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Verified digitally by Placement &amp; Training Cell
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
            {!generated ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                {isGenerating ? (
                  <span>Generating Report...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Download Report ({format.toUpperCase()})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
