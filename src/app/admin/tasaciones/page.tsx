'use client';

import React, { useState, useEffect } from 'react';
import { ValuationRequest } from '@/types';
import { Sparkles, MessageCircle, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { formatCLP, formatUF, generateWhatsAppLink } from '@/lib/utils';

export default function AdminTasacionesPage() {
  const [valuations, setValuations] = useState<ValuationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValuations = async () => {
      try {
        const res = await fetch('/api/valuations');
        if (res.ok) setValuations(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchValuations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
          Captación Inmobiliaria
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
          Tasaciones & Solicitudes de Propietarios ({valuations.length})
        </h1>
        <p className="text-xs text-slate-400">
          Propietarios que valoraron sus inmuebles con la herramienta Express
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Cargando tasaciones...</div>
        ) : valuations.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No hay tasaciones registradas aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/50">
                  <th className="py-3 px-4">Propietario</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4">Tipología</th>
                  <th className="py-3 px-4">Rango Estimado UF</th>
                  <th className="py-3 px-4">Estado Captación</th>
                  <th className="py-3 px-4 text-right">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {valuations.map((val) => {
                  const waLink = generateWhatsAppLink(
                    val.clientPhone,
                    `Hola ${val.clientName}, te contacto de Kaizen Propiedades respecto a la tasación de tu propiedad de ${val.surfaceM2}m² en ${val.commune} (${val.estimatedValueUFMin}-${val.estimatedValueUFMax} UF). ¿Te gustaría coordinar una visita presencial para iniciar la captación?`
                  );

                  return (
                    <tr key={val.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{val.clientName}</div>
                        <div className="text-[10px] text-slate-400">{val.clientEmail}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{val.clientPhone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-kaizen-gold" />
                          <span>{val.commune}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {val.region === 'valparaiso' ? '🌊 Costa V Región' : '🏔️ Santiago RM'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold uppercase text-kaizen-gold">{val.propertyType}</div>
                        <div className="text-[10px] text-slate-400">
                          {val.surfaceM2} m² • {val.bedrooms}d / {val.bathrooms}b ({val.condition})
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold font-serif text-kaizen-gold-light text-sm">
                          {val.estimatedValueUFMin.toLocaleString('es-CL')} - {val.estimatedValueUFMax.toLocaleString('es-CL')} UF
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ~ {formatCLP(val.estimatedValueCLP)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                          {val.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Ofrecer Captación</span>
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
