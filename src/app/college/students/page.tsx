'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCollege } from '@/context/CollegeContext';
import {
  Users,
  Search,
  Filter,
  Upload,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';
import { ImportStudentsModal } from '@/components/college/ImportStudentsModal';

export default function StudentManagementPage() {
  const { students, profile } = useCollege();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState('All');
  const [selectedPlacement, setSelectedPlacement] = useState('All');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter students logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    const matchesYear = selectedYear === 'All' || s.year === selectedYear;
    const matchesVer = selectedVerification === 'All' || s.verificationStatus === selectedVerification;
    const matchesInt = selectedInternship === 'All' || s.internshipStatus === selectedInternship;
    const matchesPlace = selectedPlacement === 'All' || s.placementStatus === selectedPlacement;

    return matchesSearch && matchesDept && matchesYear && matchesVer && matchesInt && matchesPlace;
  });

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Student Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor student profiles, verified skills, assessments, and career readiness across {profile.institutionName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import Students (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name, USN, or technical skills (e.g., Aarav, 1AY23CS001, Python)..."
            className="w-full bg-transparent text-slate-900 text-xs placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-teal"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-teal"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Verification</label>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-teal"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Internship</label>
            <select
              value={selectedInternship}
              onChange={(e) => setSelectedInternship(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-teal"
            >
              <option value="All">All Internships</option>
              <option value="Interning">Interning</option>
              <option value="Seeking">Seeking</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Placement</label>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-teal"
            >
              <option value="All">All Placements</option>
              <option value="Placed">Placed</option>
              <option value="Eligible">Eligible</option>
              <option value="In Interview">In Interview</option>
              <option value="Opted Out">Opted Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-900">{students.length}</strong> students
          </p>
          {(searchQuery || selectedDept !== 'All' || selectedYear !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedYear('All');
                setSelectedVerification('All');
                setSelectedInternship('All');
                setSelectedPlacement('All');
              }}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No matching student profiles found.</p>
            <p className="text-xs text-slate-500">Try refining your search terms or clearing current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedYear('All');
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">USN</th>
                  <th className="py-3 px-3">Dept &amp; Year</th>
                  <th className="py-3 px-3">Skills</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Internship</th>
                  <th className="py-3 px-3">Readiness</th>
                  <th className="py-3 px-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{std.name}</p>
                          <p className="text-[10px] text-slate-500">{std.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{std.usn}</td>
                    <td className="py-3 px-3 text-slate-700">
                      <div>{std.department}</div>
                      <span className="text-[10px] text-slate-400">{std.year}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {std.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px]"
                          >
                            {sk}
                          </span>
                        ))}
                        {std.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{std.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          std.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {std.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          std.internshipStatus === 'Interning'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : std.internshipStatus === 'Completed'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {std.internshipStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${std.readinessScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 font-mono">{std.readinessScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/college/students/${std.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-brand-dark hover:text-emerald-700 font-bold inline-flex items-center gap-1 text-xs"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      <ImportStudentsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
}
