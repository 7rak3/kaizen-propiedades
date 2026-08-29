'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useCurrency } from '@/context/CurrencyContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import {
  Heart,
  Scale,
  Phone,
  Menu,
  X,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Search,
} from 'lucide-react';
import { formatCLP } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { currency, toggleCurrency, ufValue } = useCurrency();
  const { favoritesCount } = useFavorites();
  const { compareList, setIsDrawerOpen } = useComparison();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar Ticker: UF, Regiones, Hotline */}
      <div className="bg-kaizen-dark text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">UF Hoy:</span>
              <span className="text-kaizen-gold-light font-mono font-medium">{formatCLP(ufValue)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3 h-3 text-kaizen-gold" />
              <span>Santiago Oriente • Viña del Mar • Concón • Zapallar</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Switcher */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[11px] border border-slate-700 transition"
              title="Cambiar moneda de visualización"
            >
              <span className="text-slate-400">Moneda:</span>
              <span className={currency === 'UF' ? 'font-bold text-kaizen-gold-light' : 'text-slate-400'}>UF</span>
              <span className="text-slate-500">/</span>
              <span className={currency === 'CLP' ? 'font-bold text-kaizen-gold-light' : 'text-slate-400'}>CLP</span>
            </button>

            <a
              href="https://wa.me/56984561234?text=Hola%20Kaizen%20Propiedades,%20deseo%20asesoría%20inmobiliaria"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition text-[11px] font-medium"
            >
              <Phone className="w-3 h-3" />
              <span>+56 9 8456 1234</span>
            </a>

            <Link
              href="/admin"
              className={`text-[11px] px-2 py-0.5 rounded font-medium transition ${
                isAdmin
                  ? 'bg-kaizen-gold text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {isAdmin ? '● Panel Admin' : 'Acceso Corredor'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo variant="light" size="md" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <Link
              href="/propiedades?operation=venta"
              className={`hover:text-kaizen-gold transition ${
                pathname === '/propiedades' && !pathname.includes('arriendo') ? 'text-kaizen-gold font-semibold' : ''
              }`}
            >
              Ventas
            </Link>
            <Link
              href="/propiedades?operation=arriendo"
              className="hover:text-kaizen-gold transition"
            >
              Arriendos
            </Link>
            <Link
              href="/propiedades?region=metropolitana"
              className="hover:text-kaizen-gold transition flex items-center gap-1"
            >
              <span>Santiago RM</span>
            </Link>
            <Link
              href="/propiedades?region=valparaiso"
              className="hover:text-kaizen-gold transition flex items-center gap-1 text-slate-800"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>V Región Costa</span>
            </Link>
            <Link
              href="/tasacion"
              className="hover:text-kaizen-gold transition flex items-center gap-1.5 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-kaizen-gold" />
              <span>Valora tu Propiedad</span>
            </Link>
            <Link
              href="/nosotros"
              className="hover:text-kaizen-gold transition"
            >
              Nosotros
            </Link>
          </div>

          {/* Action Icons & CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Comparison Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-kaizen-gold hover:bg-slate-50 rounded-full transition"
              title="Comparar propiedades"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-kaizen-gold text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <Link
              href="/favoritos"
              className="relative p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition"
              title="Mis Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Publicar Propiedad / Contacto CTA */}
            <Link
              href="/publicar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-kaizen-dark text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm hover:shadow"
            >
              <Building2 className="w-3.5 h-3.5 text-kaizen-gold" />
              <span>Publica con Kaizen</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-slate-700"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute 0 right-0 bg-kaizen-gold text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>
            <Link href="/favoritos" className="relative p-2 text-slate-700">
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute 0 right-0 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Abrir menú móvil"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <Link
              href="/propiedades?operation=venta"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Propiedades en Venta
            </Link>
            <Link
              href="/propiedades?operation=arriendo"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Propiedades en Arriendo
            </Link>
            <Link
              href="/propiedades?region=metropolitana"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Santiago / Región Metropolitana
            </Link>
            <Link
              href="/propiedades?region=valparaiso"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              V Región (Viña, Concón, Zapallar)
            </Link>
            <Link
              href="/tasacion"
              className="block py-2 text-base font-semibold text-amber-700 bg-amber-50 rounded-lg px-3"
            >
              ✨ Valora tu Propiedad (Tasador Express)
            </Link>
            <Link
              href="/publicar"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Publica con Nosotros
            </Link>
            <Link
              href="/personal-shopper"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Buscamos por ti (Personal Shopper)
            </Link>
            <Link
              href="/nosotros"
              className="block py-2 text-base font-medium text-slate-800 border-b border-slate-100"
            >
              Sobre Kaizen Propiedades
            </Link>
            <Link
              href="/contacto"
              className="block py-2 text-base font-medium text-slate-800"
            >
              Contacto & Oficinas
            </Link>

            <div className="pt-2">
              <Link
                href="/admin"
                className="block w-full text-center py-2.5 px-4 rounded-lg bg-kaizen-dark text-white font-medium text-sm"
              >
                Ingreso Corredores (Dashboard)
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
