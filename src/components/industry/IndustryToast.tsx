'use client';

import React from 'react';
import { useIndustry } from '@/context/IndustryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const IndustryToast: React.FC = () => {
  const { toasts, removeToast } = useIndustry();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all transform animate-in slide-in-from-bottom-3 duration-300 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300'
              : toast.type === 'info'
              ? 'bg-slate-900/95 border-sky-500/50 text-sky-300'
              : toast.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/50 text-amber-300'
              : 'bg-slate-900/95 border-rose-500/50 text-rose-300'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs leading-relaxed text-slate-200">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
