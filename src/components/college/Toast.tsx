'use client';

import React from 'react';
import { useCollege } from '@/context/CollegeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useCollege();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
    info: 'bg-blue-900/90 border-blue-500 text-blue-100',
    warning: 'bg-amber-900/90 border-amber-500 text-amber-100',
    error: 'bg-red-900/90 border-red-500 text-red-100',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={clearToast}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-auto text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
