// Order Service API
import api from './api';

export interface OrderItem {
  id: string | number;
  productId: string | number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  color?: string;
  size?: string;
  sku?: string;
}

export interface ShippingAddress {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
  email?: string; // For PayPal
}

export interface Order {
  id: string | number;
  orderNumber: string;
  customerId?: string | number;
  customerEmail?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: string;
  notes?: string;
}

export interface OrderSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

// Order API calls
export const orderService = {
  // Create new order from cart (database first, localStorage fallback)
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      // Try to create order in database
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      console.log('Database order creation failed, using localStorage');
      return orderService.createGuestOrder(orderData);
    }
  },

  // Get order by ID (database first, localStorage fallback)
  getOrder: async (orderId: string | number): Promise<Order> => {
    try {
      // Try to get from database
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      console.log('Database order not found, using localStorage');
      return orderService.getGuestOrder(orderId);
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    try {
      const response = await api.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      const orders = orderService.getGuestOrders();
      const order = orders.find(o => o.orderNumber === orderNumber);
      if (!order) throw new Error('Order not found');
      return order;
    }
  },

  // Get all orders for a customer
  getCustomerOrders: async (customerId?: string | number, filters?: {
    status?: Order['status'];
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
    try {
      // Try database first
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/orders?${params}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      const orders = orderService.getGuestOrders();
      const filteredOrders = customerId 
        ? orders.filter(order => order.customerId === customerId)
        : orders;
      
      return {
        orders: filteredOrders,
        total: filteredOrders.length,
        page: filters?.page || 1,
        totalPages: Math.ceil(filteredOrders.length / (filters?.limit || 10))
      };
    }
  },

  // Get all orders (admin)
  getAllOrders: async (filters?: {
    status?: Order['status'];
    page?: number;
    limit?: number;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
    try {
      // Try database first
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/orders/admin?${params}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      const orders = orderService.getGuestOrders();
      
      // Apply filters
      let filteredOrders = orders;
      if (filters?.status) {
        filteredOrders = orders.filter(order => order.status === filters.status);
      }
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOrders = orders.filter(order => 
          order.orderNumber.toLowerCase().includes(searchTerm) ||
          order.customerEmail?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      return {
        orders: paginatedOrders,
        total: filteredOrders.length,
        page,
        totalPages: Math.ceil(filteredOrders.length / limit)
      };
    }
  },

  // Update order status (database first, localStorage fallback)
  updateOrderStatus: async (orderId: string | number, status: Order['status'], notes?: string): Promise<Order> => {
    try {
      // Try database update
      const response = await api.put(`/orders/${orderId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      return orderService.updateGuestOrderStatus(orderId, status, notes);
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId: string | number, paymentStatus: Order['paymentStatus']): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${orderId}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      return orderService.updateGuestPaymentStatus(orderId, paymentStatus);
    }
  },

  // Add tracking information
  addTrackingInfo: async (orderId: string | number, trackingNumber: string, carrier?: string): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${orderId}/tracking`, { trackingNumber, carrier });
      return response.data;
    } catch (error) {
      return orderService.updateGuestTrackingInfo(orderId, trackingNumber);
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string | number, reason?: string): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      return orderService.updateGuestOrderStatus(orderId, 'cancelled', reason);
    }
  },

  // Get order statistics
  getOrderStats: async (filters?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<OrderStats> => {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await api.get(`/orders/stats?${params}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage stats
      const orders = orderService.getGuestOrders() || [];
      return {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        shippedOrders: orders.filter(o => o.status === 'shipped').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length : 0
      };
    }
  },

  // Local storage methods for guest orders
  createGuestOrder: (orderData: CreateOrderRequest): Order => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      customerId: undefined,
      customerEmail: orderData.shippingAddress.email,
      status: 'pending',
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      discount: orderData.discount,
      total: orderData.total,
      currency: 'USD',
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      shippingMethod: orderData.shippingMethod,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orderService.saveGuestOrder(order);
    return order;
  },

  getGuestOrder: (orderId: string | number): Order => {
    const orders = orderService.getGuestOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    return order;
  },

  getGuestOrders: (): Order[] => {
    return JSON.parse(localStorage.getItem('guestOrders') || '[]');
  },

  saveGuestOrder: (order: Order): void => {
    const guestOrders = orderService.getGuestOrders();
    const existingIndex = guestOrders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      guestOrders[existingIndex] = order;
    } else {
      guestOrders.push(order);
    }
    
    localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
  },

  updateGuestOrderStatus: (orderId: string | number, status: Order['status'], notes?: string): Order => {
    const orders = orderService.getGuestOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    if (notes) {
      orders[orderIndex].notes = notes;
    }
    
    if (status === 'shipped') {
      orders[orderIndex].shippedAt = new Date().toISOString();
    } else if (status === 'delivered') {
      orders[orderIndex].deliveredAt = new Date().toISOString();
    } else if (status === 'cancelled') {
      orders[orderIndex].cancelledAt = new Date().toISOString();
    }
    
    localStorage.setItem('guestOrders', JSON.stringify(orders));
    return orders[orderIndex];
  },

  updateGuestPaymentStatus: (orderId: string | number, paymentStatus: Order['paymentStatus']): Order => {
    const orders = orderService.getGuestOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex].paymentStatus = paymentStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('guestOrders', JSON.stringify(orders));
    return orders[orderIndex];
  },

  updateGuestTrackingInfo: (orderId: string | number, trackingNumber: string): Order => {
    const orders = orderService.getGuestOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex].trackingNumber = trackingNumber;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('guestOrders', JSON.stringify(orders));
    return orders[orderIndex];
  },

  clearGuestOrders: (): void => {
    localStorage.removeItem('guestOrders');
  }
};
