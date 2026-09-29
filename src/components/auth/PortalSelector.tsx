'use client';

import React from 'react';
import { GraduationCap, Building2, School, LucideIcon } from 'lucide-react';

export type PortalRole = 'student' | 'industry' | 'college';

export interface PortalTabItem {
  id: PortalRole;
  label: string;
  icon: LucideIcon;
}

export const PORTAL_TABS: PortalTabItem[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'industry', label: 'Industry', icon: Building2 },
  { id: 'college', label: 'College', icon: School },
];

interface PortalSelectorProps {
  selectedRole: PortalRole;
  onRoleChange: (role: PortalRole) => void;
  className?: string;
}

export const PortalSelector: React.FC<PortalSelectorProps> = ({
  selectedRole,
  onRoleChange,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-3 gap-2.5 ${className}`}>
      {PORTAL_TABS.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center border text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-emerald-50/90 border-2 border-emerald-600 text-slate-900 shadow-sm ring-1 ring-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-xs'
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-1.5 transition-colors ${
                isSelected ? 'text-emerald-700' : 'text-slate-400'
              }`}
            />
            <div className={`font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
              {role.label}
            </div>
            <span
              className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded-full transition-colors ${
                isSelected
                  ? 'text-emerald-800 bg-emerald-100/80 border border-emerald-200'
                  : 'text-slate-400'
              }`}
            >
              {isSelected ? 'Active Portal' : 'Portal'}
            </span>
          </button>
        );
      })}
    </div>
  );
};
