// Cart Service API
import api from './api';
import type { Product } from './productService';

export interface CartItem {
  id: string | number;
  productId: string | number;
  product?: Product;
  name: string;
  price: number;
  totalPrice: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
  addedAt: string;
}

export interface Cart {
  id: string | number;
  customerId?: string | number;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'active' | 'abandoned' | 'converted';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Cart API calls
export const cartService = {
  // Get current user's cart from database
  getCart: async (): Promise<Cart> => {
    try {
      // Try to get cart from database first
      const response = await api.get('/cart');
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      console.log('Database cart not found, using localStorage');
      return cartService.getLocalCart();
    }
  },

  // Add item to cart (database first, localStorage fallback)
  addToCart: async (item: {
    productId: string | number;
    quantity: number;
    color?: string;
    size?: string;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
  }): Promise<Cart> => {
    try {
      // Try to add to database cart
      const response = await api.post('/cart/items', item);
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database cart update failed, using localStorage');
      return cartService.addToLocalCart(item);
    }
  },

  // Update cart item quantity (database first, localStorage fallback)
  updateCartItem: async (itemId: string | number, quantity: number): Promise<Cart> => {
    try {
      // Try to update database cart
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database cart update failed, using localStorage');
      return cartService.updateLocalCartItem(itemId, quantity);
    }
  },

  // Remove item from cart (database first, localStorage fallback)
  removeFromCart: async (itemId: string | number): Promise<Cart> => {
    try {
      // Try to remove from database cart
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database cart update failed, using localStorage');
      return cartService.removeFromLocalCart(itemId);
    }
  },

  // Clear cart (database first, localStorage fallback)
  clearCart: async (): Promise<Cart> => {
    try {
      // Try to clear database cart
      const response = await api.delete('/cart');
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database cart clear failed, using localStorage');
      return cartService.clearLocalCart();
    }
  },

  // Get cart summary
  getCartSummary: async (): Promise<{ itemCount: number; subtotal: number; total: number }> => {
    try {
      // Try database summary
      const response = await api.get('/cart/summary');
      return response.data;
    } catch {
      // Fallback to localStorage
      const cart = cartService.getLocalCart();
      return {
        itemCount: (cart.items && Array.isArray(cart.items)) 
          ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0,
        subtotal: cart.subtotal || 0,
        total: cart.total || 0
      };
    }
  },

  // Merge guest cart with user cart after login
  mergeCart: async (guestCartId: string): Promise<Cart> => {
    try {
      const response = await api.post('/cart/merge', { guestCartId });
      return response.data;
    } catch (error) {
      console.error('Cart merge failed:', error);
      throw error;
    }
  },

  // Local storage methods for guest users
  getLocalCart: (): Cart => {
    const cartData = localStorage.getItem('guestCart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      // Check if cart is expired (24 hours)
      if (cart.expiresAt && new Date(cart.expiresAt) < new Date()) {
        localStorage.removeItem('guestCart');
        return cartService.createEmptyLocalCart();
      }
      return cart;
    }
    return cartService.createEmptyLocalCart();
  },

  createEmptyLocalCart: (): Cart => ({
    id: 'guest-' + Date.now(),
    sessionId: 'session-' + Date.now(),
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }),

  saveLocalCart: (cart: Cart): void => {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem('guestCart', JSON.stringify(cart));
  },

  addToLocalCart: (item: {
    productId: string | number;
    quantity: number;
    color?: string;
    size?: string;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
  }): Cart => {
    const cart = cartService.getLocalCart();
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(i => 
      i.productId === item.productId && 
      i.color === item.color && 
      i.size === item.size
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: item.productId,
        name: item.name || `Product ${item.productId}`,
        price: item.price || 0,
        totalPrice: (item.price || 0) * item.quantity,
        image: item.image || 'https://picsum.photos/300/300?random=1',
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        addedAt: new Date().toISOString()
      };
      cart.items.push(cartItem);
    }

    // Recalculate totals
    cartService.recalculateLocalCartTotals(cart);
    cartService.saveLocalCart(cart);
    return cart;
  },

  updateLocalCartItem: (itemId: string | number, quantity: number): Cart => {
    const cart = cartService.getLocalCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * quantity;
      }
      cartService.recalculateLocalCartTotals(cart);
      cartService.saveLocalCart(cart);
    }
    
    return cart;
  },

  removeFromLocalCart: (itemId: string | number): Cart => {
    const cart = cartService.getLocalCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cartService.recalculateLocalCartTotals(cart);
    cartService.saveLocalCart(cart);
    return cart;
  },

  clearLocalCart: (): Cart => {
    const cart = cartService.createEmptyLocalCart();
    localStorage.setItem('guestCart', JSON.stringify(cart));
    return cart;
  },

  recalculateLocalCartTotals: (cart: Cart): void => {
    if (!cart.items || !Array.isArray(cart.items)) {
      cart.subtotal = 0;
      cart.tax = 0;
      cart.shipping = 0;
      cart.total = 0;
      return;
    }
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    cart.tax = cart.subtotal * 0.08; // 8% tax
    cart.shipping = cart.subtotal > 100 ? 0 : 10; // Free shipping over $100
    cart.total = cart.subtotal + cart.tax + cart.shipping - (cart.discount || 0);
  }
};
