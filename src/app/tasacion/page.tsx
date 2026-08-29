'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CHILE_COMMUNES } from '@/data/mockData';
import { useCurrency } from '@/context/CurrencyContext';
import {
  Sparkles,
  Building2,
  Home,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCLP, formatUF } from '@/lib/utils';

export default function TasacionPage() {
  const { formatPrice, ufValue } = useCurrency();

  const [step, setStep] = useState(1);
  const [region, setRegion] = useState<'metropolitana' | 'valparaiso'>('metropolitana');
  const [commune, setCommune] = useState('Las Condes');
  const [propertyType, setPropertyType] = useState<'departamento' | 'casa' | 'penthouse'>('departamento');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [surfaceM2, setSurfaceM2] = useState(110);
  const [condition, setCondition] = useState<'nueva' | 'excelente' | 'buena' | 'para_remodelar'>('excelente');
  const [parkings, setParkings] = useState(1);

  // Client info
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const availableCommunes =
    region === 'metropolitana' ? CHILE_COMMUNES.metropolitana : CHILE_COMMUNES.valparaiso;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      const res = await fetch('/api/valuations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          region,
          commune,
          propertyType,
          bedrooms,
          bathrooms,
          surfaceM2,
          condition,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStep(4);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-kaizen-gold" />
            <span>Algoritmo Inmobiliario Kaizen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
            Tasación Express & Valor de Mercado
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Obtén una estimación precisa del valor de tu propiedad en Santiago (RM) o la Costa de la V Región con datos de transacciones reales del Conservador de Bienes Raíces.
          </p>
        </div>

        {/* Stepper indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === s
                      ? 'bg-kaizen-dark text-white ring-4 ring-kaizen-gold/20'
                      : step > s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    step === s ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s === 1 ? 'Ubicación' : s === 2 ? 'Atributos' : 'Tus Datos'}
                </span>
                {s < 3 && <div className="w-8 h-0.5 bg-slate-200" />}
              </div>
            ))}
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-luxury">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Paso 1: ¿Dónde se ubica tu propiedad?
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Región
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegion('metropolitana');
                      setCommune('Las Condes');
                    }}
                    className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                      region === 'metropolitana'
                        ? 'border-kaizen-dark bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🏔️</span>
                    <span>Santiago (RM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegion('valparaiso');
                      setCommune('Concón');
                    }}
                    className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                      region === 'valparaiso'
                        ? 'border-kaizen-dark bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🌊</span>
                    <span>V Región Costa</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Comuna / Sector
                </label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                >
                  {availableCommunes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Inmueble
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'departamento', label: 'Departamento', icon: Building2 },
                    { id: 'casa', label: 'Casa', icon: Home },
                    { id: 'penthouse', label: 'Penthouse', icon: Sparkles },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPropertyType(t.id as any)}
                        className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                          propertyType === t.id
                            ? 'border-kaizen-gold bg-kaizen-gold/10 text-kaizen-dark'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-kaizen-gold" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-kaizen-dark text-white font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Continuar al Paso 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Paso 2: Dimensiones y Estado de Conservación
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Superficie Total Estimada (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={20}
                      max={10000}
                      value={surfaceM2}
                      onChange={(e) => setSurfaceM2(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                    <Maximize2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Estado de la Propiedad
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                  >
                    <option value="nueva">Nueva / A estrenar</option>
                    <option value="excelente">Excelente estado</option>
                    <option value="buena">Buen estado de conservación</option>
                    <option value="para_remodelar">Para remodelar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dormitorios
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} dorms.
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Baños
                  </label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} baños
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estacionamientos
                  </label>
                  <select
                    value={parkings}
                    onChange={(e) => setParkings(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} estac.
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-kaizen-dark text-white font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Continuar al Paso Final</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Paso 3: ¿A dónde te enviamos el informe detallado?
              </h2>

              <p className="text-xs text-slate-600">
                Ingresa tus datos para ver el rango de tasación en pantalla y recibir la carpeta con transacciones comparables en {commune}.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej. Martín Larraín"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 9876 5432"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="martin@dominio.cl"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-2/3 py-3.5 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-sm hover:bg-kaizen-gold-light transition flex items-center justify-center gap-2 shadow-gold disabled:opacity-50"
                >
                  {isCalculating ? (
                    <span>Calculando Tasación con IA...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Calcular Valor de Mercado</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 4 && result && (
            <div className="space-y-8 animate-scaleUp">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
                  Resultado de Tasación Referencial
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                  {commune} • {surfaceM2} m² ({propertyType.toUpperCase()})
                </h2>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-kaizen-gold/10 rounded-full filter blur-3xl" />
                <span className="text-xs text-slate-400 font-medium">Rango de Valor de Mercado Sugerido</span>
                <div className="text-3xl sm:text-5xl font-bold font-serif text-kaizen-gold-light my-3 tracking-tight">
                  {result.estimatedValueUFMin.toLocaleString('es-CL')} - {result.estimatedValueUFMax.toLocaleString('es-CL')} UF
                </div>
                <div className="text-sm sm:text-base text-slate-300 font-mono">
                  Promedio en Pesos: ~ {formatCLP(result.estimatedValueCLP)}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
                  <span>Valor UF m² promedio en {commune}: ~ {Math.round(result.estimatedValueUFMin / surfaceM2)} UF/m²</span>
                  <span>•</span>
                  <span>Conservación: {condition}</span>
                </div>
              </div>

              {/* Captación CTA */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-kaizen-gold" />
                  <span>¿Deseas una tasación presencial oficial y vender con Kaizen?</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Un broker especialista de Kaizen visitará tu propiedad sin costo, tomará fotografía profesional y la promocionará ante nuestra cartera activa de inversionistas en Santiago y la V Región.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`https://wa.me/56984561234?text=Hola%20Kaizen,%20acabo%20de%20tasar%20mi%20propiedad%20en%20${commune}%20(${result.estimatedValueUFMin}-${result.estimatedValueUFMax}%20UF)%20y%20deseo%20coordinar%20visita%20de%20captación.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hablar con Corredor Asignado por WhatsApp</span>
                  </Link>

                  <button
                    onClick={() => {
                      setStep(1);
                      setResult(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    Tasar Otra Propiedad
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
