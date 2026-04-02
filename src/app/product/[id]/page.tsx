'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Perfume } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/cart-context';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // Función para obtener URL optimizada de Cloudinary
  const getOptimizedUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    // Si es de Cloudinary, agregar transformación
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_500,c_fill/');
    }
    return url;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        const docRef = doc(db, 'perfumes', params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Perfume);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const images = product?.images?.length 
    ? product.images 
    : product?.imageUrl 
      ? [product.imageUrl] 
      : ['/placeholder.png'];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-300 text-sm tracking-wide">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">
        {/* Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-black transition-colors mb-8"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Carousel */}
          <div className="relative">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <img
                    src={getOptimizedUrl(images[currentIndex])}
                    alt={`${product.name} - Imagen ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Siguiente imagen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                      currentIndex === idx 
                        ? 'ring-2 ring-black ring-offset-2' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getOptimizedUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {product.category}
              </span>
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-black text-white uppercase tracking-wider"
                >
                  {tag === 'tendencias' ? 'Tendencias' : 'Más Vendidos'}
                </span>
              ))}
            </div>

            {/* Name & Brand */}
            <h1 className="text-3xl font-light text-black tracking-tight">
              {product.name}
            </h1>
            <p className="text-lg text-gray-400 mt-1">{product.brand}</p>

            {/* Price */}
            <p className="text-2xl font-semibold text-black mt-6">
              ${product.price.toLocaleString('es-CL')}
            </p>

            {/* Notes */}
            {product.notes && product.notes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-black tracking-wide mb-2">
                  NOTAS OLFATIVAS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-black tracking-wide mb-2">
                  DESCRIPCIÓN
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-auto py-4 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
            >
              Añadir al carrito
            </button>

            {/* Toast de confirmación */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium tracking-wide z-50"
                >
                  ✓ Añadido al carrito
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
