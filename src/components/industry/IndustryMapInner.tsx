'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CollegePartner } from '@/types/industry';
import { useRouter } from 'next/navigation';
import { Building2, School, Compass, RotateCcw, Plus, Minus, Layers } from 'lucide-react';

interface IndustryMapInnerProps {
  companyCoords: { lat: number; lng: number };
  companyName: string;
  colleges: CollegePartner[];
  radiusKm: number;
  onSelectCollege?: (college: CollegePartner) => void;
}

export default function IndustryMapInner({
  companyCoords,
  companyName,
  colleges,
  radiusKm,
  onSelectCollege,
}: IndustryMapInnerProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'partner' | 'discovery'>('all');

  const safeCoords =
    companyCoords && typeof companyCoords.lat === 'number' && !isNaN(companyCoords.lat)
      ? companyCoords
      : { lat: 12.9784, lng: 77.6408 };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset leaflet id if attached previously
    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [safeCoords.lat, safeCoords.lng],
        zoom: radiusKm <= 5 ? 13 : radiusKm <= 10 ? 12 : radiusKm <= 25 ? 11 : 10,
        zoomControl: false,
        attributionControl: false,
      });

      // Standard OpenStreetMap tile layer with subdomains
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.attribution({ position: 'bottomright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Force size invalidation so tiles render even on initial layout
      const timer1 = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      const timer2 = setTimeout(() => {
        map.invalidateSize();
      }, 350);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update center, circle, markers on changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Invalidate size in case wrapper dimensions updated
    map.invalidateSize();

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
    }

    // 1. Draw Company Hiring Radius Circle
    const circle = L.circle([safeCoords.lat, safeCoords.lng], {
      color: '#059669',
      fillColor: '#10B981',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6, 8',
      radius: radiusKm * 1000,
    }).addTo(map);
    radiusCircleRef.current = circle;

    try {
      map.fitBounds(circle.getBounds(), { padding: [30, 30], maxZoom: 14 });
    } catch {
      map.setView([safeCoords.lat, safeCoords.lng], radiusKm <= 10 ? 12 : 11);
    }

    // 2. Add TechNova Labs Company HQ Marker
    const companyIcon = L.divIcon({
      className: 'custom-company-marker',
      html: `
        <div style="
          background: #082F38;
          border: 2.5px solid #10B981;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(16,185,129,0.45);
          font-weight: 900;
          font-size: 16px;
        ">
          🚀
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const companyMarker = L.marker([safeCoords.lat, safeCoords.lng], {
      icon: companyIcon,
      zIndexOffset: 2000,
    }).bindPopup(`
      <div style="font-family: sans-serif; padding: 6px; min-width: 190px;">
        <div style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:13px; color:#082F38;">
          <span>🚀</span> ${companyName}
        </div>
        <div style="font-size: 11px; color: #10B981; font-weight: 700; margin-top: 2px;">
          Industry HQ &bull; Indiranagar Innovation Center
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 4px;">
          Active hiring radius: <b>${radiusKm} km</b>
        </div>
      </div>
    `);

    markersLayerRef.current?.addLayer(companyMarker);

    // 3. Filter Colleges
    const visibleColleges = (colleges || []).filter((col) => {
      if (!col.coordinates || typeof col.coordinates.lat !== 'number') return false;
      if (filterType === 'partner') return col.partnershipStatus === 'Active';
      if (filterType === 'discovery') return col.partnershipStatus !== 'Active';
      return true;
    });

    // 4. Add College Markers
    visibleColleges.forEach((col) => {
      const isPartner = col.partnershipStatus === 'Active';
      const colColor = isPartner ? '#10B981' : col.partnershipStatus === 'Pending' ? '#F59E0B' : '#6366F1';

      const colIcon = L.divIcon({
        className: 'custom-college-pin',
        html: `
          <div style="
            background: ${colColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 12px;
              font-weight: 800;
            ">
              🏛️
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${colColor}; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">
              ${col.partnershipStatus} Partner
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #059669;">
              ${col.matchingStudentsCount} Matched Talent
            </span>
          </div>
          <div style="font-weight: bold; font-size: 12px; color: #0F172A; line-height: 1.3;">
            ${col.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            ${col.location}
          </div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0; font-size: 10px; color: #64748B;">
            <div>Verified Students: <b>${col.verifiedStudentsCount}</b></div>
            <div>Top Skills: <b>${col.topSkills.slice(0, 3).join(', ')}</b></div>
          </div>
          <a
            href="/industry/colleges"
            style="
              display: block;
              text-align: center;
              margin-top: 8px;
              padding: 6px 10px;
              background: #0D5C68;
              color: white;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
              text-decoration: none;
            "
          >
            Explore College Talent &rarr;
          </a>
        </div>
      `;

      const marker = L.marker([col.coordinates.lat, col.coordinates.lng], { icon: colIcon }).bindPopup(popupHtml);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [safeCoords, radiusKm, colleges, companyName, filterType]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (radiusCircleRef.current) {
      map.fitBounds(radiusCircleRef.current.getBounds(), { padding: [30, 30], maxZoom: 14 });
    } else {
      map.setView([safeCoords.lat, safeCoords.lng], 11);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Map DOM Element */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating Controls: Zoom & Recenter */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 shadow-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all hover:text-brand-teal active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all hover:text-brand-teal active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          title="Recenter Map on HQ"
          aria-label="Recenter Map"
          className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all hover:text-brand-teal active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Filter Pills */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200 flex items-center gap-1 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
            filterType === 'all'
              ? 'bg-brand-teal text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All ({colleges?.length || 0})
        </button>
        <button
          onClick={() => setFilterType('partner')}
          className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
            filterType === 'partner'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Partners
        </button>
        <button
          onClick={() => setFilterType('discovery')}
          className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
            filterType === 'discovery'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Discovery
        </button>
      </div>

      {/* Legend Overlay at Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-slate-200 text-[11px] space-y-1 hidden sm:block">
        <span className="font-bold text-slate-800 block text-[11px] mb-1">Ecosystem Legend</span>
        <div className="flex flex-col gap-1 text-[10px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-xs">🚀</span>
            <span className="font-semibold text-slate-800">{companyName} HQ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Active Partner College</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pending Partnership</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Potential Candidate Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
}
