'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { generateWhatsAppMessage } from '@/context/cart-store';
import { whatsappNumber } from '@/lib/firebase';

export default function CartButton() {
  const { items, getTotal, getItemCount, clearCart, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = getItemCount();
  const total = getTotal();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    const waUrl = generateWhatsAppMessage(items, total, whatsappNumber);
    window.open(waUrl, '_blank');
    clearCart();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white border border-gray-100 shadow-2xl shadow-black/5 rounded-lg overflow-hidden mb-3">
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                Tu carrito está vacío
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.perfume.id}
                  className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-0"
                >
                  {/* Image */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
                    {item.perfume.images?.[0] || item.perfume.imageUrl ? (
                      <img
                        src={item.perfume.images?.[0] || item.perfume.imageUrl}
                        alt={item.perfume.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {item.perfume.brand} {item.perfume.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ${item.perfume.price.toLocaleString('es-CL')}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-black min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.perfume.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-semibold text-black">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Continuar por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 bg-white border border-gray-200 text-black rounded-full shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-200 flex items-center justify-center"
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
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        
        {/* Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}