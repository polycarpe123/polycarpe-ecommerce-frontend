// Notification Service API
import api from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'product' | 'category' | 'customer' | 'order' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'pending' | 'completed' | 'cancelled';
  entityId: string | number;
  entityName: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

// Notification API calls
export const notificationService = {
  // Get all notifications
  getNotifications: async (filters?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
    sortBy?: 'createdAt' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }): Promise<NotificationResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.unreadOnly) params.append('unreadOnly', filters.unreadOnly.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
      return {
        notifications,
        total: notifications.length,
        unreadCount,
        page: filters?.page || 1,
        totalPages: Math.ceil(notifications.length / (filters?.limit || 20))
      };
    }
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/count');
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      return notifications.filter((n: Notification) => !n.read).length;
    }
  },

  // Create new notification (internal use)
  createNotification: async (notification: {
    title: string;
    message: string;
    type: Notification['type'];
    action: Notification['action'];
    entityId: string | number;
    entityName: string;
    priority?: Notification['priority'];
  }): Promise<Notification> => {
    try {
      const response = await api.post('/notifications', notification);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...notification,
        priority: notification.priority || 'medium',
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      notifications.unshift(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      return newNotification;
    }
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const notification = notifications.find((n: Notification) => n.id === id);
      if (notification) {
        notification.read = true;
        notification.updatedAt = new Date().toISOString();
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
      return notification;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      await api.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.forEach((n: Notification) => {
        n.read = true;
        n.updatedAt = new Date().toISOString();
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const filteredNotifications = notifications.filter((n: Notification) => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
    }
  },

  // Clear all notifications
  clearAllNotifications: async (): Promise<void> => {
    try {
      await api.delete('/notifications');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      // Fallback to localStorage
      localStorage.setItem('notifications', JSON.stringify([]));
    }
  }
};

// Helper function to create notifications for different events
export const createNotification = {
  product: {
    created: (productName: string, productId: string | number) =>
      notificationService.createNotification({
        title: 'New Product Created',
        message: `Product "${productName}" has been added to the catalog`,
        type: 'product',
        action: 'created',
        entityId: productId,
        entityName: productName,
        priority: 'medium'
      }),
    
    updated: (productName: string, productId: string | number) =>
      notificationService.createNotification({
        title: 'Product Updated',
        message: `Product "${productName}" has been updated`,
        type: 'product',
        action: 'updated',
        entityId: productId,
        entityName: productName,
        priority: 'low'
      }),
    
    deleted: (productName: string, productId: string | number) =>
      notificationService.createNotification({
        title: 'Product Deleted',
        message: `Product "${productName}" has been removed from the catalog`,
        type: 'product',
        action: 'deleted',
        entityId: productId,
        entityName: productName,
        priority: 'high'
      })
  },
  
  category: {
    created: (categoryName: string, categoryId: string | number) =>
      notificationService.createNotification({
        title: 'New Category Created',
        message: `Category "${categoryName}" has been added`,
        type: 'category',
        action: 'created',
        entityId: categoryId,
        entityName: categoryName,
        priority: 'medium'
      }),
    
    updated: (categoryName: string, categoryId: string | number) =>
      notificationService.createNotification({
        title: 'Category Updated',
        message: `Category "${categoryName}" has been updated`,
        type: 'category',
        action: 'updated',
        entityId: categoryId,
        entityName: categoryName,
        priority: 'low'
      }),
    
    deleted: (categoryName: string, categoryId: string | number) =>
      notificationService.createNotification({
        title: 'Category Deleted',
        message: `Category "${categoryName}" has been removed`,
        type: 'category',
        action: 'deleted',
        entityId: categoryId,
        entityName: categoryName,
        priority: 'high'
      })
  },
  
  customer: {
    created: (customerName: string, customerId: string | number) =>
      notificationService.createNotification({
        title: 'New Customer Registered',
        message: `Customer "${customerName}" has joined the platform`,
        type: 'customer',
        action: 'created',
        entityId: customerId,
        entityName: customerName,
        priority: 'medium'
      })
  },
  
  order: {
    created: (orderNumber: string, orderId: string | number) =>
      notificationService.createNotification({
        title: 'New Order Received',
        message: `Order ${orderNumber} has been placed`,
        type: 'order',
        action: 'pending',
        entityId: orderId,
        entityName: orderNumber,
        priority: 'high'
      }),
    
    updated: (orderNumber: string, orderId: string | number, status: string) =>
      notificationService.createNotification({
        title: `Order ${status}`,
        message: `Order ${orderNumber} has been ${status.toLowerCase()}`,
        type: 'order',
        action: status === 'completed' ? 'completed' : status === 'cancelled' ? 'cancelled' : 'updated',
        entityId: orderId,
        entityName: orderNumber,
        priority: status === 'completed' ? 'medium' : 'high'
      })
  }
};
