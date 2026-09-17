import { OpportunityType } from '@/types/student';

export function getOpportunityTypeBadgeColor(type: OpportunityType): {
  bg: string;
  text: string;
  border: string;
  markerColor: string;
  hex: string;
} {
  switch (type) {
    case 'Internship':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        markerColor: 'emerald',
        hex: '#10B981',
      };
    case 'Micro-Internship':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        markerColor: 'blue',
        hex: '#2563EB',
      };
    case 'Same-Day Task':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        markerColor: 'orange',
        hex: '#F97316',
      };
    case 'Part-Time Job':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        markerColor: 'purple',
        hex: '#9333EA',
      };
    case 'Full-Time Job':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        markerColor: 'teal',
        hex: '#0D9488',
      };
    case 'Industry Challenge':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        markerColor: 'rose',
        hex: '#E11D48',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        markerColor: 'slate',
        hex: '#64748B',
      };
  }
}
