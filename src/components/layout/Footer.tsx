import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-kaizen-dark text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Corredora boutique de excelencia inmobiliaria. Especialistas en propiedades residenciales de alta gama e inversiones estratégicas en el <strong className="text-white">Sector Oriente de Santiago</strong> y la <strong className="text-white">Costa de la V Región de Valparaíso</strong>.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-kaizen-gold bg-kaizen-gold/10 px-2.5 py-1 rounded border border-kaizen-gold/20">
                <Award className="w-3.5 h-3.5" /> Metodología Japonesa Kaizen
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Asesoría Legal Certificada
              </span>
            </div>
          </div>

          {/* Sectores RM */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Santiago RM
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/propiedades?region=metropolitana&commune=Las+Condes" className="hover:text-kaizen-gold transition">
                  Las Condes / El Golf
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=metropolitana&commune=Vitacura" className="hover:text-kaizen-gold transition">
                  Vitacura / Santa María
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=metropolitana&commune=Lo+Barnechea" className="hover:text-kaizen-gold transition">
                  Lo Barnechea / La Dehesa
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=metropolitana&commune=Providencia" className="hover:text-kaizen-gold transition">
                  Providencia / Barrio Italia
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=metropolitana&commune=Chicureo" className="hover:text-kaizen-gold transition">
                  Chicureo / Piedra Roja
                </Link>
              </li>
            </ul>
          </div>

          {/* Sectores V Región */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              V Región Costa
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/propiedades?region=valparaiso&commune=Concon" className="hover:text-kaizen-gold transition">
                  Concón / Costa de Montemar
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=valparaiso&commune=Renaca" className="hover:text-kaizen-gold transition">
                  Reñaca / Los Almendros
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=valparaiso&commune=Zapallar" className="hover:text-kaizen-gold transition">
                  Zapallar / Cachagua
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=valparaiso&commune=Maitencillo" className="hover:text-kaizen-gold transition">
                  Maitencillo / Marbella
                </Link>
              </li>
              <li>
                <Link href="/propiedades?region=valparaiso&commune=Algarrobo" className="hover:text-kaizen-gold transition">
                  Algarrobo / Mirasol
                </Link>
              </li>
            </ul>
          </div>

          {/* Oficinas & Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contacto Directo
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-kaizen-gold flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Casa Matriz RM:</strong> Isidora Goyenechea 3000, Piso 18, Las Condes.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Oficina Costa:</strong> Av. Borgoño 25000, Concón.
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+56984561234" className="hover:text-white transition">
                  +56 9 8456 1234
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href="mailto:contacto@kaizenpropiedades.cl" className="hover:text-white transition">
                  contacto@kaizenpropiedades.cl
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Kaizen Propiedades SpA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/nosotros" className="hover:text-slate-200 transition">
              Metodología Kaizen
            </Link>
            <Link href="/tasacion" className="hover:text-slate-200 transition">
              Tasación Online
            </Link>
            <Link href="/admin" className="hover:text-kaizen-gold transition">
              Portal Corredores
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
