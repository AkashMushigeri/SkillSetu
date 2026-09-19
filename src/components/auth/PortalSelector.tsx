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
                ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-1.5 transition-colors ${
                isSelected ? 'text-emerald-400' : 'text-slate-500'
              }`}
            />
            <div className="font-bold text-slate-100">{role.label}</div>
            <span
              className={`text-[10px] font-medium mt-0.5 transition-colors ${
                isSelected ? 'text-emerald-400' : 'text-slate-500'
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
