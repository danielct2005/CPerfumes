'use client';

import { Perfume } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Perfume[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron perfumes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((perfume) => (
        <ProductCard key={perfume.id} perfume={perfume} />
      ))}
    </div>
  );
}
