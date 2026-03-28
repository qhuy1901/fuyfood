import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  /** Unique cart-line id = `${productId}|${JSON.stringify(options)}` */
  cartItemId: string;
  productId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  options?: Record<string, string | string[]>;
  totalPrice: number; // basePrice * quantity (options can override in future)
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  restaurantId: string | null;
  restaurantName: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'cartItemId' | 'quantity' | 'totalPrice'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; cartItemId: string }
  | { type: 'UPDATE_QTY'; cartItemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; state: CartState };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCartItemId(productId: string, options?: Record<string, string | string[]>) {
  return options ? `${productId}|${JSON.stringify(options)}` : productId;
}

function computeTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.totalPrice, 0),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return action.state;

    case 'ADD_ITEM': {
      const { restaurantId, restaurantName, productId, options, basePrice, quantity = 1 } = action.payload;
      const cartItemId = makeCartItemId(productId, options);

      // Multi-restaurant: clear if switching
      const isSameRestaurant = state.restaurantId === null || state.restaurantId === restaurantId;
      let items = isSameRestaurant ? [...state.items] : [];

      const existing = items.find(i => i.cartItemId === cartItemId);
      if (existing) {
        items = items.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.quantity + quantity) * i.basePrice }
            : i
        );
      } else {
        items = [
          ...items,
          {
            ...action.payload,
            cartItemId,
            quantity,
            totalPrice: basePrice * quantity,
          },
        ];
      }

      return {
        ...state,
        items,
        restaurantId,
        restaurantName,
        ...computeTotals(items),
      };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.cartItemId !== action.cartItemId);
      return {
        ...state,
        items,
        restaurantId: items.length ? state.restaurantId : null,
        restaurantName: items.length ? state.restaurantName : null,
        ...computeTotals(items),
      };
    }

    case 'UPDATE_QTY': {
      if (action.quantity <= 0) {
        const items = state.items.filter(i => i.cartItemId !== action.cartItemId);
        return {
          ...state,
          items,
          restaurantId: items.length ? state.restaurantId : null,
          restaurantName: items.length ? state.restaurantName : null,
          ...computeTotals(items),
        };
      }
      const items = state.items.map(i =>
        i.cartItemId === action.cartItemId
          ? { ...i, quantity: action.quantity, totalPrice: i.basePrice * action.quantity }
          : i
      );
      return { ...state, items, ...computeTotals(items) };
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0, restaurantId: null, restaurantName: null };

    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fuyfood_cart';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  restaurantId: null,
  restaurantName: null,
};

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch {
    // ignore
  }
  return initialState;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, 'cartItemId' | 'quantity' | 'totalPrice'> & { quantity?: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadFromStorage);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota exceeded — ignore
    }
  }, [state]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'cartItemId' | 'quantity' | 'totalPrice'> & { quantity?: number }) =>
      dispatch({ type: 'ADD_ITEM', payload: item }),
    []
  );
  const removeItem = useCallback((cartItemId: string) => dispatch({ type: 'REMOVE_ITEM', cartItemId }), []);
  const updateQty = useCallback(
    (cartItemId: string, quantity: number) => dispatch({ type: 'UPDATE_QTY', cartItemId, quantity }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
