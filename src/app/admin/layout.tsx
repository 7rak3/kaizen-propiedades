'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  Settings,
  LogOut,
  PlusCircle,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      label: 'Panel General',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Gestión Propiedades',
      href: '/admin/propiedades',
      icon: Building2,
      badge: '12',
    },
    {
      label: 'CRM Leads & Pipeline',
      href: '/admin/leads',
      icon: Users,
      badge: 'Nuevo',
    },
    {
      label: 'Agenda de Visitas',
      href: '/admin/visitas',
      icon: Calendar,
    },
    {
      label: 'Tasaciones Recibidas',
      href: '/admin/tasaciones',
      icon: Sparkles,
    },
  ];

  const isActive = (itemHref: string, exact: boolean = false) => {
    if (exact) return pathname === itemHref;
    return pathname.startsWith(itemHref);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-30">
        <Logo variant="dark" size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Logo variant="dark" size="sm" />
          </div>

          <div className="space-y-1">
            <Link
              href="/admin/propiedades/nueva"
              onClick={() => setSidebarOpen(false)}
              className="w-full mb-4 py-2.5 px-4 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-xs hover:bg-kaizen-gold-light transition shadow-gold flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Nueva Propiedad</span>
            </Link>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block pt-2 pb-1">
              Menú de Gestión
            </span>

            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-kaizen-dark text-kaizen-gold-light border border-kaizen-gold/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-kaizen-gold' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-kaizen-gold font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info & Portal Link */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-kaizen-gold text-slate-950 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-white">Admin Kaizen</div>
              <div className="text-[10px] text-emerald-400 font-semibold">● Sesión Activa</div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-between transition"
          >
            <span>Ver Portal Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
