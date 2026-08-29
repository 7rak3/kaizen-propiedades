'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import {
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  TrendingUp,
} from 'lucide-react';
import { formatCLP, formatUF } from '@/lib/utils';
import { CURRENT_UF_CLP } from '@/data/mockData';

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todas');

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) setProperties(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la propiedad [${code}]?`)) return;

    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (property: Property) => {
    try {
      const updated = { isFeatured: !property.isFeatured };
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === property.id ? { ...p, isFeatured: !p.isFeatured } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.commune.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = regionFilter === 'todas' || p.region === regionFilter;
    const matchesStatus = statusFilter === 'todas' || p.status === statusFilter;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Gestión Inmobiliaria
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            Catálogo de Propiedades ({filteredProperties.length})
          </h1>
          <p className="text-xs text-slate-400">
            Administra publicaciones en Santiago RM y V Región Costa
          </p>
        </div>

        <Link
          href="/admin/propiedades/nueva"
          className="px-4 py-2.5 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-xs hover:bg-kaizen-gold-light transition shadow-gold flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Publicar Propiedad</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código, título o comuna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-kaizen-gold"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-kaizen-gold"
          >
            <option value="todas">Todas las Regiones</option>
            <option value="metropolitana">🏔️ Santiago (RM)</option>
            <option value="valparaiso">🌊 V Región Costa</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-kaizen-gold"
          >
            <option value="todas">Todos los Estados</option>
            <option value="publicada">Publicada</option>
            <option value="destacada">Destacada</option>
            <option value="en_negociacion">En Negociación</option>
            <option value="vendida">Vendida</option>
            <option value="arrendada">Arrendada</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Cargando catálogo...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No se encontraron propiedades con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/50">
                  <th className="py-3 px-4">Código / Portada</th>
                  <th className="py-3 px-4">Título y Ubicación</th>
                  <th className="py-3 px-4">Operación</th>
                  <th className="py-3 px-4">Precio UF</th>
                  <th className="py-3 px-4">Atributos</th>
                  <th className="py-3 px-4 text-center">Destacada</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <span className="font-mono text-xs font-bold text-kaizen-gold">
                          {prop.code}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white truncate">{prop.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-kaizen-gold" />
                        <span>
                          {prop.commune} • {prop.region === 'valparaiso' ? 'Costa' : 'RM'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 uppercase font-bold text-[10px]">
                        {prop.operation}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold font-serif text-white">
                      {formatUF(prop.priceUF)}
                      <div className="text-[10px] font-mono text-slate-500 font-normal">
                        ~ {formatCLP(prop.priceUF * CURRENT_UF_CLP)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {prop.bedrooms}d • {prop.bathrooms}b • {prop.totalSurfaceM2}m²
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prop)}
                        className={`p-1.5 rounded-lg border transition ${
                          prop.isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                        title="Alternar estado destacado"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/propiedades/${prop.slug || prop.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white inline-block"
                        title="Ver en portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(prop.id, prop.code)}
                        className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/50 inline-block transition"
                        title="Eliminar propiedad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
