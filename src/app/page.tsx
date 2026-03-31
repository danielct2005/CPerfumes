'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CartButton from '@/components/CartButton';
import ProductGrid from '@/components/ProductGrid';
import FilterBar from '@/components/FilterBar';
import { CategoryFilter } from '@/components/FilterBar';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Perfume } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'perfumes'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const perfumes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Perfume[];
        setProducts(perfumes);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === 'todos'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Perfumes
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Descubre las mejores fragancias para hombre, mujer y unisex
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          products={products}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton />
    </main>
  );
}
