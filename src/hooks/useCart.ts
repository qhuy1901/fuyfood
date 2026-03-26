import { useState, useCallback } from 'react';
import type { CartItem } from '../data/mockData';
import { cartItems as initialCartItems } from '../data/mockData';

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }, [removeItem]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, itemCount, subtotal, addItem, removeItem, updateQuantity };
}
