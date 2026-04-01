'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-black">
                FRAGANZZA
              </span>
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
                contacto@fraganzza.cl
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
