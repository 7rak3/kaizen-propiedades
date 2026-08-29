'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  center = [-33.15, -71.1], // Between Santiago and Valparaiso
  zoom = 9,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;

    const initMap = async () => {
      // Dynamic import of leaflet and its css
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current, {
          center,
          zoom,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add pins
      properties.forEach((prop) => {
        if (!prop.lat || !prop.lng) return;

        const isValpo = prop.region === 'valparaiso';
        const formattedPrice = formatPrice(prop.priceUF);

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="cursor-pointer group">
              <div class="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg border flex items-center gap-1 transition-transform group-hover:scale-110 ${
                isValpo
                  ? 'bg-slate-900 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 text-amber-300 border-amber-400'
              }">
                <span>${formattedPrice}</span>
              </div>
              <div class="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b ${
                isValpo ? 'border-cyan-400' : 'border-amber-400'
              }"></div>
            </div>
          `,
          iconSize: [85, 30],
          iconAnchor: [42, 30],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([prop.lat, prop.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current);

        const popupContent = `
          <div style="min-width: 220px; font-family: sans-serif; padding: 2px;">
            <div style="height: 120px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
              <img src="${prop.images[0]}" alt="${prop.title}" style="width:100%; height:100%; object-fit: cover;" />
            </div>
            <div style="font-size: 10px; font-weight: bold; color: #c5a059; text-transform: uppercase;">${prop.commune}</div>
            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">${prop.title}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <div style="font-size: 14px; font-weight: bold; color: #0f172a;">${formattedPrice}</div>
              <a href="/propiedades/${prop.slug || prop.id}" style="font-size: 11px; background: #0f172a; color: #fff; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-weight: 600;">Ver Ficha</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectProperty) onSelectProperty(prop);
        });

        markersRef.current.push(marker);
      });

      // Adjust view bounds if multiple markers exist
      if (properties.length > 1 && markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
      }
    };

    initMap();

    return () => {
      // Map cleanup on unmount if needed
    };
  }, [properties, formatPrice]);

  // Pan to selected property if passed
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current && selectedProperty.lat && selectedProperty.lng) {
      mapInstanceRef.current.setView([selectedProperty.lat, selectedProperty.lng], 14, {
        animate: true,
      });
    }
  }, [selectedProperty]);

  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
