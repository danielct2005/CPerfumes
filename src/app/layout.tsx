import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'FRAGANZZA | Catálogo de Perfumes',
    template: '%s | FRAGANZZA',
  },
  description: 'Los mejores perfumes para ti. Catálogo de perfumes para hombre, mujer y unisex.',
  keywords: ['perfumes', 'fragancias', 'perfumería', 'colonia', 'FRAGANZZA'],
  authors: [{ name: 'FRAGANZZA' }],
  openGraph: {
    title: 'FRAGANZZA | Catálogo de Perfumes',
    description: 'Los mejores perfumes para ti',
    siteName: 'FRAGANZZA',
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
