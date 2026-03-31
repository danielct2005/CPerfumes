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
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
