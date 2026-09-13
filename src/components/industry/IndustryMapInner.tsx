'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CollegePartner } from '@/types/industry';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [companyCoords.lat, companyCoords.lng],
        zoom: radiusKm <= 10 ? 12 : radiusKm <= 25 ? 11 : 10,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

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

  // Update center, circle, markers on changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([companyCoords.lat, companyCoords.lng], radiusKm <= 10 ? 12 : radiusKm <= 25 ? 11 : 10, {
      animate: true,
    });

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
    }

    // 1. Draw Company Hiring Radius Circle
    const circle = L.circle([companyCoords.lat, companyCoords.lng], {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '5, 8',
      radius: radiusKm * 1000,
    }).addTo(map);
    radiusCircleRef.current = circle;

    // 2. Add TechNova Labs Company HQ Marker
    const companyIcon = L.divIcon({
      className: 'custom-company-marker',
      html: `
        <div style="
          background: #082F38;
          border: 2.5px solid #10B981;
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(16,185,129,0.4);
          font-weight: 900;
          font-size: 14px;
        ">
          🚀
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const companyMarker = L.marker([companyCoords.lat, companyCoords.lng], {
      icon: companyIcon,
      zIndexOffset: 2000,
    }).bindPopup(`
      <div style="font-family: sans-serif; padding: 6px; min-width: 180px;">
        <div style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:13px; color:#082F38;">
          <span>🚀</span> ${companyName}
        </div>
        <div style="font-size: 11px; color: #10B981; font-weight: 700; margin-top: 2px;">
          Industry HQ &bull; Indiranagar Innovation Center
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 4px;">
          Radius: ${radiusKm} km search active
        </div>
      </div>
    `);

    markersLayerRef.current?.addLayer(companyMarker);

    // 3. Add Partner & Discovery Colleges Markers
    colleges.forEach((col) => {
      const isPartner = col.partnershipStatus === 'Active';
      const colColor = isPartner ? '#10B981' : col.partnershipStatus === 'Pending' ? '#F59E0B' : '#6366F1';

      const colIcon = L.divIcon({
        className: 'custom-college-pin',
        html: `
          <div style="
            background: ${colColor};
            width: 30px;
            height: 30px;
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
              font-size: 11px;
              font-weight: 800;
            ">
              🏛️
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
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

      const marker = L.marker([col.coordinates.lat, col.coordinates.lng], { icon: colIcon })
        .bindPopup(popupHtml);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [companyCoords, radiusKm, colleges, companyName]);

  return (
    <div className="relative w-full h-full min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
