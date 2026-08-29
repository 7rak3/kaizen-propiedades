import React from 'react';
import Link from 'next/link';
import { INITIAL_AGENTS } from '@/data/mockData';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  Compass,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Mejora Continua • 改善
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mt-2 mb-6">
            Redefiniendo el Corretaje Inmobiliario en Chile
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Kaizen Propiedades nace de la convicción de que comprar, vender o invertir en bienes raíces debe ser un proceso impecable, basado en la disciplina, la transparencia absoluta y el análisis financiero riguroso.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-kaizen-gold flex items-center justify-center mb-6 border border-amber-200">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Filosofía Kaizen
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimizamos cada etapa: desde la producción audiovisual hiperdetallada de la propiedad, hasta el análisis comparativo de mercado y la tramitación bancaria.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 border border-cyan-200">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Enfoque Bipolar RM & Costa
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unimos el dinamismo financiero del Sector Oriente de Santiago con la alta plusvalía y demanda de segunda vivienda en la Costa de Valparaíso (Concón, Viña, Zapallar).
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Auditoría Legal Integral
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada inmueble en nuestra cartera cuenta con estudio de títulos previo para evitar sorpresas o retrasos en la promesa de compraventa y escrituración.
            </p>
          </div>
        </div>
      </div>

      {/* Team Brokers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Nuestro Equipo
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mt-1">
            Brokers Inmobiliarios Especialistas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_AGENTS.map((agent) => {
            const waLink = generateWhatsAppLink(
              agent.whatsapp,
              `Hola ${agent.name}, deseo asesoría inmobiliaria con Kaizen Propiedades.`
            );

            return (
              <div
                key={agent.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full rounded-2xl overflow-hidden mb-6 bg-slate-100">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-kaizen-gold uppercase tracking-wider block">
                    {agent.role}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {agent.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {agent.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="w-full py-2 text-center block text-xs text-slate-500 hover:text-slate-900 transition font-mono"
                  >
                    {agent.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
