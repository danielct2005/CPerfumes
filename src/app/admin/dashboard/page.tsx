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
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Perfume } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'hombre' | 'mujer' | 'unisex'>('mujer');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

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
      const perfumes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Perfume[];
      setProducts(perfumes);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 16MB for ImgBB)
      if (file.size > 16 * 1024 * 1024) {
        alert('La imagen debe ser menor a 16MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Using ImgBB free API - get your own free key at https://api.imgbb.com/
    const apiKey = '0d9f404ba349bee6d17ebae53d1b56e3';
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Error al subir imagen');
    }
    
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Image file:', imageFile);
    console.log('Image preview:', imagePreview);
    if (!imageFile) {
      alert('Por favor selecciona una imagen del perfume');
      return;
    }

    setSaving(true);
    setUploading(true);
    
    try {
      // Upload image to ImgBB (free image hosting)
      const imageUrl = await uploadToImgBB(imageFile);

      // Save to Firestore
      await addDoc(collection(db, 'perfumes'), {
        name,
        brand,
        category,
        notes: notes.split(',').map((n) => n.trim()),
        price: parseFloat(price),
        imageUrl,
        createdAt: Date.now(),
      });

      // Reset form
      setName('');
      setBrand('');
      setCategory('mujer');
      setNotes('');
      setPrice('');
      setImageFile(null);
      setImagePreview('');

      // Refresh list
      await fetchProducts();
    } catch (error) {
      console.error('Error saving perfume:', error);
      alert('Error al guardar el perfume. Verifica la conexión e intenta con una imagen más pequeña.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este perfume?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'perfumes', id));
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting perfume:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">
            CPerfumes Admin
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Perfume</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas olfativas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="floral, fresa, vainilla"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto del perfume
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  O usa la cámara del celular directamente
                </p>
                {imagePreview && (
                  <div className="mt-2 relative w-24 h-24">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Subiendo imagen...' : saving ? 'Guardando...' : 'Guardar Perfume'}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Productos ({products.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-sm font-semibold text-purple-600">
                      ${product.price.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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
              ))}
              {products.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay perfumes aún. Añade el primero!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
