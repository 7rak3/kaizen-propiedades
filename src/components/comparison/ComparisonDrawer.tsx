'use client';

import React from 'react';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  X,
  Scale,
  Trash2,
  Bed,
  Bath,
  Maximize2,
  Car,
  Check,
  Minus,
  TrendingUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { formatCLP, calculateCapRate } from '@/lib/utils';

export const ComparisonDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isDrawerOpen, setIsDrawerOpen } = useComparison();
  const { formatPrice } = useCurrency();

  if (!isDrawerOpen) return null;

  const allFeatures = Array.from(
    new Set(compareList.flatMap((p) => p.features || []))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 bg-kaizen-dark text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-kaizen-gold text-slate-950 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Comparador de Propiedades Lado a Lado</h2>
              <p className="text-xs text-slate-400">
                Comparando {compareList.length} de 3 propiedades seleccionadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar
              </button>
            )}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {compareList.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Scale className="w-16 h-16 text-slate-300 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-semibold text-slate-700">
                No has agregado propiedades para comparar
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Haz clic en el ícono de balanza <Scale className="w-4 h-4 inline text-kaizen-gold" /> en las tarjetas de propiedades para comparar precios, m², ubicación y características.
              </p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-kaizen-dark text-white text-sm font-semibold hover:bg-slate-800 transition"
              >
                Explorar Propiedades
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid of properties */}
              <div
                className={`grid gap-4 ${
                  compareList.length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : compareList.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-3'
                }`}
              >
                {compareList.map((prop) => {
                  const capRate =
                    prop.estimatedMonthlyRentCLP && prop.operation === 'venta'
                      ? calculateCapRate(prop.priceUF, prop.estimatedMonthlyRentCLP)
                      : null;
                  const pricePerM2 = prop.totalSurfaceM2
                    ? (prop.priceUF / prop.totalSurfaceM2).toFixed(1)
                    : null;

                  return (
                    <div
                      key={prop.id}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col relative"
                    >
                      <button
                        onClick={() => removeFromCompare(prop.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 z-10 transition"
                        title="Quitar de comparación"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-[11px] font-bold text-kaizen-gold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{prop.commune}, {prop.city}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-1 mb-2">
                        {prop.title}
                      </h4>

                      <div className="text-xl font-bold font-serif text-slate-950 mb-1">
                        {formatPrice(prop.priceUF)}
                      </div>

                      {pricePerM2 && (
                        <div className="text-xs text-slate-500 mb-3">
                          {pricePerM2} UF / m²
                        </div>
                      )}

                      <Link
                        href={`/propiedades/${prop.slug || prop.id}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full py-2 text-center rounded-lg bg-kaizen-dark text-white text-xs font-semibold hover:bg-kaizen-gold hover:text-slate-950 transition flex items-center justify-center gap-1.5"
                      >
                        <span>Ver Ficha Completa</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70">
                      <th className="p-3 font-bold text-slate-700 w-1/4">Atributo</th>
                      {compareList.map((p) => (
                        <th key={p.id} className="p-3 font-bold text-slate-900">
                          {p.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Operación</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 uppercase font-bold text-kaizen-gold">
                          {p.operation}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Superficie Total</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 font-medium">
                          {p.totalSurfaceM2} m²
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Superficie Útil</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 font-medium">
                          {p.usefulSurfaceM2} m²
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Dormitorios</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 font-bold">
                          {p.bedrooms} dorms.
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Baños</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 font-bold">
                          {p.bathrooms} baños
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Estacionamientos</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3">
                          {p.parkings}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Gastos Comunes</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 font-medium text-slate-700">
                          {p.commonExpensesCLP > 0 ? formatCLP(p.commonExpensesCLP) : 'Sin info'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Orientación</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3">
                          {p.orientation || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Features Matrix */}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={compareList.length + 1} className="p-3 text-slate-800 uppercase tracking-wider text-[10px]">
                        Equipamiento y Amenidades
                      </td>
                    </tr>
                    {allFeatures.map((feat) => (
                      <tr key={feat}>
                        <td className="p-3 font-medium text-slate-600">{feat}</td>
                        {compareList.map((p) => {
                          const has = p.features?.includes(feat);
                          return (
                            <td key={p.id} className="p-3">
                              {has ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Sí
                                </span>
                              ) : (
                                <span className="text-slate-300">
                                  <Minus className="w-4 h-4" />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
