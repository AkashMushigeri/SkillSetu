'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Megaphone, X, Send } from 'lucide-react';

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementProps> = ({ isOpen, onClose }) => {
  const { addAnnouncement } = useCollege();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Internship');
  const [targetAudience, setTargetAudience] = useState('All 3rd & 4th Year Students');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title,
      category,
      targetAudience,
      content,
      important,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Create Campus Announcement</h2>
              <p className="text-xs text-slate-500">Publish alerts to student portals and email notifications.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Microsoft Azure Cloud Bootcamp Applications Open"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-teal focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-teal focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Placement Drive">Placement Drive</option>
                <option value="Training Program">Training Program</option>
                <option value="Assessment Deadline">Assessment Deadline</option>
                <option value="Industry Challenge">Industry Challenge</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                required
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. CSE & AIML 3rd Year"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-teal focus:outline-none placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the complete announcement text..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-teal focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="impFlag"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="impFlag" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark as High Priority / Urgent Alert
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Publish Announcement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
