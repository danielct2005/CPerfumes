'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Perfume } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Custom Confirmation Modal Component
function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText, 
  cancelText, 
  onConfirm, 
  onCancel,
  danger = false 
}: { 
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 transform transition-all">
        <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    danger: false,
    onConfirm: () => {}
  });

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'hombre' | 'mujer' | 'unisex'>('mujer');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Funciones para reordenar imágenes
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...existingImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setExistingImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === existingImages.length - 1) return;
    const newImages = [...existingImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setExistingImages(newImages);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin');
        return;
      }
      setUser(currentUser);
      await fetchProducts();
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'perfumes'), orderBy('createdAt', 'desc'));
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
          status: data.status ?? true,
          discountPrice: data.discountPrice,
          isOnSale: data.isOnSale,
          createdAt: data.createdAt,
        };
      }) as Perfume[];
      setProducts(perfumes);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // Formatear número con separadores de miles
  const formatNumber = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '';
    return parseInt(numbers, 10).toLocaleString('es-CL');
  };

  // Obtener número limpio sin separadores
  const parseNumber = (value: string): number => {
    return parseInt(value.replace(/\./g, ''), 10) || 0;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setPrice(formatted);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 1) {
      alert('Selecciona al menos 1 foto');
      return;
    }
    
    // Validar tamaño de archivos
    for (const file of files) {
      if (file.size > 16 * 1024 * 1024) {
        alert('Cada imagen debe ser menor a 16MB');
        return;
      }
    }
    
    setImageFiles(files);
    
    // Crear previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'perfumes');
    formData.append('cloud_name', 'dfkowfc33');
    
    const response = await fetch('https://api.cloudinary.com/v1_1/dfkowfc33/image/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('Error al subir imagen');
    }
    
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFiles.length === 0 && existingImages.length === 0) {
      alert('Por favor selecciona al menos 1 foto del perfume');
      return;
    }

    setSaving(true);
    setUploading(true);
    
    try {
      let finalImages: string[] = [...existingImages];
      
      // Subir nuevas imágenes si hay
      if (imageFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          imageFiles.map(file => uploadToCloudinary(file))
        );
        finalImages = [...finalImages, ...uploadedUrls];
      }

      const perfumeData = {
        name,
        brand,
        category,
        notes: notes.split(',').map((n) => n.trim()),
        price: parseNumber(price),
        discountPrice: discountPrice ? parseNumber(discountPrice) : null,
        isOnSale: discountPrice && parseNumber(discountPrice) > 0 ? true : false,
        imageUrl: finalImages[0], // Primera imagen como principal
        images: finalImages, // Array completo de imágenes
        tags,
        status: editingId 
          ? products.find(p => p.id === editingId)?.status ?? true
          : true,
        createdAt: editingId 
          ? products.find(p => p.id === editingId)?.createdAt || Date.now()
          : Date.now(),
      };

      if (editingId) {
        // Actualizar documento existente
        await updateDoc(doc(db, 'perfumes', editingId), perfumeData);
      } else {
        // Crear nuevo documento
        await addDoc(collection(db, 'perfumes'), perfumeData);
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error('Error saving perfume:', error);
      alert('Error al guardar el perfume. Verifica la conexión e intenta con imágenes más pequeñas.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (product: Perfume) => {
    setEditingId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setNotes(product.notes?.join(', ') || '');
    setPrice(product.price.toLocaleString('es-CL'));
    setDiscountPrice(product.discountPrice ? product.discountPrice.toLocaleString('es-CL') : '');
    setTags(product.tags || []);
    setExistingImages(product.images || [product.imageUrl]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBrand('');
    setCategory('mujer');
    setNotes('');
    setPrice('');
    setDiscountPrice('');
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setTags([]);
  };

  const handleDelete = async (id: string) => {
    const productName = products.find(p => p.id === id)?.name || 'este perfume';
    setModalConfig({
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      danger: true,
      onConfirm: async () => {
        setModalOpen(false);
        try {
          await deleteDoc(doc(db, 'perfumes', id));
          await fetchProducts();
        } catch (error) {
          console.error('Error deleting perfume:', error);
        }
      }
    });
    setModalOpen(true);
  };

  // Toggle stock status
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'perfumes', id), {
        status: !currentStatus
      });
      await fetchProducts();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Toggle discount for a single product
  const toggleDiscount = async (id: string, product: Perfume) => {
    try {
      const newIsOnSale = !(product.isOnSale === true);
      if (newIsOnSale && !product.discountPrice) {
        // If enabling sale but no discount price, set to 80% of original
        await updateDoc(doc(db, 'perfumes', id), {
          isOnSale: true,
          discountPrice: Math.round(product.price * 0.8)
        });
      } else {
        await updateDoc(doc(db, 'perfumes', id), {
          isOnSale: newIsOnSale,
          discountPrice: newIsOnSale ? product.discountPrice : null
        });
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error toggling discount:', error);
    }
  };

  // Apply discount to all products
  const applyDiscountToAll = async (percentage: number) => {
    const totalProducts = products.length;
    setModalConfig({
      title: 'Aplicar Descuento',
      message: `¿Aplicar ${percentage}% de descuento a los ${totalProducts} productos? El nuevo precio será calculado automáticamente.`,
      confirmText: 'Aplicar',
      cancelText: 'Cancelar',
      danger: false,
      onConfirm: async () => {
        setModalOpen(false);
        setLoading(true);
        for (const p of products) {
          const newPrice = Math.round(p.price * (1 - percentage / 100));
          await updateDoc(doc(db, 'perfumes', p.id), {
            isOnSale: true,
            discountPrice: newPrice
          });
        }
        await fetchProducts();
        setLoading(false);
      }
    });
    setModalOpen(true);
  };

  // Remove all discounts
  const removeAllDiscounts = async () => {
    setModalConfig({
      title: 'Quitar Descuentos',
      message: '¿Estás seguro de que quieres quitar todos los descuentos? Todos los productos volverán a su precio original.',
      confirmText: 'Quitar Todos',
      cancelText: 'Cancelar',
      danger: true,
      onConfirm: async () => {
        setModalOpen(false);
        setLoading(true);
        for (const p of products) {
          await updateDoc(doc(db, 'perfumes', p.id), {
            isOnSale: false,
            discountPrice: null
          });
        }
        await fetchProducts();
        setLoading(false);
      }
    });
    setModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-sm tracking-wide">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Gestiona tu catálogo de perfumes
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Product Form */}
          <div className="bg-white p-6">
            <h2 className="text-lg font-medium text-black tracking-wide mb-6">
              {editingId ? 'Editar Perfume' : 'Añadir Nuevo Perfume'}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="mb-4 text-sm text-gray-400 hover:text-black transition-colors"
              >
                ← Cancelar edición
              </button>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                >
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Etiquetas
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTag('tendencias')}
                    className={`px-3 py-1 text-xs tracking-wide transition-colors ${
                      tags.includes('tendencias')
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Tendencias
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTag('mas-vendidos')}
                    className={`px-3 py-1 text-xs tracking-wide transition-colors ${
                      tags.includes('mas-vendidos')
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Más Vendidos
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Notas olfativas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="floral, fresa, vainilla"
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Precio
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="1.000.000"
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Precio de Oferta (opcional)
                </label>
                <input
                  type="text"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(formatNumber(e.target.value))}
                  placeholder="Ej: 80.000"
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-black text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Fotos del perfume (mínimo 1)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Selecciona varias fotos de la galería
                </p>
                
                {/* Previews de nuevas imágenes */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Imágenes existentes (al editar) */}
                {existingImages.length > 0 && imagePreviews.length === 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Arrastra o usa los botones para ordenar:</p>
                    <div className="flex gap-2 flex-wrap">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Imagen ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-md">
                            <button
                              type="button"
                              onClick={() => moveImageUp(idx)}
                              disabled={idx === 0}
                              className="p-1 bg-white rounded disabled:opacity-30"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImageDown(idx)}
                              disabled={idx === existingImages.length - 1}
                              className="p-1 bg-white rounded disabled:opacity-30"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          {idx === 0 && (
                            <span className="absolute -top-2 -left-2 bg-black text-white text-[10px] px-1 rounded">Principal</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {uploading 
                  ? 'Subiendo imágenes...' 
                  : saving 
                    ? 'Guardando...' 
                    : editingId 
                      ? 'Actualizar Perfume' 
                      : 'Guardar Perfume'}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h2 className="text-lg font-medium text-black tracking-wide">
                Productos ({products.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setModalConfig({
                      title: 'Desactivar Todo',
                      message: '¿Estás seguro de que quieres desactivar todos los productos? Todos desaparecerán de la tienda.',
                      confirmText: 'Desactivar Todo',
                      cancelText: 'Cancelar',
                      danger: true,
                      onConfirm: async () => {
                        setModalOpen(false);
                        setLoading(true);
                        for (const p of products) {
                          await updateDoc(doc(db, 'perfumes', p.id), { status: false });
                        }
                        await fetchProducts();
                        setLoading(false);
                      }
                    });
                    setModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs bg-red-100 text-red-600 hover:bg-red-200 transition-colors rounded"
                >
                  Todo OFF
                </button>
                <button
                  onClick={() => {
                    setModalConfig({
                      title: 'Activar Todo',
                      message: '¿Estás seguro de que quieres activar todos los productos? Todos aparecerán en la tienda.',
                      confirmText: 'Activar Todo',
                      cancelText: 'Cancelar',
                      danger: false,
                      onConfirm: async () => {
                        setModalOpen(false);
                        setLoading(true);
                        for (const p of products) {
                          await updateDoc(doc(db, 'perfumes', p.id), { status: true });
                        }
                        await fetchProducts();
                        setLoading(false);
                      }
                    });
                    setModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs bg-green-100 text-green-600 hover:bg-green-200 transition-colors rounded"
                >
                  Todo ON
                </button>
                <button
                  onClick={() => applyDiscountToAll(5)}
                  className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors rounded"
                >
                  -5%
                </button>
                <button
                  onClick={() => applyDiscountToAll(10)}
                  className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors rounded"
                >
                  -10%
                </button>
                <button
                  onClick={() => applyDiscountToAll(20)}
                  className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors rounded"
                >
                  -20%
                </button>
                <button
                  onClick={() => applyDiscountToAll(30)}
                  className="px-3 py-1.5 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors rounded"
                >
                  -30%
                </button>
                <button
                  onClick={() => applyDiscountToAll(40)}
                  className="px-3 py-1.5 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors rounded"
                >
                  -40%
                </button>
                <button
                  onClick={() => applyDiscountToAll(50)}
                  className="px-3 py-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 transition-colors rounded"
                >
                  -50%
                </button>
                <button
                  onClick={removeAllDiscounts}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors rounded"
                >
                  Quitar Desc.
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map((product) => {
                const isOutOfStock = product.status === false;
                const isOnSale = product.isOnSale === true && product.discountPrice;
                return (
                <div
                  key={product.id}
                  className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 border gap-3 ${isOutOfStock ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
                >
                  {/* Left: Image + Name + Brand */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 relative flex-shrink-0 bg-gray-50">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50' : ''}`}
                      />
                      {isOutOfStock && (
                        <span className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[10px] text-center py-0.5">
                          Sin Stock
                        </span>
                      )}
                      {isOnSale && (
                        <span className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[10px] text-center py-0.5">
                          OFERTA
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-sm font-medium truncate ${isOutOfStock ? 'text-red-600' : 'text-black'}`}>
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </div>
                  </div>

                  {/* Center: Price */}
                  <div className="text-left md:text-center md:px-4">
                    {isOnSale ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toLocaleString('es-CL')}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          ${product.discountPrice?.toLocaleString('es-CL')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-black">
                        ${product.price.toLocaleString('es-CL')}
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Discount Toggle */}
                    <button
                      onClick={() => toggleDiscount(product.id, product)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isOnSale ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                      title={isOnSale ? 'Quitar descuento' : 'Aplicar descuento (20%)'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isOnSale ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    {/* Stock Toggle */}
                    <button
                      onClick={() => toggleStatus(product.id, product.status ?? true)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        product.status === false ? 'bg-red-400' : 'bg-green-500'
                      }`}
                      title={product.status === false ? 'Activar stock' : 'Desactivar stock'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.status === false ? 'translate-x-1' : 'translate-x-6'
                        }`}
                      />
                    </button>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-300 hover:text-black transition-colors"
                      title="Editar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                );
              })}
              {products.length === 0 && (
                <p className="text-center text-gray-300 py-8 text-sm">
                  No hay perfumes aún. Añade el primero!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        danger={modalConfig.danger}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
