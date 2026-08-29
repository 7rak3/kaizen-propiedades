import type { Metadata } from 'next';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComparisonDrawer } from '@/components/comparison/ComparisonDrawer';

export const metadata: Metadata = {
  title: 'Kaizen Propiedades | Corredora de Excelencia en Santiago & V Región',
  description:
    'Portal inmobiliario boutique especializado en propiedades de alta gama e inversiones rentables en Santiago (Sector Oriente) y la Costa de Valparaíso (Viña del Mar, Concón, Zapallar, Algarrobo). Metodología de mejora continua y asesoría legal integral.',
  keywords: [
    'Kaizen Propiedades',
    'corredora santiago oriente',
    'propiedades las condes',
    'departamentos concon costa de montemar',
    'casas zapallar maitencillo',
    'tasacion online chile',
    'inversion inmobiliaria cap rate chile',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-slate-900 bg-[#f8fafc]">
        <CurrencyProvider>
          <FavoritesProvider>
            <ComparisonProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ComparisonDrawer />
            </ComparisonProvider>
          </FavoritesProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
