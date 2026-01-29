// Cart Service API
import api from './api';

export interface CartItem {
  id: string | number;
  productId: string | number;
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  color?: string;
  size?: string;
  addedAt: string;
}

export interface Cart {
  id: string | number;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart API calls
export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (item: {
    productId: string | number;
    quantity: number;
    color?: string;
    size?: string;
  }): Promise<Cart> => {
    const response = await api.post('/cart/items', item);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string | number, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string | number): Promise<Cart> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },

  // Get cart item count
  getCartCount: async (): Promise<number> => {
    const response = await api.get('/cart/count');
    return response.data.count;
  },

  // Apply coupon/discount
  applyCoupon: async (couponCode: string): Promise<Cart> => {
    const response = await api.post('/cart/coupon', { code: couponCode });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async (): Promise<Cart> => {
    const response = await api.delete('/cart/coupon');
    return response.data;
  },
};
