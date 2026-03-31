'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">◆</span>
            <span className="text-lg font-medium tracking-wide text-black">
              CPerfumes
            </span>
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
