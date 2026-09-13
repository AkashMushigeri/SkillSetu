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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-extrabold text-white">Campus Announcements</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish official alerts regarding internships, placement drives, workshops, and assessment deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-950/40"
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
            className={`p-6 bg-slate-900 border rounded-3xl shadow-xl space-y-3 transition-all ${
              anc.important ? 'border-purple-500/50 ring-1 ring-purple-500/30' : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {anc.category}
                </span>
                {anc.important && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> High Priority Alert
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">Posted: {anc.datePosted}</span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{anc.title}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">Target: {anc.targetAudience}</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{anc.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Status: Published</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Edit feature initialized for announcement', 'info')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => deleteAnnouncement(anc.id)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1"
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
