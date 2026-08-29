'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property, Lead, VisitBooking, MarketMetrics } from '@/types';
import {
  Building2,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Eye,
  CheckCircle2,
  MapPin,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { formatCLP, formatUF, generateWhatsAppLink } from '@/lib/utils';
import { CURRENT_UF_CLP } from '@/data/mockData';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, lRes, vRes, mRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/leads'),
          fetch('/api/visits'),
          fetch('/api/metrics'),
        ]);

        if (pRes.ok) setProperties(await pRes.json());
        if (lRes.ok) setLeads(await lRes.json());
        if (vRes.ok) setVisits(await vRes.json());
        if (mRes.ok) setMetrics(await mRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPortfolioUF = properties.reduce(
    (acc, p) => acc + (p.operation === 'venta' ? p.priceUF : 0),
    0
  );

  const activePropertiesCount = properties.filter(
    (p) => p.status === 'publicada' || p.status === 'destacada'
  ).length;

  const rmCount = properties.filter((p) => p.region === 'metropolitana').length;
  const valpoCount = properties.filter((p) => p.region === 'valparaiso').length;

  const handleUpdateLeadStage = async (leadId: string, newStage: Lead['stage']) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Panel de Control Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            Dashboard Kaizen Propiedades
          </h1>
          <p className="text-xs text-slate-400">
            Monitoreo en tiempo real de cartera, clientes, pipeline y visitas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/propiedades/nueva"
            className="px-4 py-2.5 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-xs hover:bg-kaizen-gold-light transition shadow-gold flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Nueva Propiedad</span>
          </Link>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Valor Cartera Activa</span>
            <Building2 className="w-4 h-4 text-kaizen-gold" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            {formatUF(totalPortfolioUF)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            ~ {formatCLP(totalPortfolioUF * CURRENT_UF_CLP)}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Inmuebles en Cartera</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            {properties.length}{' '}
            <span className="text-xs font-normal text-emerald-400">({activePropertiesCount} activos)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span>🏔️ RM: {rmCount}</span>
            <span>•</span>
            <span>🌊 Costa: {valpoCount}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Leads en Pipeline CRM</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            {leads.length} prospectos
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>{leads.filter((l) => l.stage === 'oferta' || l.stage === 'en_cierre').length} en negociación</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Visitas Agendadas</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            {visits.length} solicitudes
          </div>
          <div className="text-[11px] text-amber-300 mt-1">
            {visits.filter((v) => v.status === 'pendiente').length} pendientes de confirmación
          </div>
        </div>
      </div>

      {/* RECENT LEADS PIPELINE SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-serif">
              Prospectos Recientes (Leads & Visitas)
            </h3>
            <p className="text-xs text-slate-400">
              Gestión rápida de estados de prospectos captados en la web
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-kaizen-gold hover:underline flex items-center gap-1"
          >
            <span>Ver Tablero Kanban Completo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Contacto / WhatsApp</th>
                <th className="py-2.5 px-3">Propiedad / Origen</th>
                <th className="py-2.5 px-3">Mensaje</th>
                <th className="py-2.5 px-3">Etapa Pipeline</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {leads.slice(0, 5).map((lead) => {
                const waLink = generateWhatsAppLink(
                  lead.phone,
                  `Hola ${lead.name}, te contacto de Kaizen Propiedades respecto a tu consulta.`
                );

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{lead.email}</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200 truncate max-w-xs">
                        {lead.propertyTitle || 'Consulta General / Tasador'}
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-kaizen-gold uppercase font-bold">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-400">
                      {lead.message}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={lead.stage}
                        onChange={(e: any) => handleUpdateLeadStage(lead.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-semibold text-kaizen-gold outline-none"
                      >
                        <option value="nuevo">Nuevo Lead</option>
                        <option value="contactado">Contactado</option>
                        <option value="visita_coordinada">Visita Coordinada</option>
                        <option value="oferta">Oferta Presentada</option>
                        <option value="en_cierre">En Cierre</option>
                        <option value="ganado">Ganado / Cerrado</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold hover:bg-emerald-900 transition"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROPERTIES SUMMARY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-serif">
              Inventario de Propiedades
            </h3>
            <p className="text-xs text-slate-400">
              Listado con código, precio en UF, zona y estado de publicación
            </p>
          </div>
          <Link
            href="/admin/propiedades"
            className="text-xs font-bold text-kaizen-gold hover:underline flex items-center gap-1"
          >
            <span>Administrar Catálogo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Propiedad</th>
                <th className="py-2.5 px-3">Ubicación</th>
                <th className="py-2.5 px-3">Precio UF</th>
                <th className="py-2.5 px-3">Sup. Total</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {properties.slice(0, 6).map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 flex items-center gap-3">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white truncate max-w-xs">{prop.title}</div>
                      <span className="font-mono text-[10px] text-kaizen-gold">{prop.code}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div>{prop.commune}</div>
                    <div className="text-[10px] text-slate-400">
                      {prop.region === 'valparaiso' ? '🌊 V Región Costa' : '🏔️ RM Santiago'}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold font-serif text-white">
                    {formatUF(prop.priceUF)}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    {prop.totalSurfaceM2} m²
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                      {prop.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Link
                      href={`/propiedades/${prop.slug || prop.id}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white inline-block"
                      title="Ver en portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
