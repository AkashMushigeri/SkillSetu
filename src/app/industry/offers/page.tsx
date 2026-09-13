'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import {
  FileCheck,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  Sparkles,
  Send,
  Eye,
  Check,
  X,
  Printer,
  Calendar,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { IndustryOffer } from '@/types/industry';

export default function IndustryOffersPage() {
  const { offers, candidates, createOffer, updateOfferStatus, showToast } = useIndustry();

  const [activeTab, setActiveTab] = useState<'all' | 'Sent' | 'Accepted' | 'Draft'>('all');
  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<IndustryOffer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // New offer form state
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || '');
  const [roleTitle, setRoleTitle] = useState('Machine Learning Engineer');
  const [type, setType] = useState<IndustryOffer['type']>('Full-Time Employment');
  const [department, setDepartment] = useState('AI & Data Platforms');
  const [location, setLocation] = useState('Bengaluru, India');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [compensation, setCompensation] = useState('₹14,50,000 / annum');
  const [baseFixed, setBaseFixed] = useState('₹12,00,000');
  const [variableBonus, setVariableBonus] = useState('₹1,50,000');
  const [retentionJoiningBonus, setRetentionJoiningBonus] = useState('₹1,00,000');
  const [joiningDate, setJoiningDate] = useState('01 July 2026');

  const filteredOffers = offers.filter((off) => {
    if (activeTab === 'all') return true;
    return off.status === activeTab;
  });

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const newOffer = createOffer({
      candidateId: cand.id,
      candidateName: cand.name,
      candidateAvatar: cand.avatar,
      candidateEmail: cand.email,
      candidateCollege: cand.college,
      jobOrInternshipId: 'job-01',
      roleTitle,
      type,
      department,
      location,
      workMode,
      compensation,
      breakdown: {
        baseFixed,
        variableBonus,
        retentionJoiningBonus,
        benefitsSummary: 'Comprehensive Health Cover (₹5L), ESOP Grant, Home Office Setup Reimbursement',
      },
      joiningDate,
      validUntil: '15 Nov 2026',
      status: 'Sent',
      authorizedSignatory: 'Rahul Verma',
      signatoryTitle: 'Head of Talent & Engineering Partnerships, TechNova Labs',
    });

    setIsGenerating(false);
    setSelectedOfferForPreview(newOffer);
  };

  const handlePrintOffer = () => {
    showToast('Preparing printable offer letter...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Offer Letters &amp; Employment Agreements
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              {offers.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Issue formal offer letters with compensation structures, skill-verification endorsements, and digital dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsGenerating(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-teal to-brand-emerald hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Offer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Offers Issued</span>
          <span className="text-xl font-extrabold text-white font-mono mt-1 block">{offers.length} Candidates</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Accepted Offers</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {offers.filter((o) => o.status === 'Accepted').length} Accepted
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Sign-off</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">
            {offers.filter((o) => o.status === 'Sent').length} Pending
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg. Placement CTC</span>
          <span className="text-xl font-extrabold text-brand-teal font-mono mt-1 block">₹13.5 LPA</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['all', 'Sent', 'Accepted', 'Draft'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-brand-teal text-slate-950 shadow-md shadow-brand-teal/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'all' ? 'All Offers' : tab}
          </button>
        ))}
      </div>

      {/* Offers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Role &amp; Opportunity</th>
                <th className="px-6 py-4">Package / Stipend</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.candidateAvatar}
                        alt={offer.candidateName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-white block">{offer.candidateName}</span>
                        <span className="text-[11px] text-slate-400">{offer.candidateCollege.split(',')[0]}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-white block">{offer.roleTitle}</span>
                    <span className="text-[11px] text-brand-teal">{offer.type} · {offer.workMode}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-emerald-300 block">{offer.compensation}</span>
                    <span className="text-[10px] text-slate-400">Fixed: {offer.breakdown.baseFixed}</span>
                  </td>

                  <td className="px-6 py-4 text-slate-300 font-mono">
                    {offer.joiningDate}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        offer.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : offer.status === 'Sent'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {offer.status === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
                      {offer.status === 'Sent' && <Clock className="w-3 h-3" />}
                      {offer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOfferForPreview(offer)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1 transition-colors border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-teal" />
                        <span>Letterhead</span>
                      </button>

                      {offer.status === 'Sent' && (
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Offer Drawer / Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-teal" />
                <h2 className="text-lg font-bold text-white">Generate Official Offer Letter</h2>
              </div>
              <button
                onClick={() => setIsGenerating(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Select Candidate</label>
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                >
                  {candidates.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.name} — {cand.college.split(',')[0]} ({cand.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Offer Designation</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Offer Classification</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option>Full-Time Employment</option>
                    <option>Internship with PPO</option>
                    <option>Summer Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Total Compensation (CTC)</label>
                  <input
                    type="text"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    placeholder="e.g. ₹14,50,000 / annum"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Base Fixed Component</label>
                  <input
                    type="text"
                    value={baseFixed}
                    onChange={(e) => setBaseFixed(e.target.value)}
                    placeholder="e.g. ₹12,00,000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Joining Date</label>
                  <input
                    type="text"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option>Hybrid</option>
                    <option>On-site</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue &amp; Send Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Offer Letter Preview Modal */}
      {selectedOfferForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            {/* Header / Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  TN
                </div>
                <div>
                  <h2 className="font-extrabold text-lg tracking-tight text-slate-900">TechNova Labs India Pvt. Ltd.</h2>
                  <p className="text-[10px] text-slate-600">
                    Indiranagar 100ft Road, Bengaluru, Karnataka 560038 · CIN: U72200KA2021PTC148920
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">Ref: TNL/OFF/{selectedOfferForPreview.id.toUpperCase()}</span>
                <span className="text-xs font-bold text-slate-700">{selectedOfferForPreview.generatedDate}</span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900">To,</p>
              <p className="font-bold text-sm text-slate-950">{selectedOfferForPreview.candidateName}</p>
              <p className="text-slate-600">{selectedOfferForPreview.candidateCollege}</p>
              <p className="text-slate-600">{selectedOfferForPreview.candidateEmail}</p>
            </div>

            {/* Subject */}
            <div className="text-xs font-bold text-slate-900 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              Subject: Formal Letter of Offer for the position of {selectedOfferForPreview.roleTitle}
            </div>

            {/* Body */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
              <p>
                Dear <strong>{selectedOfferForPreview.candidateName}</strong>,
              </p>
              <p>
                Following your performance and verified skills demonstrated through the <strong>SKILLSETU Platform</strong>, TechNova Labs is pleased to extend an offer of <strong>{selectedOfferForPreview.type}</strong> as a <strong>{selectedOfferForPreview.roleTitle}</strong> based out of our {selectedOfferForPreview.location} ({selectedOfferForPreview.workMode} arrangement).
              </p>

              {/* Compensation Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden my-3">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Compensation Component</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 text-slate-700">Annual Base Fixed Gross</td>
                      <td className="p-2 text-right font-bold text-slate-900">{selectedOfferForPreview.breakdown.baseFixed}</td>
                    </tr>
                    {selectedOfferForPreview.breakdown.variableBonus && (
                      <tr>
                        <td className="p-2 text-slate-700">Target Performance Variable</td>
                        <td className="p-2 text-right text-slate-800">{selectedOfferForPreview.breakdown.variableBonus}</td>
                      </tr>
                    )}
                    {selectedOfferForPreview.breakdown.retentionJoiningBonus && (
                      <tr>
                        <td className="p-2 text-slate-700">Retention / Joining Milestone Bonus</td>
                        <td className="p-2 text-right text-slate-800">{selectedOfferForPreview.breakdown.retentionJoiningBonus}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                      <td className="p-2.5">Total Annual CTC / Package</td>
                      <td className="p-2.5 text-right text-teal-700 font-bold text-xs">{selectedOfferForPreview.compensation}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-600">
                <strong>Reporting Date:</strong> {selectedOfferForPreview.joiningDate}. This offer is contingent upon successful academic graduation and verification of submitted credentials.
              </p>
            </div>

            {/* Signature Block */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200">
              <div>
                <div className="font-serif italic text-teal-800 text-xl font-bold">Rahul Verma</div>
                <p className="font-bold text-xs text-slate-900 mt-1">{selectedOfferForPreview.authorizedSignatory}</p>
                <p className="text-[10px] text-slate-500">{selectedOfferForPreview.signatoryTitle}</p>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-300">
                  Digitally Certified via SKILLSETU Registry
                </span>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={handlePrintOffer}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Letter</span>
              </button>
              <button
                onClick={() => setSelectedOfferForPreview(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
