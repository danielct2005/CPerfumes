'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { generateWhatsAppMessage } from '@/context/cart-store';
import { whatsappNumber } from '@/lib/firebase';

export default function CartButton() {
  const { items, getTotal, getItemCount, clearCart } = useCart();
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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden mb-2">
          <div className="max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tu carrito está vacío
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.perfume.id}
                  className="flex items-center justify-between p-3 border-b border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.perfume.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      x{item.quantity} - ${(item.perfume.price * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {items.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-purple-600">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp</span>
                <span>💬</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        
        {/* Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
