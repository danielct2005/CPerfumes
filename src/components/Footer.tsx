'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 mt-auto">
      {/* Info Section - Dark with shipping/delivery info */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Envíos */}
            <div>
              <h3 className="font-serif text-lg text-white mb-4 tracking-wide">
                Envíos
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Envíos a todo Chile por medio de Starken o la empresa de transporte de su preferencia.
              </p>
            </div>

            {/* Entregas */}
            <div>
              <h3 className="font-serif text-lg text-white mb-4 tracking-wide">
                Entregas
              </h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Entregas presenciales gratuitas dentro de la comuna.</li>
                <li>• Retiro en nuestro domicilio.</li>
                <li>• Entregas en comunas vecinas: coordinar costo y disponibilidad.</li>
              </ul>
            </div>
          </div>

          {/* Instagram */}
          <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center">
            <a
              href="https://www.instagram.com/fraganzza.cl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@fraganzza.cl</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom - Brand & Copyright */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-white">
                FRAGANZZA
              </span>
            </Link>
            <p className="text-xs text-zinc-500 tracking-wide">
              © {new Date().getFullYear()} FRAGANZZA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}