'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { AIInterviewModal } from '@/components/AIInterviewModal';
import {
  Sparkles,
  Bot,
  Video,
  Mic,
  ArrowLeft,
  CheckCircle2,
  Award,
  Play,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function StudentAIInterviewPage() {
  const { profile } = useStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/student/skills"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skills Hub
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI Mock Interview &amp; Voice Evaluation
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Technical Interview Practice
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice real-time technical interview questions with voice microphone input, live speech-to-text transcription, camera posture evaluation, and instant AI skill feedback.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-brand-emerald to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 self-start md:self-auto hover:scale-105"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start AI Interview Session</span>
        </button>
      </div>

      {/* Role Selection & Preparation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Select Practice Domain</h3>
            <p className="text-xs text-slate-500">Target role for AI technical question generation</p>
          </div>

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-teal"
          >
            <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
            <option value="Frontend React Developer">Frontend React Developer</option>
            <option value="Backend Node.js Engineer">Backend Node.js Engineer</option>
            <option value="Data Analyst &amp; Python Developer">Data Analyst &amp; Python Developer</option>
            <option value="Machine Learning Associate">Machine Learning Associate</option>
          </select>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>Microphone Input</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Browser will explicitly request microphone permissions for real-time speech transcription &amp; voice volume analysis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
              <Video className="w-4 h-4 text-blue-600" />
              <span>Webcam Video Feed</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Real-time video feed lets you monitor eye contact and interview posture during practice questions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Instant AI Score</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Evaluates technical vocabulary, communication fluency, and problem-solving explanation quality.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Practice Session Now</span>
          </button>
        </div>
      </div>

      {/* AI Interview Modal */}
      <AIInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidateName={profile.name}
        roleTitle={targetRole}
      />
    </div>
  );
}
