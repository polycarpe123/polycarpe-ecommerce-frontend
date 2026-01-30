// Order Service API
// import api from './api'; // Temporarily not using, will use when backend is ready

export interface OrderItem {
  id: string | number;
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: string | number;
  userId?: string | number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentInfo?: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
  };
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  billingInfo: Order['billingInfo'];
  shippingInfo: Order['shippingInfo'];
  paymentMethod: string;
  paymentInfo?: Order['paymentInfo'];
}

// Order API calls
export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    // For now, simulate API call and store in localStorage
    // In production, this would be: const response = await api.post('/orders', orderData);
    
    const order: Order = {
      id: Date.now().toString(),
      userId: 1, // Would come from authenticated user
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      status: 'pending',
      billingInfo: orderData.billingInfo,
      shippingInfo: orderData.shippingInfo,
      paymentMethod: orderData.paymentMethod,
      paymentInfo: orderData.paymentInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`
    };
    
    // Store order in localStorage (simulating database)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return order;
  },

  // Get all orders for a user
  getOrders: async (userId?: string | number): Promise<Order[]> => {
    // Simulate API call
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return userId ? orders.filter((order: Order) => order.userId === userId) : orders;
  },

  // Get single order by ID
  getOrder: async (orderId: string | number): Promise<Order> => {
    // Simulate API call
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find((o: Order) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  // Update order status
  updateOrderStatus: async (orderId: string | number, status: Order['status']): Promise<Order> => {
    // Simulate API call
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return orders[orderIndex];
  },

  // Delete order
  deleteOrder: async (orderId: string | number): Promise<void> => {
    // Simulate API call
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filteredOrders = orders.filter((o: Order) => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
  }
};
