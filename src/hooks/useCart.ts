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
    loadCart();
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
  }) => {
    try {
      setError(null);
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string | number, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: string | number) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item from cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCart(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getCartCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    if (!cart) return 0;
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
