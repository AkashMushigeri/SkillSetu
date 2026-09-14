'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Upload, Download, FileSpreadsheet, CheckCircle2, X } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportStudentsModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importStudents } = useCollege();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    } else {
      setSelectedFile('AYUSH_College_Student_Master_List_2026.csv');
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'USN,Name,Email,Department,Year,GPA,Skills\n' +
      '1AY23CS101,Rohan K,rohan.k@ayushcollege.edu,CSE,3rd Year,8.5,"Python, SQL, React"\n' +
      '1AY23AI102,Pooja S,pooja.s@ayushcollege.edu,AIML,3rd Year,9.0,"Python, Machine Learning"\n';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skillsetu_student_import_template.csv';
    a.click();
  };

  const handleConfirmImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      importStudents(248);
      setIsImporting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Bulk Student Import</h2>
              <p className="text-xs text-slate-500">Upload CSV to sync student profiles &amp; academic records.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Download Template Box */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Download CSV Template</p>
                <p className="text-[11px] text-slate-500">Includes USN, Dept, Year, GPA &amp; Skill columns</p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Template</span>
            </button>
          </div>

          {/* Upload Area */}
          {!selectedFile ? (
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-900">Click or drag CSV file to upload</p>
              <p className="text-[11px] text-slate-500 mt-1">Supports CSV, XLSX up to 10MB</p>
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
            </label>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  File Selected: {selectedFile}
                </span>
                <button onClick={() => setSelectedFile(null)} className="text-xs text-slate-500 hover:text-slate-800">
                  Change
                </button>
              </div>

              {/* Mock Preview Info */}
              <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-1">
                <p className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Import Preview:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">248 students</span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  &bull; 120 CSE &bull; 64 AIML &bull; 40 ECE &bull; 24 EEE
                </p>
                <p className="text-slate-500 text-[11px]">
                  &bull; All USNs verified &bull; Skills mapped automatically
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!selectedFile || isImporting}
            className="px-5 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
          >
            {isImporting ? (
              <span>Importing 248 Students...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import Students</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
