'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Opportunity } from '@/types/student';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] lg:min-h-[480px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
      <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
      <span className="text-xs font-semibold text-slate-500 mt-2">Loading Live Opportunity Map...</span>
    </div>
  ),
});

interface OpportunityMapProps {
  userCoords: { lat: number; lng: number };
  isUsingGeolocation: boolean;
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  radiusKm: number;
}

export const OpportunityMap: React.FC<OpportunityMapProps> = (props) => {
  return <DynamicMap {...props} />;
};
