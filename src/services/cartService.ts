// Cart Service API
import api from './api';

export interface CartItem {
  id: string | number;
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
    // Try to get cart from localStorage first
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
    
    // Return empty cart if no stored cart
    const emptyCart: Cart = {
      id: 'cart-1',
      items: [],
      total: 0.00,
      subtotal: 0.00,
      tax: 0.00,
      shipping: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return stored cart if exists, otherwise return empty cart
    return storedCart ? JSON.parse(storedCart) : emptyCart;
  },

  // Add item to cart
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
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0, "subtotal": 0}');
    
    // Create new cart item
    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: item.productId,
      name: item.name || `Product ${item.productId}`,
      price: item.price || 0,
      image: item.image || 'https://picsum.photos/300/300?random=1',
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      addedAt: new Date().toISOString()
    };
    
    // Check if item already exists
    const existingItemIndex = currentCart.items.findIndex((i: CartItem) => 
      i.productId === item.productId && i.color === item.color && i.size === item.size
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      currentCart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      currentCart.items.push(newItem);
    }
    
    // Calculate totals
    currentCart.subtotal = currentCart.items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );
    currentCart.tax = currentCart.subtotal * 0.08; // 8% tax
    currentCart.shipping = currentCart.subtotal > 200 ? 0 : 10;
    currentCart.total = currentCart.subtotal + currentCart.tax + currentCart.shipping;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return currentCart as Cart;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string | number, quantity: number): Promise<Cart> => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0, "subtotal": 0}');
    
    const itemIndex = currentCart.items.findIndex((i: CartItem) => i.id === itemId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex].quantity = quantity;
      }
    }
    
    // Recalculate totals
    currentCart.subtotal = currentCart.items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );
    currentCart.tax = currentCart.subtotal * 0.08;
    currentCart.shipping = currentCart.subtotal > 200 ? 0 : 10;
    currentCart.total = currentCart.subtotal + currentCart.tax + currentCart.shipping;
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return currentCart as Cart;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string | number): Promise<Cart> => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0, "subtotal": 0}');
    
    currentCart.items = currentCart.items.filter((i: CartItem) => i.id !== itemId);
    
    // Recalculate totals
    currentCart.subtotal = currentCart.items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );
    currentCart.tax = currentCart.subtotal * 0.08;
    currentCart.shipping = currentCart.subtotal > 200 ? 0 : 10;
    currentCart.total = currentCart.subtotal + currentCart.tax + currentCart.shipping;
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return currentCart as Cart;
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
