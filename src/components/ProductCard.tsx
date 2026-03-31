'use client';

import Image from 'next/image';
import { Perfume } from '@/types';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  perfume: Perfume;
}

export default function ProductCard({ perfume }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(perfume);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image with Next.js Image optimization */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={perfume.imageUrl}
          alt={perfume.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 mb-2">
          {perfume.category.charAt(0).toUpperCase() + perfume.category.slice(1)}
        </span>

        {/* Name and Brand */}
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {perfume.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{perfume.brand}</p>

        {/* Notes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {perfume.notes.slice(0, 3).map((note, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-purple-600">
            ${perfume.price.toLocaleString('es-CL')}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
