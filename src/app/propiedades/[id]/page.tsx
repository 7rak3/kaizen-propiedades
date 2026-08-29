'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Property, Agent } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import { MapWrapper } from '@/components/map/MapWrapper';
import { VisitModal } from '@/components/booking/VisitModal';
import { PropertyCard } from '@/components/property/PropertyCard';
import {
  Heart,
  Scale,
  Share2,
  Printer,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Compass,
  Calendar,
  Building,
  CheckCircle2,
  Calculator,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Eye,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  DollarSign,
  Info,
} from 'lucide-react';
import {
  formatCLP,
  formatUF,
  calculateMortgage,
  calculateCapRate,
  generateWhatsAppLink,
} from '@/lib/utils';
import { INITIAL_AGENTS } from '@/data/mockData';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const { formatPrice, currency, ufValue } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare } = useComparison();

  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageYears, setMortgageYears] = useState(25);
  const [interestRate, setInterestRate] = useState(4.8);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);

          // Fetch related properties
          const allRes = await fetch(`/api/properties?region=${data.region}`);
          if (allRes.ok) {
            const all = await allRes.json();
            setRelatedProperties(all.filter((p: Property) => p.id !== data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchPropertyData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kaizen-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">
          Propiedad no encontrada
        </h2>
        <p className="text-slate-600 mb-6 text-sm">
          El código o slug solicitado no existe o fue despublicado.
        </p>
        <Link
          href="/propiedades"
          className="px-6 py-3 rounded-xl bg-kaizen-dark text-white text-xs font-bold"
        >
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const assignedAgent =
    INITIAL_AGENTS.find((a) => a.id === property.agentId) || INITIAL_AGENTS[0];

  const mortgage = calculateMortgage(
    property.priceUF,
    downPaymentPercent,
    mortgageYears,
    interestRate,
    ufValue
  );

  const capRate =
    property.estimatedMonthlyRentCLP && property.operation === 'venta'
      ? calculateCapRate(property.priceUF, property.estimatedMonthlyRentCLP, ufValue)
      : null;

  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const whatsAppMsg = `Hola ${assignedAgent.name}, me interesa la propiedad [${property.code}] "${property.title}" en ${property.commune} (${formatPrice(property.priceUF)}). Deseo coordinar una consulta.`;
  const whatsAppLink = generateWhatsAppLink(assignedAgent.whatsapp, whatsAppMsg);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Descubre esta propiedad en Kaizen Propiedades: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de la propiedad copiado al portapapeles!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      {/* Printable Sheet Branding (Only visible on print) */}
      <div className="hidden print-only mb-6 p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-serif">KAIZEN PROPIEDADES</h1>
          <span className="text-xs">Ficha Comercial Oficial • {property.code}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-500 no-print">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-kaizen-gold transition">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-kaizen-gold transition">
              Propiedades
            </Link>
            <span>/</span>
            <Link
              href={`/propiedades?region=${property.region}`}
              className="hover:text-kaizen-gold transition uppercase font-semibold"
            >
              {property.region === 'valparaiso' ? 'V Región Costa' : 'Santiago RM'}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-xs">{property.commune}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Brochure */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 font-semibold"
              title="Descargar Ficha PDF Comercial"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Compartir</span>
            </button>

            {/* Compare */}
            <button
              onClick={() => addToCompare(property)}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                inCompare
                  ? 'bg-kaizen-gold text-slate-950 border-kaizen-gold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{inCompare ? 'En Comparación' : 'Comparar'}</span>
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-lg border transition ${
                favorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Guardar en favoritos"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-kaizen-dark text-white font-mono text-xs font-bold">
              {property.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-kaizen-gold/20 text-amber-900 border border-kaizen-gold/30 text-xs font-bold uppercase">
              {property.operation}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-900 text-xs font-bold">
              {property.region === 'valparaiso' ? '🌊 Costa V Región' : '🏔️ Santiago RM'}
            </span>
            {property.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-xs font-bold">
                ★ Destacada
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            <MapPin className="w-4 h-4 text-kaizen-gold flex-shrink-0" />
            <span>
              {property.address} • {property.commune}, {property.city}
              {property.neighborhood ? ` (${property.neighborhood})` : ''}
            </span>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-luxury">
            {/* Big Main Image */}
            <div
              className="md:col-span-2 aspect-[4/3] relative cursor-pointer group bg-slate-900"
              onClick={() => {
                setActiveImageIndex(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Sub images grid */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {property.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] relative cursor-pointer group bg-slate-900 overflow-hidden"
                  onClick={() => {
                    setActiveImageIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`${property.title} foto ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {idx === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                      +{property.images.length - 5} fotos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (LEFT CONTENT 70% / RIGHT SIDEBAR 30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-10">
            {/* SPECS GRID */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-kaizen-gold mb-4">
                Características Principales
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Dormitorios</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Bed className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.bedrooms}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Baños</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Bath className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.bathrooms}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Superficie Total</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Maximize2 className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.totalSurfaceM2} m²</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Superficie Útil</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Maximize2 className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.usefulSurfaceM2} m²</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Estacionamientos</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Car className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.parkings}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Bodegas</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Building className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.storageRooms}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Orientación</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Compass className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.orientation || 'N/A'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">Año Construcción</span>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 mt-1">
                    <Calendar className="w-4 h-4 text-kaizen-gold" />
                    <span>{property.yearBuilt || '2021'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-4">
                Descripción de la Propiedad
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* AMENITIES & FEATURES */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-4">
                Equipamiento y Terminaciones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 360 VIRTUAL TOUR SIMULATION */}
            {property.virtualTourUrl && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-kaizen-gold">
                    <Video className="w-5 h-5" />
                    <h3 className="text-lg font-bold font-serif text-white">
                      Recorrido Virtual 360° Interactivo
                    </h3>
                  </div>
                  <span className="text-xs bg-kaizen-gold/20 text-kaizen-gold px-2.5 py-1 rounded-full border border-kaizen-gold/30">
                    Matterport 3D Ready
                  </span>
                </div>
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-800 relative flex items-center justify-center">
                  <img
                    src={property.images[0]}
                    alt="Tour 360"
                    className="w-full h-full object-cover opacity-60 filter blur-xs"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 animate-pulse cursor-pointer">
                      <Eye className="w-8 h-8 text-kaizen-gold-light" />
                    </div>
                    <h4 className="text-base font-bold">Vista Inmersiva 360° Disponible</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Explora cada rincón de esta propiedad en alta definición desde tu computador o dispositivo móvil.
                    </p>
                    <button
                      onClick={() => setIsVisitModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-xs hover:bg-kaizen-gold-light transition shadow-gold"
                    >
                      Solicitar Tour Guiado por Videollamada
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CLEVER TOOL: MORTGAGE CALCULATOR WITH CHILEAN EXPENSES */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <Calculator className="w-5 h-5 text-kaizen-gold" />
                  <h3 className="text-lg font-bold font-serif">
                    Simulador Hipotecario & Gastos Operacionales
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  UF = {formatCLP(ufValue)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Down Payment Pie % */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Pie Inicial ({downPaymentPercent}%)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[10, 15, 20, 30].map((p) => (
                      <button
                        key={p}
                        onClick={() => setDownPaymentPercent(p)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          downPaymentPercent === p
                            ? 'bg-kaizen-dark text-white border-kaizen-dark'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Monto Pie: {formatUF(mortgage.downPaymentUF)} ({formatCLP(mortgage.downPaymentCLP)})
                  </span>
                </div>

                {/* Years Plazo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Plazo: {mortgageYears} Años
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    step="5"
                    value={mortgageYears}
                    onChange={(e) => setMortgageYears(Number(e.target.value))}
                    className="w-full accent-kaizen-gold mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>15 años</span>
                    <span>20 años</span>
                    <span>25 años</span>
                    <span>30 años</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tasa Anual Estimada: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="3.5"
                    max="6.5"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-kaizen-gold mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>3.5%</span>
                    <span>5.0%</span>
                    <span>6.5%</span>
                  </div>
                </div>
              </div>

              {/* Mortgage Results Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Dividendo Mensual Estimado</span>
                  <div className="text-2xl font-bold font-serif text-kaizen-gold-light mt-0.5">
                    {formatCLP(mortgage.monthlyDividendCLP)}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    ~ {formatUF(mortgage.monthlyDividendUF)} / mes
                  </span>
                </div>

                <div className="sm:border-l sm:border-slate-800 sm:pl-4">
                  <span className="text-xs text-slate-400 font-medium">Renta Líquida Sugerida</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {formatCLP(mortgage.requiredMonthlyIncomeCLP)}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    (Dividendo representa ~25% de los ingresos)
                  </span>
                </div>
              </div>

              {/* Chilean Operational Expenses breakdown */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-kaizen-gold" />
                  Desglose Estimado de Gastos Operacionales (Chile)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Tasación Bancaria</span>
                    <strong className="text-slate-900">{formatCLP(mortgage.operationalExpenses.appraisalCLP)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Estudio de Títulos</span>
                    <strong className="text-slate-900">{formatCLP(mortgage.operationalExpenses.titleStudyCLP)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Timbres y Estampillas (0.8%)</span>
                    <strong className="text-slate-900">{formatCLP(mortgage.operationalExpenses.stampTaxCLP)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Notaría y Conservador CBR</span>
                    <strong className="text-slate-900">{formatCLP(mortgage.operationalExpenses.notaryCLP)}</strong>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-slate-600 font-semibold">
                  Total Gastos Operacionales aprox:{' '}
                  <span className="text-slate-900 font-bold">{formatCLP(mortgage.operationalExpenses.totalOperationalCLP)}</span>
                </div>
              </div>
            </div>

            {/* RADAR INVERSIONISTA / CAP RATE (If applicable) */}
            {capRate && (
              <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-6 sm:p-8 border border-emerald-800/60 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold font-serif text-white">
                      Análisis para Inversionistas • Cap Rate
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    Rating: {capRate.rating}
                  </span>
                </div>

                <p className="text-xs text-emerald-200 leading-relaxed mb-6">
                  Cálculo basado en el valor de arriendo estimado de mercado en la zona para este tipo de inmueble.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700/40">
                    <span className="text-xs text-emerald-300 block">Cap Rate Bruto Anual</span>
                    <div className="text-2xl font-bold font-serif text-white mt-1">
                      {capRate.capRatePercent}%
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700/40">
                    <span className="text-xs text-emerald-300 block">Arriendo Mensual Est.</span>
                    <div className="text-xl font-bold font-serif text-white mt-1">
                      {formatCLP(property.estimatedMonthlyRentCLP || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700/40">
                    <span className="text-xs text-emerald-300 block">Ingreso Anual Proyectado</span>
                    <div className="text-xl font-bold font-serif text-white mt-1">
                      {formatCLP(capRate.annualRentCLP)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOCATION MAP */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                Ubicación y Entorno
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {property.address}, {property.commune}
              </p>
              <div className="h-80 rounded-xl overflow-hidden border border-slate-200">
                <MapWrapper
                  properties={[property]}
                  center={[property.lat, property.lng]}
                  zoom={15}
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING CONTACT & AGENT CARD */}
          <div className="lg:col-span-4 sticky top-24 space-y-6 no-print">
            {/* Price Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-luxury">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Precio de Publicación
              </span>
              <div className="text-3xl font-bold font-serif text-slate-950 tracking-tight">
                {formatPrice(property.priceUF)}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-1">
                {currency === 'UF'
                  ? `Equivalente aprox: ${formatCLP(property.priceUF * ufValue)}`
                  : `Equivalente en UF: ${formatUF(property.priceUF)}`}
              </div>

              {property.commonExpensesCLP > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Gastos Comunes:</span>
                  <strong className="text-slate-900">{formatCLP(property.commonExpensesCLP)} / mes</strong>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-kaizen-gold" />
                  <span>Agendar Visita (Presencial / 360°)</span>
                </button>

                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Agent Profile Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <span className="text-[11px] font-bold uppercase tracking-wider text-kaizen-gold block mb-4">
                Corredor Kaizen Asignado
              </span>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={assignedAgent.avatar}
                  alt={assignedAgent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-kaizen-gold"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{assignedAgent.name}</h4>
                  <p className="text-xs text-slate-500">{assignedAgent.role}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    {assignedAgent.experienceYears} años de experiencia
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {assignedAgent.bio}
              </p>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-kaizen-gold" />
                  <a href={`tel:${assignedAgent.phone}`} className="hover:underline">
                    {assignedAgent.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-kaizen-gold" />
                  <a href={`mailto:${assignedAgent.email}`} className="hover:underline truncate">
                    {assignedAgent.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Kaizen Guarantee Badge */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-kaizen-gold" />
                <span>Garantía de Excelencia Kaizen</span>
              </div>
              <p className="text-[11px] leading-normal">
                Propiedad verificada legalmente. Acompañamiento en promesa de compraventa, estudio de títulos y escritura final.
              </p>
            </div>
          </div>
        </div>

        {/* RELATED PROPERTIES */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 no-print">
            <h3 className="text-2xl font-bold font-serif text-slate-900 mb-6">
              Otras Propiedades Similares en la Zona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setActiveImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={property.images[activeImageIndex]}
              alt={property.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
            <span className="text-white text-xs mt-3 font-mono">
              Foto {activeImageIndex + 1} de {property.images.length}
            </span>
          </div>
        </div>
      )}

      {/* Booking Visit Modal */}
      <VisitModal
        property={property}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </div>
  );
}
