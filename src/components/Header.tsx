'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CPerfumes
            </span>
          </Link>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
