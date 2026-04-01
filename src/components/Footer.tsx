'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-24">
                <Image
                  src="https://i.ibb.co/sp4k4NKk/logo-text.png"
                  alt="FRAGANZZA"
                  fill
                  className="object-contain"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.className = 'text-sm font-medium text-black absolute inset-0 flex items-center';
                    fallback.textContent = 'FRAGANZZA';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Catálogo de perfumes premium
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-black tracking-wide mb-4">
              ENLACES
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-gray-400 hover:text-black transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-black tracking-wide mb-4">
              CONTACTO
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">
                contacto@cperfumes.cl
              </li>
              <li className="text-sm text-gray-400">
                Santiago, Chile
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-300 tracking-wide">
            © {new Date().getFullYear()} FRAGANZZA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
