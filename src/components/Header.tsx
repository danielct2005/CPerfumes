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
            <Image
              src="https://i.ibb.co/sp4k4NKk/logo-text.png"
              alt="FRAGANZZA"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
              priority
            />
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
