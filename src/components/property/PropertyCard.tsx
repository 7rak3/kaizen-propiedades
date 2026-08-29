'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import {
  Heart,
  Scale,
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  TrendingUp,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { formatCLP, generateWhatsAppLink, calculateCapRate } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { formatPrice, currency } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare } = useComparison();

  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const capRateInfo =
    property.estimatedMonthlyRentCLP && property.operation === 'venta'
      ? calculateCapRate(property.priceUF, property.estimatedMonthlyRentCLP)
      : null;

  const whatsAppMessage = `Hola Kaizen Propiedades! Me interesa información sobre la propiedad [${property.code}] "${property.title}" publicada en ${property.commune}.`;
  const whatsAppLink = generateWhatsAppLink('56984561234', whatsAppMessage);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link href={`/propiedades/${property.slug || property.id}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-sm ${
              property.operation === 'venta'
                ? 'bg-kaizen-dark/90 text-white border border-white/20'
                : property.operation === 'arriendo'
                ? 'bg-blue-900/90 text-blue-100 border border-blue-400/20'
                : 'bg-emerald-900/90 text-emerald-100 border border-emerald-400/20'
            }`}
          >
            {property.operation === 'venta'
              ? 'Venta'
              : property.operation === 'arriendo'
              ? 'Arriendo'
              : 'Vacacional'}
          </span>

          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md ${
              property.region === 'valparaiso'
                ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/30'
                : 'bg-slate-900/80 text-slate-200 border border-slate-600/30'
            }`}
          >
            {property.region === 'valparaiso' ? '🌊 V Región Costa' : '🏔️ Santiago RM'}
          </span>

          {property.isFeatured && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-kaizen-gold text-slate-950 flex items-center gap-1 shadow-gold">
              <Sparkles className="w-3 h-3" /> Destacada
            </span>
          )}
        </div>

        {/* Action buttons (Heart & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => addToCompare(property)}
            aria-label="Comparar propiedad"
            className={`p-2 rounded-full backdrop-blur-md transition ${
              inCompare
                ? 'bg-kaizen-gold text-slate-950 shadow-md font-bold'
                : 'bg-black/40 text-white hover:bg-black/70'
            }`}
            title={inCompare ? 'Quitar de comparación' : 'Agregar a comparación'}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(property.id)}
            aria-label="Guardar en favoritos"
            className={`p-2 rounded-full backdrop-blur-md transition ${
              favorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/70'
            }`}
            title={favorite ? 'Guardado en favoritos' : 'Guardar favorito'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Investment Cap Rate Pill (Bottom right of image) */}
        {capRateInfo && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 backdrop-blur-sm shadow">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Cap Rate Est. {capRateInfo.capRatePercent}%
            </span>
          </div>
        )}

        {/* Code Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono backdrop-blur-sm">
            {property.code}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Commune */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-kaizen-gold uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {property.commune}, {property.city}
              {property.neighborhood ? ` • ${property.neighborhood}` : ''}
            </span>
          </div>

          {/* Title */}
          <Link href={`/propiedades/${property.slug || property.id}`}>
            <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-kaizen-gold transition leading-snug">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Attribute Specs */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-slate-600">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
              <Bed className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.bedrooms}</span>
            </div>
            <span className="text-[10px] text-slate-500">Dorm.</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
              <Bath className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.bathrooms}</span>
            </div>
            <span className="text-[10px] text-slate-500">Baños</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.totalSurfaceM2 || property.usefulSurfaceM2}</span>
            </div>
            <span className="text-[10px] text-slate-500">m² Totales</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.parkings}</span>
            </div>
            <span className="text-[10px] text-slate-500">Estac.</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg sm:text-xl font-bold font-serif text-slate-900 tracking-tight">
              {formatPrice(property.priceUF)}
            </div>
            {property.commonExpensesCLP > 0 && (
              <div className="text-[10px] text-slate-500">
                GG.CC: {formatCLP(property.commonExpensesCLP)} / mes
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition border border-emerald-200"
              title="Consultar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <Link
              href={`/propiedades/${property.slug || property.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-kaizen-gold hover:text-slate-950 transition"
            >
              Ver Ficha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
