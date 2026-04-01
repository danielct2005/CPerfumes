'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo - FRAGANZZA texto horizontal */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-auto min-w-[100px]">
              <Image
                src="https://i.ibb.co/sp4k4NKk/logo-text.png"
                alt="FRAGANZZA"
                fill
                className="object-contain"
                unoptimized
                onError={(e) => {
                  // Fallback: mostrar texto si imagen no carga
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-lg font-medium text-black absolute inset-0 flex items-center';
                  fallback.textContent = 'FRAGANZZA';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
          </Link>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="text-sm text-gray-400 hover:text-black transition-colors duration-200"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
