'use client';

import { Perfume } from '@/types';

export type CategoryFilter = 'todos' | 'hombre' | 'mujer' | 'unisex';
export type PriceSort = 'none' | 'price-asc' | 'price-desc';
export type TagFilter = 'todos' | 'tendencias' | 'mas-vendidos';

interface FilterBarProps {
  activeCategory: CategoryFilter;
  activePriceSort: PriceSort;
  activeTag: TagFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  onPriceSortChange: (sort: PriceSort) => void;
  onTagChange: (tag: TagFilter) => void;
  products: Perfume[];
}

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'unisex', label: 'Unisex' },
];

const priceSortOptions: { id: PriceSort; label: string }[] = [
  { id: 'none', label: 'Ordenar por' },
  { id: 'price-asc', label: 'Precio: Menor a Mayor' },
  { id: 'price-desc', label: 'Precio: Mayor a Menor' },
];

const tagOptions: { id: TagFilter; label: string }[] = [
  { id: 'todos', label: 'Todas' },
  { id: 'tendencias', label: 'Tendencias' },
  { id: 'mas-vendidos', label: 'Más Vendidos' },
];

export default function FilterBar({
  activeCategory,
  activePriceSort,
  activeTag,
  onCategoryChange,
  onPriceSortChange,
  onTagChange,
  products,
}: FilterBarProps) {
  return (
    <div className="mb-12 space-y-6">
      {/* Category Filters */}
      <div className="flex gap-8 items-center justify-center flex-wrap">
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

      {/* Additional Filters Row */}
      <div className="flex flex-wrap gap-6 items-center justify-center">
        {/* Price Sort */}
        <div className="relative">
          <select
            value={activePriceSort}
            onChange={(e) => onPriceSortChange(e.target.value as PriceSort)}
            className="appearance-none bg-transparent text-sm tracking-wide py-2 pr-8 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
          >
            {priceSortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <select
            value={activeTag}
            onChange={(e) => onTagChange(e.target.value as TagFilter)}
            className="appearance-none bg-transparent text-sm tracking-wide py-2 pr-8 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
          >
            {tagOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
