'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CHILE_COMMUNES } from '@/data/mockData';
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Search,
  Award,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PersonalShopperPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('metropolitana');
  const [commune, setCommune] = useState('Las Condes');
  const [budgetUF, setBudgetUF] = useState('');
  const [operation, setOperation] = useState('compra');
  const [requirements, setRequirements] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableCommunes =
    region === 'metropolitana' ? CHILE_COMMUNES.metropolitana : CHILE_COMMUNES.valparaiso;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: 'personal_shopper',
          message: `Mandato Personal Shopper: ${operation} en ${commune} (${region}). Presupuesto: ${budgetUF} UF. Requisitos: ${requirements}`,
          budgetUF: Number(budgetUF) || 0,
          preferredRegion: region,
          stage: 'nuevo',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Servicio VIP de Búsqueda Exclusiva</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
            Personal Shopper Inmobiliario
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            ¿No encuentras lo que buscas en los portales convencionales? Activamos nuestra red de contactos privados y oportunidades off-market en Santiago Oriente y la Costa.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-luxury text-center space-y-4 max-w-lg mx-auto animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              ¡Mandato de Búsqueda Activado!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gracias, <strong>{name}</strong>. Un broker asignado comenzará el rastreo de propiedades en <strong>{commune}</strong> y te contactará al <strong>{phone}</strong> con la primera selección filtrada.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-luxury">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Objetivo
                  </label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="compra_vivienda">Comprar para Vivir</option>
                    <option value="compra_inversion">Comprar para Inversión (Renta / Cap Rate)</option>
                    <option value="arriendo_largo_plazo">Arrendar Año Corrido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Presupuesto Máximo (UF)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ej: 18000"
                    value={budgetUF}
                    onChange={(e) => setBudgetUF(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Región Preferida
                  </label>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCommune('Las Condes');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="metropolitana">Santiago (RM)</option>
                    <option value="valparaiso">V Región Costa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Comuna de Interés
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {availableCommunes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ¿Qué características indispensables debe tener?
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Mínimo 3 dormitorios, vista despejada al mar / cordillera, condominio con seguridad 24/7, cercano a colegios..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs resize-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Tus Datos de Contacto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.cl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-kaizen-dark text-white font-bold text-sm hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Enviando requerimiento...</span>
                ) : (
                  <span>Activar Mi Personal Shopper</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
