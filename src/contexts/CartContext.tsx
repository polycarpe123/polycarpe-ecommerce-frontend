import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartService, type Cart } from '../services/cartService';

// Cart Context Types
interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  addToCart: (item: {
    productId: string | number;
    quantity: number;
    color?: string;
    size?: string;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
  }) => Promise<void>;
  updateCartItem: (itemId: string | number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Cart State Type
interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

// Cart Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_CART' };

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { cart: null, loading: false, error: null };
    default:
      return state;
  }
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: true,
    error: null,
  });

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  const addToCart = async (item: {
    productId: string | number;
    quantity: number;
    color?: string;
    size?: string;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
  }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.addToCart(item);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      throw error;
    }
  };

  const updateCartItem = async (itemId: string | number, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
      throw error;
    }
  };

  const removeFromCart = async (itemId: string | number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.removeFromCart(itemId);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Clear localStorage directly since cartService doesn't have clearCart method
      localStorage.removeItem('cart');
      const emptyCart: Cart = {
        id: 'cart-' + Date.now(),
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'SET_CART', payload: emptyCart });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  // Calculate derived values
  const itemCount = (state.cart?.items && Array.isArray(state.cart.items)) 
    ? state.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0) 
    : 0;
  const subtotal = state.cart?.subtotal || 0;
  const total = state.cart?.total || 0;

  const value: CartContextType = {
    cart: state.cart,
    loading: state.loading,
    itemCount,
    subtotal,
    total,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
