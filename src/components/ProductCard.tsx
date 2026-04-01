'use client';

import Link from 'next/link';
import { Perfume } from '@/types';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  perfume: Perfume;
}

export default function ProductCard({ perfume }: ProductCardProps) {
  const { addItem } = useCart();

  // Función para obtener URL optimizada de Cloudinary
  const getOptimizedUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    // Si es de Cloudinary, agregar transformación
    if (url.includes('cloudinary.com')) {
      // Insertar transformación: w_600,c_fill para оптимиzar
      return url.replace('/upload/', '/upload/w_400,c_fill/');
    }
    return url;
  };

  // Soporte para múltiples imágenes - URLs directas de Cloudinary
  const images = perfume.images?.length ? perfume.images : [perfume.imageUrl];
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(perfume);
  };

  return (
    <Link href={`/product/${perfume.id}`} className="block group">
      {/* Product Image - Carrusel con scroll snap usando img nativo */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        {hasMultipleImages ? (
          // Carrusel deslizable para múltiples imágenes
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-full">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-full h-full snap-center relative"
              >
                <img
                  src={getOptimizedUrl(img)}
                  alt={`${perfume.name} - Imagen ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          // Imagen única usando img nativo
          <img
            src={getOptimizedUrl(images[0])}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        
        {/* Indicador de carrusel */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className="w-1.5 h-1.5 rounded-full bg-white/70"
              />
            ))}
          </div>
        )}
        
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
