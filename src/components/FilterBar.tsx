'use client';

import { Perfume } from '@/types';

export type CategoryFilter = 'todos' | 'hombre' | 'mujer' | 'unisex';

interface FilterBarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  products: Perfume[];
}

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'unisex', label: 'Unisex' },
];

export default function FilterBar({ activeCategory, onCategoryChange, products }: FilterBarProps) {
  return (
    <div className="mb-12">
      <div className="flex gap-8 items-center justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`text-sm tracking-wide uppercase transition-all duration-300 relative py-2 ${
              activeCategory === category.id
                ? 'text-black font-medium'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {category.label}
            {activeCategory === category.id && (
              <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-100 transition-transform duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
