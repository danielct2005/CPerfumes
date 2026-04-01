'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Perfume } from '@/types';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  perfume: Perfume;
}

export default function ProductCard({ perfume }: ProductCardProps) {
  const { addItem } = useCart();

  // Soporte para múltiples imágenes
  const images = perfume.images?.length ? perfume.images : [perfume.imageUrl];
  const mainImage = images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(perfume);
  };

  return (
    <Link href={`/product/${perfume.id}`} className="block group">
      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <Image
          src={mainImage}
          alt={perfume.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
        />
        
        {/* Add button overlay on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 py-3 bg-black text-white text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          Añadir al carrito
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {perfume.category}
        </span>

        {/* Name and Brand */}
        <h3 className="text-base font-medium text-black mt-1 leading-tight">
          {perfume.name}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">{perfume.brand}</p>

        {/* Notes - subtle */}
        {perfume.notes && perfume.notes.length > 0 && (
          <p className="text-xs text-gray-300 mt-2">
            {perfume.notes.slice(0, 3).join(' • ')}
          </p>
        )}

        {/* Price */}
        <p className="text-lg font-semibold text-black mt-3">
          ${perfume.price.toLocaleString('es-CL')}
        </p>
      </div>
    </Link>
  );
}
