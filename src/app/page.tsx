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
    <main className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light text-black tracking-tight">
            CPerfumes
          </h1>
          <p className="text-gray-400 mt-4 text-sm tracking-wide max-w-md mx-auto">
            Colección exclusiva de fragancias premium
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
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-gray-300 text-sm tracking-wide">
              Cargando...
            </div>
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
