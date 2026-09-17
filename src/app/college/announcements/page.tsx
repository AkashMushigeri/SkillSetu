'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Megaphone, Plus, Trash2, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CreateAnnouncementModal } from '@/components/college/CreateAnnouncementModal';

export default function CampusAnnouncementsPage() {
  const { announcements, deleteAnnouncement, showToast } = useCollege();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Campus Announcements</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Publish official alerts regarding internships, placement drives, workshops, and assessment deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className={`p-6 bg-white border rounded-3xl shadow-card space-y-3 transition-all ${
              anc.important ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  {anc.category}
                </span>
                {anc.important && (
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> High Priority Alert
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">Posted: {anc.datePosted}</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{anc.title}</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">Target: {anc.targetAudience}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{anc.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Status: Published</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Edit feature initialized for announcement', 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => deleteAnnouncement(anc.id)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
