import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Mafe Store | Tu Tienda de Perfumes',
    template: '%s | Mafe Store',
  },
  description: 'Los mejores perfumes para ti. Perfumes para hombre, mujer y unisex en Mafe Store.',
  keywords: ['perfumes', 'fragancias', 'perfumería', 'colonia', 'Mafe Store'],
  authors: [{ name: 'Mafe Store' }],
  openGraph: {
    title: 'Mafe Store | Tu Tienda de Perfumes',
    description: 'Los mejores perfumes para ti',
    siteName: 'Mafe Store',
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
