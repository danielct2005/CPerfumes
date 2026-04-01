import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'CPerfumes | Catálogo de Perfumes Premium',
    template: '%s | CPerfumes',
  },
  description: 'Colección exclusiva de fragancias premium. Los mejores perfumes para hombre, mujer y unisex en CPerfumes.',
  keywords: ['perfumes', 'fragancias', 'perfumería', 'colonia', 'CPerfumes'],
  authors: [{ name: 'CPerfumes' }],
  openGraph: {
    title: 'CPerfumes | Catálogo de Perfumes Premium',
    description: 'Colección exclusiva de fragancias premium',
    siteName: 'CPerfumes',
    locale: 'es_CL',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
