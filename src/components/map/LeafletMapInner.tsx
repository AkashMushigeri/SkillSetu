'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Opportunity } from '@/types/student';
import { getOpportunityTypeBadgeColor } from '@/lib/styleUtils';

interface LeafletMapInnerProps {
  userCoords: { lat: number; lng: number };
  isUsingGeolocation: boolean;
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  radiusKm: number;
}

export default function LeafletMapInner({
  userCoords,
  isUsingGeolocation,
  opportunities,
  onSelectOpportunity,
  radiusKm,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: radiusKm <= 5 ? 13 : radiusKm <= 15 ? 12 : 10,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add small custom attribution in bottom-right
      L.control.attribution({ position: 'bottomright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center, radius circle, and markers whenever coords, radius, or filtered opps change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([userCoords.lat, userCoords.lng], radiusKm <= 5 ? 13 : radiusKm <= 15 ? 12 : 10, {
      animate: true,
    });

    // Clean previous markers and circle
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
    }

    // Draw user search radius boundary circle
    const circle = L.circle([userCoords.lat, userCoords.lng], {
      color: '#0D5C68',
      fillColor: '#0D5C68',
      fillOpacity: 0.07,
      weight: 1.5,
      dashArray: '4, 6',
      radius: radiusKm * 1000,
    }).addTo(map);
    radiusCircleRef.current = circle;

    // 1. Add Student "You are here" Location Marker
    const userPulseIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="custom-pulse-marker">
          <div class="pulse-ring"></div>
          <div class="pulse-dot"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lng], {
      icon: userPulseIcon,
      zIndexOffset: 1000,
    }).bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: bold; font-size: 13px; color: #082F38;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
          You are here
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 3px;">
          ${isUsingGeolocation ? 'Live GPS Location' : 'Selected City Center'}
        </div>
      </div>
    `);

    markersLayerRef.current?.addLayer(userMarker);

    // 2. Add Opportunities Markers
    opportunities.forEach((opp) => {
      const colors = getOpportunityTypeBadgeColor(opp.type);
      const isBoosted = opp.isMatchBoosted;

      const oppIcon = L.divIcon({
        className: 'custom-opp-pin',
        html: `
          <div style="
            background: ${colors.hex};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2.5px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 10px;
              font-weight: 800;
            ">
              ${opp.matchScore || 80}%
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${colors.hex}; background: #F1F5F9; padding: 2px 6px; border-radius: 6px;">
              ${opp.type}
            </span>
            <span style="font-size: 11px; font-weight: 800; color: #059669;">
              ${opp.matchScore}% Match
            </span>
          </div>
          <div style="font-weight: bold; font-size: 13px; color: #0F172A; line-height: 1.3;">
            ${opp.title}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px; font-weight: 600;">
            ${opp.company}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748B; margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
            <span>📍 ${opp.distanceKm} km away</span>
            <span style="font-weight: 700; color: #082F38;">${opp.stipend}</span>
          </div>
          ${
            isBoosted
              ? `<div style="font-size: 10px; color: #047857; background: #ECFDF5; padding: 3px 6px; border-radius: 4px; margin-top: 6px; font-weight: 600;">
                  ✓ Verified Python Boosted Match
                </div>`
              : ''
          }
          <button
            id="view-opp-btn-${opp.id}"
            style="
              width: 100%;
              margin-top: 8px;
              padding: 6px 10px;
              background: #0D5C68;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            "
          >
            View Opportunity Details
          </button>
        </div>
      `;

      const marker = L.marker([opp.coordinates.lat, opp.coordinates.lng], { icon: oppIcon })
        .bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-opp-btn-${opp.id}`);
        if (btn) {
          btn.onclick = () => onSelectOpportunity(opp);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [userCoords, radiusKm, opportunities, isUsingGeolocation, onSelectOpportunity]);

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[480px]">
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl shadow-inner border border-slate-200" />
      
      {/* Map legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-200 text-[10px] space-y-1 hidden sm:block">
        <span className="font-bold text-slate-800 block text-[11px] mb-1">Opportunity Pins</span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Internship</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Micro-Internship</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Same-Day Task</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Part-Time Job</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Full-Time Job</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Industry Challenge</div>
        </div>
      </div>
    </div>
  );
}
