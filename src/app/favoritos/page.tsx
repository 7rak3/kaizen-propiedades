'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart, Share2, ArrowRight } from 'lucide-react';

export default function FavoritosPage() {
  const { favorites, favoritesCount } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data.filter((p: Property) => favorites.includes(p.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [favorites]);

  const handleShareList = () => {
    const text = `Hola! Revisa esta lista de propiedades seleccionadas en Kaizen Propiedades:\n${properties
      .map((p) => `• ${p.title} (${p.commune}): ${window.location.origin}/propiedades/${p.slug || p.id}`)
      .join('\n')}`;

    if (navigator.share) {
      navigator.share({
        title: 'Mis Propiedades Favoritas - Kaizen',
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('¡Lista de favoritos copiada al portapapeles!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>Tu Colección Personal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900">
              Propiedades Guardadas ({favoritesCount})
            </h1>
          </div>

          {properties.length > 0 && (
            <button
              onClick={handleShareList}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Compartir Lista por WhatsApp / Email</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-8">
            <Heart className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-slate-800">
              Aún no tienes propiedades guardadas
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explora nuestro catálogo y haz clic en el corazón <Heart className="w-3.5 h-3.5 inline text-rose-500" /> en cualquier propiedad para guardarla aquí sin necesidad de registro.
            </p>
            <div className="pt-2">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
