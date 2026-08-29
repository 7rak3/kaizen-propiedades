'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, RegionType, OperationType, PropertyType } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MapWrapper } from '@/components/map/MapWrapper';
import { useCurrency } from '@/context/CurrencyContext';
import { CHILE_COMMUNES } from '@/data/mockData';
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  Map as MapIcon,
  Columns,
  RotateCcw,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

function PropiedadesContent() {
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [operation, setOperation] = useState<string>(searchParams.get('operation') || 'todas');
  const [region, setRegion] = useState<string>(searchParams.get('region') || 'todas');
  const [commune, setCommune] = useState<string>(searchParams.get('commune') || 'todas');
  const [propertyType, setPropertyType] = useState<string>(searchParams.get('propertyType') || 'todas');
  const [minPriceUF, setMinPriceUF] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPriceUF, setMaxPriceUF] = useState<string>(searchParams.get('maxPrice') || '');
  const [minBedrooms, setMinBedrooms] = useState<string>(searchParams.get('bedrooms') || 'todas');
  const [onlyInvestors, setOnlyInvestors] = useState<boolean>(searchParams.get('investor') === 'true');
  const [selectedFeature, setSelectedFeature] = useState<string>('todas');

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'recientes' | 'precio_asc' | 'precio_desc' | 'm2_desc' | 'cap_rate'>('recientes');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

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

  const availableCommunes = useMemo(() => {
    if (region === 'metropolitana') return CHILE_COMMUNES.metropolitana;
    if (region === 'valparaiso') return CHILE_COMMUNES.valparaiso;
    return [...CHILE_COMMUNES.metropolitana, ...CHILE_COMMUNES.valparaiso];
  }, [region]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.commune.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }

    if (operation !== 'todas') {
      result = result.filter((p) => p.operation === operation);
    }

    if (region !== 'todas') {
      result = result.filter((p) => p.region === region);
    }

    if (commune !== 'todas') {
      result = result.filter((p) => p.commune.toLowerCase().includes(commune.toLowerCase()));
    }

    if (propertyType !== 'todas') {
      result = result.filter((p) => p.propertyType === propertyType);
    }

    if (minPriceUF) {
      const min = parseFloat(minPriceUF);
      if (!isNaN(min)) result = result.filter((p) => p.priceUF >= min);
    }

    if (maxPriceUF) {
      const max = parseFloat(maxPriceUF);
      if (!isNaN(max)) result = result.filter((p) => p.priceUF <= max);
    }

    if (minBedrooms !== 'todas') {
      const beds = parseInt(minBedrooms, 10);
      if (!isNaN(beds)) result = result.filter((p) => p.bedrooms >= beds);
    }

    if (onlyInvestors) {
      result = result.filter((p) => p.isInvestorOpportunity);
    }

    if (selectedFeature !== 'todas') {
      result = result.filter((p) => p.features?.some((f) => f.toLowerCase().includes(selectedFeature.toLowerCase())));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'precio_asc') return a.priceUF - b.priceUF;
      if (sortBy === 'precio_desc') return b.priceUF - a.priceUF;
      if (sortBy === 'm2_desc') return (b.totalSurfaceM2 || 0) - (a.totalSurfaceM2 || 0);
      if (sortBy === 'cap_rate') {
        const capA = a.estimatedMonthlyRentCLP ? (a.estimatedMonthlyRentCLP * 12) / (a.priceUF * 37850) : 0;
        const capB = b.estimatedMonthlyRentCLP ? (b.estimatedMonthlyRentCLP * 12) / (b.priceUF * 37850) : 0;
        return capB - capA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [
    properties,
    searchQuery,
    operation,
    region,
    commune,
    propertyType,
    minPriceUF,
    maxPriceUF,
    minBedrooms,
    onlyInvestors,
    selectedFeature,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setOperation('todas');
    setRegion('todas');
    setCommune('todas');
    setPropertyType('todas');
    setMinPriceUF('');
    setMaxPriceUF('');
    setMinBedrooms('todas');
    setOnlyInvestors(false);
    setSelectedFeature('todas');
  };

  const hasActiveFilters =
    searchQuery ||
    operation !== 'todas' ||
    region !== 'todas' ||
    commune !== 'todas' ||
    propertyType !== 'todas' ||
    minPriceUF ||
    maxPriceUF ||
    minBedrooms !== 'todas' ||
    onlyInvestors ||
    selectedFeature !== 'todas';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & View Toggle Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Propiedades Disponibles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mostrando <strong className="text-slate-900">{filteredProperties.length}</strong> propiedades en Santiago RM y V Región Costa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-kaizen-gold"
            >
              <option value="recientes">Más Recientes</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="m2_desc">Mayor Superficie (m²)</option>
              <option value="cap_rate">Mayor Rentabilidad (Cap Rate)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-kaizen-dark text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Vista Cuadrícula"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Grilla</span>
              </button>

              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'split'
                    ? 'bg-kaizen-dark text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Vista Dividida con Mapa"
              >
                <Columns className="w-4 h-4" />
                <span>Mapa Split</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'map'
                    ? 'bg-kaizen-dark text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Solo Mapa"
              >
                <MapIcon className="w-4 h-4" />
                <span>Mapa</span>
              </button>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl bg-kaizen-dark text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* FILTERS PANEL */}
        <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-8 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Búsqueda Rápida
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej: Penthouse El Golf, Concón, Reñaca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Operation */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Operación
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold outline-none"
              >
                <option value="todas">Todas</option>
                <option value="venta">Venta</option>
                <option value="arriendo">Arriendo</option>
                <option value="temporal">Vacacional Costa</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Región
              </label>
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCommune('todas');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold outline-none"
              >
                <option value="todas">Todas</option>
                <option value="metropolitana">Santiago (RM)</option>
                <option value="valparaiso">V Región Costa</option>
              </select>
            </div>

            {/* Commune */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Comuna
              </label>
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold outline-none"
              >
                <option value="todas">Todas</option>
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
                Tipo
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold outline-none"
              >
                <option value="todas">Todos</option>
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="penthouse">Penthouse</option>
                <option value="parcela">Parcela</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Dormitorios:</span>
                {['todas', '1', '2', '3', '4'].map((bed) => (
                  <button
                    key={bed}
                    onClick={() => setMinBedrooms(bed)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                      minBedrooms === bed
                        ? 'bg-kaizen-dark text-white border-kaizen-dark'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {bed === 'todas' ? 'Todos' : `${bed}+`}
                  </button>
                ))}
              </div>

              {/* Inversionista checkbox pill */}
              <button
                onClick={() => setOnlyInvestors(!onlyInvestors)}
                className={`px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  onlyInvestors
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Oportunidades Inversión</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar Filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* RESULTS SECTION ACCORDING TO VIEW MODE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl shadow-card animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-slate-800">
              No encontramos propiedades con estos filtros
            </h3>
            <p className="text-xs text-slate-500">
              Prueba modificando la comuna, rango de precio o eliminando algunos filtros aplicados.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-kaizen-dark text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : viewMode === 'split' ? (
          /* SPLIT VIEW: LIST (50%) + MAP (50%) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List side */}
            <div className="lg:col-span-6 space-y-4 max-h-[85vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onMouseEnter={() => setSelectedMapProperty(prop)}
                    className="cursor-pointer"
                  >
                    <PropertyCard property={prop} />
                  </div>
                ))}
              </div>
            </div>

            {/* Map side */}
            <div className="lg:col-span-6 sticky top-24 h-[80vh] rounded-2xl overflow-hidden shadow-luxury border border-slate-200">
              <MapWrapper
                properties={filteredProperties}
                selectedProperty={selectedMapProperty}
                height="100%"
              />
            </div>
          </div>
        ) : (
          /* MAP ONLY VIEW */
          <div className="h-[75vh] w-full rounded-2xl overflow-hidden shadow-luxury border border-slate-200">
            <MapWrapper properties={filteredProperties} height="100%" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-kaizen-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PropiedadesContent />
    </Suspense>
  );
}
