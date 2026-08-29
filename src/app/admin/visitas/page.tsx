'use client';

import React, { useState, useEffect } from 'react';
import { VisitBooking } from '@/types';
import {
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  XCircle,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';

export default function AdminVisitasPage() {
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits');
      if (res.ok) setVisits(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleUpdateStatus = async (id: string, status: VisitBooking['status']) => {
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVisits((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status } : v))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
          Coordinación de Terreno
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
          Agenda de Visitas Inmobiliarias ({visits.length})
        </h1>
        <p className="text-xs text-slate-400">
          Gestiona solicitudes presenciales y videollamadas 360°
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Cargando visitas...</div>
        ) : visits.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No hay visitas registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/50">
                  <th className="py-3 px-4">Propiedad</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Fecha y Horario</th>
                  <th className="py-3 px-4">Modalidad</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {visits.map((visit) => {
                  const waLink = generateWhatsAppLink(
                    visit.clientPhone,
                    `Hola ${visit.clientName}, te escribo de Kaizen Propiedades para confirmar tu visita ${visit.visitType} el día ${visit.date} (${visit.timeSlot}) a la propiedad "${visit.propertyTitle}".`
                  );

                  return (
                    <tr key={visit.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {visit.propertyImage && (
                            <img
                              src={visit.propertyImage}
                              alt="Foto"
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-white max-w-xs truncate">
                              {visit.propertyTitle}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {visit.propertyId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{visit.clientName}</div>
                        <div className="text-[10px] text-slate-400">{visit.clientEmail}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{visit.clientPhone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Calendar className="w-3.5 h-3.5 text-kaizen-gold" />
                          <span>{visit.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{visit.timeSlot}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            visit.visitType === 'presencial'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {visit.visitType === 'presencial' ? (
                            <Users className="w-3 h-3" />
                          ) : (
                            <Video className="w-3 h-3" />
                          )}
                          <span>{visit.visitType === 'presencial' ? 'Presencial' : 'Videollamada'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={visit.status}
                          onChange={(e: any) => handleUpdateStatus(visit.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="realizada">Realizada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Confirmar WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
