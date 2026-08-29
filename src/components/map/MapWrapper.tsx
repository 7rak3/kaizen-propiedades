'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Property } from '@/types';

const DynamicMap = dynamic(
  () => import('@/components/map/PropertyMap').then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-medium text-sm animate-pulse border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-kaizen-gold border-t-transparent rounded-full animate-spin" />
          <span>Cargando mapa interactivo...</span>
        </div>
      </div>
    ),
  }
);

interface MapWrapperProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicMap {...props} />;
};
