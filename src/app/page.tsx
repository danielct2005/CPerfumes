'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartButton from '@/components/CartButton';
import ProductGrid from '@/components/ProductGrid';
import FilterBar from '@/components/FilterBar';
import { CategoryFilter, PriceSort, TagFilter } from '@/components/FilterBar';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
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
        const q = query(
          collection(db, 'perfumes'), 
          where('status', '==', true)
        );
        const snapshot = await getDocs(q);
        const perfumes = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            brand: data.brand,
            category: data.category,
            notes: data.notes || [],
            price: data.price || 0,
            imageUrl: data.imageUrl || '',
            images: data.images || [],
            tags: data.tags || [],
            description: data.description,
            createdAt: data.createdAt,
          };
        }) as Perfume[];
        
        console.log('Perfumes cargados:', perfumes.length);
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
        {/* Banner - Imagen principal */}
        <div className="mb-12 flex justify-center w-full mx-auto">
          <div className="w-full max-w-4xl rounded-2xl shadow-xl">
            <img 
              src="/banner-principal.jpg.jpeg" 
              alt="FRAGANZZA - Perfumería Premium"
              className="w-full h-auto rounded-2xl"
            />
          </div>
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
