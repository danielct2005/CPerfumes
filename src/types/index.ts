export interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: 'hombre' | 'mujer' | 'unisex';
  notes: string[];
  price: number;
  imageUrl: string;
  description?: string;
  createdAt: number;
}

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (perfume: Perfume) => void;
  removeItem: (perfumeId: string) => void;
  updateQuantity: (perfumeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
