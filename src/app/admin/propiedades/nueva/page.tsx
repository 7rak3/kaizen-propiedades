'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CHILE_COMMUNES, INITIAL_AGENTS, CURRENT_UF_CLP } from '@/data/mockData';
import {
  Building2,
  MapPin,
  DollarSign,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCLP } from '@/lib/utils';

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState(`KZ-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [operation, setOperation] = useState<'venta' | 'arriendo' | 'temporal'>('venta');
  const [propertyType, setPropertyType] = useState<any>('departamento');
  const [region, setRegion] = useState<'metropolitana' | 'valparaiso'>('metropolitana');
  const [city, setCity] = useState('Santiago');
  const [commune, setCommune] = useState('Las Condes');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [lat, setLat] = useState(-33.415);
  const [lng, setLng] = useState(-70.598);

  // Financials
  const [priceUF, setPriceUF] = useState<number>(12500);
  const [commonExpensesCLP, setCommonExpensesCLP] = useState<number>(250000);
  const [estimatedMonthlyRentCLP, setEstimatedMonthlyRentCLP] = useState<number>(1800000);

  // Specs
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [parkings, setParkings] = useState(2);
  const [storageRooms, setStorageRooms] = useState(1);
  const [usefulSurfaceM2, setUsefulSurfaceM2] = useState(120);
  const [totalSurfaceM2, setTotalSurfaceM2] = useState(140);
  const [terraceM2, setTerraceM2] = useState(20);
  const [yearBuilt, setYearBuilt] = useState(2022);
  const [orientation, setOrientation] = useState('Nor-Oriente');

  // Media
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('https://my.matterport.com/show/?m=sample360');
  const [videoUrl, setVideoUrl] = useState('');

  // Features
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Vista Despejada',
    'Piscina',
    'Quincho',
    'Termopanel',
    'Seguridad 24/7',
    'Pet Friendly',
  ]);
  const [newFeature, setNewFeature] = useState('');

  // Meta
  const [isFeatured, setIsFeatured] = useState(false);
  const [isInvestorOpportunity, setIsInvestorOpportunity] = useState(true);
  const [status, setStatus] = useState<any>('publicada');
  const [agentId, setAgentId] = useState(INITIAL_AGENTS[0].id);

  const availableCommunes =
    region === 'metropolitana' ? CHILE_COMMUNES.metropolitana : CHILE_COMMUNES.valparaiso;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !featuresList.includes(newFeature.trim())) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (f: string) => {
    setFeaturesList(featuresList.filter((item) => item !== f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newProperty = {
      id: `prop-${Date.now()}`,
      code,
      title,
      slug: slug || `prop-${Date.now()}`,
      description,
      operation,
      propertyType,
      region,
      city: region === 'metropolitana' ? 'Santiago' : commune,
      commune,
      address,
      neighborhood,
      lat: Number(lat),
      lng: Number(lng),
      priceUF: Number(priceUF),
      priceCLP: Number(priceUF) * CURRENT_UF_CLP,
      commonExpensesCLP: Number(commonExpensesCLP),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parkings: Number(parkings),
      storageRooms: Number(storageRooms),
      usefulSurfaceM2: Number(usefulSurfaceM2),
      totalSurfaceM2: Number(totalSurfaceM2),
      terraceM2: Number(terraceM2),
      yearBuilt: Number(yearBuilt),
      orientation,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'],
      virtualTourUrl,
      videoUrl,
      features: featuresList,
      isFeatured,
      isInvestorOpportunity,
      estimatedMonthlyRentCLP: Number(estimatedMonthlyRentCLP),
      status,
      agentId,
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });

      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push('/admin/propiedades');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/propiedades"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Editor Inmobiliario
          </span>
          <h1 className="text-2xl font-bold font-serif text-white">
            Publicar Nueva Propiedad
          </h1>
        </div>
      </div>

      {/* Form Wizard */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Información Básica */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kaizen-gold border-b border-slate-800 pb-3">
            1. Información General y Ubicación
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Código Propiedad
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-kaizen-gold font-bold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título Comercial de la Publicación
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Espectacular Departamento Vista al Mar en Costa de Montemar"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-kaizen-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operación
              </label>
              <select
                value={operation}
                onChange={(e: any) => setOperation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="venta">Venta</option>
                <option value="arriendo">Arriendo</option>
                <option value="temporal">Vacacional Costa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo Inmueble
              </label>
              <select
                value={propertyType}
                onChange={(e: any) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="penthouse">Penthouse</option>
                <option value="parcela">Parcela / Terreno</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Región
              </label>
              <select
                value={region}
                onChange={(e: any) => {
                  setRegion(e.target.value);
                  setCommune(e.target.value === 'metropolitana' ? 'Las Condes' : 'Concón');
                  setLat(e.target.value === 'metropolitana' ? -33.415 : -32.935);
                  setLng(e.target.value === 'metropolitana' ? -70.598 : -71.542);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="metropolitana">🏔️ Santiago (RM)</option>
                <option value="valparaiso">🌊 V Región Costa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Comuna
              </label>
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                {availableCommunes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dirección / Calle
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Av. Borgoño 24500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Barrio / Sector (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Costa de Montemar, El Golf, San Damián..."
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción Completa
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detalla terminaciones, vistas, distribución, conectividad..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 2: Valores y Finanzas */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kaizen-gold border-b border-slate-800 pb-3">
            2. Valores Financieros y Rentabilidad
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Precio en UF
              </label>
              <input
                type="number"
                required
                value={priceUF}
                onChange={(e) => setPriceUF(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-kaizen-gold-light outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono block mt-1">
                ~ {formatCLP(priceUF * CURRENT_UF_CLP)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gastos Comunes ($ CLP / mes)
              </label>
              <input
                type="number"
                value={commonExpensesCLP}
                onChange={(e) => setCommonExpensesCLP(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Arriendo Estimado ($ CLP para Cap Rate)
              </label>
              <input
                type="number"
                value={estimatedMonthlyRentCLP}
                onChange={(e) => setEstimatedMonthlyRentCLP(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Dimensiones y Atributos */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kaizen-gold border-b border-slate-800 pb-3">
            3. Dimensiones y Distribución
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dormitorios</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Baños</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estacionamientos</label>
              <input
                type="number"
                value={parkings}
                onChange={(e) => setParkings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bodegas</label>
              <input
                type="number"
                value={storageRooms}
                onChange={(e) => setStorageRooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sup. Útil (m²)</label>
              <input
                type="number"
                value={usefulSurfaceM2}
                onChange={(e) => setUsefulSurfaceM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sup. Total (m²)</label>
              <input
                type="number"
                value={totalSurfaceM2}
                onChange={(e) => setTotalSurfaceM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Terraza (m²)</label>
              <input
                type="number"
                value={terraceM2}
                onChange={(e) => setTerraceM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Orientación</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="Nor-Oriente">Nor-Oriente</option>
                <option value="Nor-Poniente">Nor-Poniente</option>
                <option value="Poniente">Poniente</option>
                <option value="Oriente">Oriente</option>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Galería de Fotos y 360 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kaizen-gold border-b border-slate-800 pb-3">
            4. Fotografías & Multimedia 360°
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Imágenes de la Galería ({images.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden group border border-slate-700">
                  <img src={img} alt="Foto" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-80 hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                      Portada
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Pega URL de imagen (Unsplash, Cloudinary, etc.)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
              >
                + Añadir Foto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Recorrido 360° (Matterport / Kuula)
              </label>
              <input
                type="text"
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Video Tour (YouTube / Vimeo)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Asignación y Publicación */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kaizen-gold border-b border-slate-800 pb-3">
            5. Asignación de Corredor & Estado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corredor Kaizen Asignado
              </label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-semibold"
              >
                {INITIAL_AGENTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estado de la Propiedad
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-semibold"
              >
                <option value="publicada">Publicada Inmediatamente</option>
                <option value="destacada">Publicada y Destacada</option>
                <option value="en_negociacion">En Negociación</option>
                <option value="borrador">Guardar como Borrador</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded accent-kaizen-gold"
                />
                <span>Marcar como Destacada en Portada</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInvestorOpportunity}
                  onChange={(e) => setIsInvestorOpportunity(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Oportunidad Inversionista (Cap Rate Badge)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/propiedades"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-sm hover:bg-kaizen-gold-light transition shadow-gold flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Publicando Propiedad...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar y Publicar en Kaizen</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
