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
  const productList = items
    .map((item) => `${item.perfume.name} (x${item.quantity}) - $${item.perfume.price * item.quantity}`)
    .join('\n• ');

  const message = `*Nuevo pedido de Perfumería*%0A%0A*Productos:*%0A• ${productList}%0A%0A*Total: $${total.toFixed(2)}*%0A%0APor favor, confirma disponibilidad.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
