'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartButton from '@/components/CartButton';
import ProductGrid from '@/components/ProductGrid';
import FilterBar from '@/components/FilterBar';
import { CategoryFilter, PriceSort, TagFilter } from '@/components/FilterBar';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Perfume } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');
  const [activePriceSort, setActivePriceSort] = useState<PriceSort>('none');
  const [activeTag, setActiveTag] = useState<TagFilter>('todos');

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

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'todos') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Tag filter
    if (activeTag !== 'todos') {
      result = result.filter((p) => p.tags?.includes(activeTag));
    }

    // Price sort
    if (activePriceSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (activePriceSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, activePriceSort, activeTag]);

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">
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
          activePriceSort={activePriceSort}
          activeTag={activeTag}
          onCategoryChange={setActiveCategory}
          onPriceSortChange={setActivePriceSort}
          onTagChange={setActiveTag}
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

      <Footer />

      {/* Floating Cart Button */}
      <CartButton />
    </main>
  );
}
