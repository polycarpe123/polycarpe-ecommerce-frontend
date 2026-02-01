// Custom hook for cart management
import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import type { Cart } from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount
  useEffect(() => {
    // Temporary: Clear any existing cart data to ensure clean start
    localStorage.removeItem('cart');
    loadCart();
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (item: {
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
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return updatedCart;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string | number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return updatedCart;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update item quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return updatedCart;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart();
      
      // Set empty cart object instead of null to ensure proper state updates
      const emptyCart: Cart = {
        id: 'cart-' + Date.now(),
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCart(emptyCart);
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      localStorage.removeItem('cart');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCartCount = useCallback(() => {
    // Handle null, undefined, or empty cart states
    if (!cart) return 0;
    if (!cart.items || !Array.isArray(cart.items)) return 0;
    if (cart.items.length === 0) return 0;
    
    // Sum up quantities safely
    return cart.items.reduce((total, item) => {
      const quantity = item.quantity || 0;
      return total + quantity;
    }, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    if (!cart || !cart.total) return 0;
    return cart.total;
  }, [cart]);

  return {
    cart,
    loading,
    error,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  };
};
