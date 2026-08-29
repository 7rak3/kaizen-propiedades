'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Property, RegionType, OperationType } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MapWrapper } from '@/components/map/MapWrapper';
import { useCurrency } from '@/context/CurrencyContext';
import { CHILE_COMMUNES } from '@/data/mockData';
import {
  Search,
  MapPin,
  Building2,
  Home,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Compass,
  Calculator,
  Eye,
  CheckCircle,
  Clock,
  Waves,
  Mountain,
} from 'lucide-react';
import { formatNumber, formatCLP } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const { formatPrice, ufValue } = useCurrency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [activeTab, setActiveTab] = useState<OperationType>('venta');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [selectedCommune, setSelectedCommune] = useState<string>('todas');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [maxPriceUF, setMaxPriceUF] = useState<string>('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab) params.set('operation', activeTab);
    if (selectedRegion !== 'todas') params.set('region', selectedRegion);
    if (selectedCommune !== 'todas') params.set('commune', selectedCommune);
    if (selectedType !== 'todas') params.set('propertyType', selectedType);
    if (maxPriceUF) params.set('maxPrice', maxPriceUF);

    router.push(`/propiedades?${params.toString()}`);
  };

  const featuredProperties = properties.filter((p) => p.isFeatured).slice(0, 6);
  const rmProperties = properties.filter((p) => p.region === 'metropolitana').slice(0, 3);
  const valpoProperties = properties.filter((p) => p.region === 'valparaiso').slice(0, 3);
  const investorOpportunities = properties.filter((p) => p.isInvestorOpportunity).slice(0, 3);

  const availableCommunes =
    selectedRegion === 'metropolitana'
      ? CHILE_COMMUNES.metropolitana
      : selectedRegion === 'valparaiso'
      ? CHILE_COMMUNES.valparaiso
      : [...CHILE_COMMUNES.metropolitana, ...CHILE_COMMUNES.valparaiso];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-kaizen-dark text-white overflow-hidden">
        {/* Background Image with elegant gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="Propiedades de Lujo en Santiago y Costa de Valparaíso"
            className="w-full h-full object-cover object-center opacity-30 scale-105 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kaizen-dark via-kaizen-dark/70 to-kaizen-dark/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-kaizen-gold/30 text-xs font-semibold text-kaizen-gold-light mb-6 shadow-gold animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-kaizen-gold" />
            <span>Corredora Boutique de Alta Gama • Santiago & Costa de Valparaíso</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
            Excelencia y Perfección en Cada <span className="text-transparent bg-clip-text bg-gradient-to-r from-kaizen-gold-light via-kaizen-gold to-kaizen-gold-dark">Propiedad</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
            Descubre residencias excepcionales y oportunidades de inversión de alta rentabilidad en el Sector Oriente de Santiago y las costas más exclusivas de la V Región.
          </p>

          {/* SMART SEARCH CONTAINER */}
          <div className="w-full max-w-5xl bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/40 text-slate-900 animate-scaleUp">
            {/* Tabs (Venta, Arriendo, Vacacional) */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('venta')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'venta'
                    ? 'bg-kaizen-dark text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-kaizen-gold" />
                <span>Comprar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('arriendo')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'arriendo'
                    ? 'bg-kaizen-dark text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Arrendar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('temporal')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'temporal'
                    ? 'bg-kaizen-dark text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Waves className="w-4 h-4 text-emerald-400" />
                <span>Arriendo Vacacional Costa</span>
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end text-left">
              {/* Region */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Región
                </label>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedCommune('todas');
                    }}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                  >
                    <option value="todas">Todas las Regiones</option>
                    <option value="metropolitana">🏔️ Santiago (RM)</option>
                    <option value="valparaiso">🌊 V Región Costa</option>
                  </select>
                </div>
              </div>

              {/* Commune */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Comuna / Sector
                </label>
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                >
                  <option value="todas">Todas las comunas</option>
                  {availableCommunes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tipo de Inmueble
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                >
                  <option value="todas">Todos los tipos</option>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="parcela">Parcela / Sitio</option>
                  <option value="oficina">Oficina Comercial</option>
                </select>
              </div>

              {/* Max Price UF */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Precio Máx. (UF)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 20.000"
                  value={maxPriceUF}
                  onChange={(e) => setMaxPriceUF(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-kaizen-gold outline-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-4 h-4 text-kaizen-gold" />
                  <span>Buscar Propiedades</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. STATS TICKER & TRUST BAR */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                +168.000 <span className="text-kaizen-gold text-lg">UF</span>
              </span>
              <span className="text-xs text-slate-500 mt-1">Cartera de Inmuebles Activa</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                100%
              </span>
              <span className="text-xs text-slate-500 mt-1">Estudio de Títulos & Legal</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                6.8% <span className="text-emerald-500 text-sm">Cap Rate</span>
              </span>
              <span className="text-xs text-slate-500 mt-1">Rentabilidad Media en Inversiones</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                24/7
              </span>
              <span className="text-xs text-slate-500 mt-1">Soporte & Asignación de Broker</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL REGION SHOWCASE: SANTIAGO RM & V REGIÓN COSTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-kaizen-gold">
              Especialización Geográfica
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mt-1">
              Dos Polos Exclusivos de Inversión y Calidad de Vida
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Conocimiento hiperlocal en los sectores de mayor plusvalía de la Región Metropolitana y las costas más cotizadas de la V Región.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Santiago RM Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-luxury group bg-kaizen-dark text-white min-h-[380px] flex flex-col justify-end p-8">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Santiago RM Sector Oriente"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>Santiago • Sector Oriente</span>
                </div>
                <h3 className="text-2xl font-bold font-serif">
                  Las Condes, Vitacura, Lo Barnechea, Providencia y Chicureo
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Penthouses de lujo, residencias con parque privado y departamentos de vanguardia en los centros financieros y residenciales más consolidados de Chile.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/propiedades?region=metropolitana"
                    className="inline-flex items-center gap-2 text-xs font-bold text-kaizen-gold hover:text-white transition"
                  >
                    <span>Ver Propiedades en Santiago RM</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs font-mono text-slate-400">{rmProperties.length} destacadas</span>
                </div>
              </div>
            </div>

            {/* V Región Costa Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-luxury group bg-kaizen-dark text-white min-h-[380px] flex flex-col justify-end p-8">
              <img
                src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
                alt="Costa V Región Valparaíso"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
                  <Waves className="w-3.5 h-3.5" />
                  <span>Costa de Valparaíso</span>
                </div>
                <h3 className="text-2xl font-bold font-serif">
                  Concón, Reñaca, Viña del Mar, Zapallar, Maitencillo y Algarrobo
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Primera línea frente al mar, condominios con piscina infinita y villas de descanso con alto retorno en renta temporal vacacional y segunda vivienda.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/propiedades?region=valparaiso"
                    className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white transition"
                  >
                    <span>Ver Propiedades en la Costa</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs font-mono text-slate-400">{valpoProperties.length} destacadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-kaizen-gold">
                Colección Exclusiva
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
                Propiedades Destacadas de la Semana
              </h2>
            </div>

            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-kaizen-gold transition bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
            >
              <span>Explorar Todo el Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE MAP SECTION */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-kaizen-gold flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Exploración Geoespacial
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif mt-1">
                Mapa Interactivo RM & V Región
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Haz clic en los pines para ver precios actualizados en tiempo real y acceder a la ficha comercial.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Santiago RM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                V Región Costa
              </span>
            </div>
          </div>

          {/* Interactive Map Box */}
          <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <MapWrapper properties={properties} height="100%" />
          </div>
        </div>
      </section>

      {/* 6. CLEVER TOOLS: VALUATION & MORTGAGE & INVESTOR RADAR */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-kaizen-gold">
              Herramientas Inteligentes Kaizen
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mt-1">
              Tecnología y Análisis Financiero para tus Decisiones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: Valora tu Propiedad */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-luxury transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Tasación Express Online
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Calcula el rango de valor de mercado en UF y CLP de tu departamento o casa en Las Condes, Concón, Zapallar o Providencia según valores m² vigentes.
                </p>
              </div>
              <Link
                href="/tasacion"
                className="w-full py-2.5 text-center rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-kaizen-gold hover:text-slate-950 transition"
              >
                Tasar mi Propiedad Gratis
              </Link>
            </div>

            {/* Tool 2: Simulador Hipotecario */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-luxury transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-200">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Simulador de Crédito & Gastos
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Calcula dividendo mensual estimado y el desglose exacto de gastos operacionales (tasación, estudio de títulos, timbres y conservador CBR en Chile).
                </p>
              </div>
              <Link
                href="/propiedades"
                className="w-full py-2.5 text-center rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Simular en Fichas de Propiedad
              </Link>
            </div>

            {/* Tool 3: Personal Shopper */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-luxury transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Personal Shopper Inmobiliario
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  ¿Buscas una propiedad con características muy específicas o fuera de mercado? Nuestro equipo busca y negocia por ti sin costo extra.
                </p>
              </div>
              <Link
                href="/personal-shopper"
                className="w-full py-2.5 text-center rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-emerald-600 transition"
              >
                Activar Personal Shopper
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. KAIZEN METHODOLOGY */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-kaizen-gold">
                Nuestra Filosofía
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">
                El Estándar Kaizen: Rigor, Transparencia y Mejora Continua
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                En el mercado inmobiliario tradicional, las transacciones suelen ser lentas e inciertas. En Kaizen Propiedades aplicamos principios de eficiencia japonesa para que comprar, vender o arrendar sea una experiencia predecible, ágil y rentable.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-kaizen-gold/10 text-kaizen-gold-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Auditoría Legal Preventiva</h4>
                    <p className="text-xs text-slate-500">Revisamos dominio, gravámenes, hipotecas y roles antes de publicar para garantizar cierres sin tropiezos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-kaizen-gold/10 text-kaizen-gold-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Producción Audiovisual de Alto Impacto</h4>
                    <p className="text-xs text-slate-500">Fotografía de arquitectura, recorridos virtuales 360° y tomas aéreas con dron profesional.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-kaizen-gold/10 text-kaizen-gold-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Tiempos de Cierre Optimizados</h4>
                    <p className="text-xs text-slate-500">Reducción del tiempo promedio de venta en un 40% gracias a nuestra base de inversionistas precalificados.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Interiorismo y arquitectura de alto nivel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
                <div className="flex items-center gap-2 text-kaizen-gold font-bold text-sm mb-1">
                  <Award className="w-4 h-4" />
                  <span>Brokerage Certificado</span>
                </div>
                <p className="text-xs text-slate-600">
                  Miembros de la red de corretaje de propiedades más exigente del país.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA CAPTACIÓN */}
      <section className="bg-kaizen-dark text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif mb-4">
            ¿Deseas Vender o Arrendar tu Propiedad con Kaizen?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8">
            Te asignamos un corredor especialista en tu sector, tasamos tu propiedad y diseñamos la estrategia comercial de más alto retorno.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/publicar"
              className="px-6 py-3 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-sm hover:bg-kaizen-gold-light transition shadow-gold"
            >
              Publicar Mi Propiedad
            </Link>
            <Link
              href="/tasacion"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition"
            >
              Calcular Tasación Express
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
