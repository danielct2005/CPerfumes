'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Perfume, CartStore } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (perfume: Perfume) => {
        const items = get().items;
        const existingItem = items.find((item) => item.perfume.id === perfume.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.perfume.id === perfume.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { perfume, quantity: 1 }] });
        }
      },

      removeItem: (perfumeId: string) => {
        set({ items: get().items.filter((item) => item.perfume.id !== perfumeId) });
      },

      updateQuantity: (perfumeId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(perfumeId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.perfume.id === perfumeId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.perfume.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'perfumeria-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// WhatsApp checkout helper
export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  phoneNumber: string
): string {
  const date = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const time = new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format each product nicely
  const productList = items
    .map((item) => {
      const subtotal = item.perfume.price * item.quantity;
      return `• ${item.perfume.brand} ${item.perfume.name}\n  Cantidad: ${item.quantity} x $${item.perfume.price.toLocaleString('es-CL')} = $${subtotal.toLocaleString('es-CL')}`;
    })
    .join('\n\n');

  const message = `🛒 *PEDIDO - CPerfumes*\n\n` +
    `📅 Fecha: ${date}\n` +
    `🕐 Hora: ${time}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📦 *PRODUCTOS:*\n\n${productList}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💰 *TOTAL:* $${total.toLocaleString('es-CL')}\n\n` +
    `¿Tienes disponibilidad de estos perfumes?`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
