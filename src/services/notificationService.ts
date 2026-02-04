// Notification Service API
import api from './api';

export interface Notification {
  id: string;
  type: 'order' | 'user' | 'category' | 'product' | 'system';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  read?: boolean;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
}

export interface NotificationCountResponse {
  success: boolean;
  data: {
    orders: {
      newLastHour: number;
      newToday: number;
      pending: number;
    };
    users: {
      newLastHour: number;
      newToday: number;
    };
    categories: {
      newToday: number;
    };
    products: {
      newToday: number;
      lowStock: number;
    };
    total: number;
  };
}

// Notification API calls
export const notificationService = {
  // Get all notifications
  getNotifications: async (filters?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
    sortBy?: 'timestamp' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }): Promise<NotificationResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/notifications?${params}`);
      
      // Transform backend response to match frontend interface
      const notifications = response.data.data.map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        timestamp: item.timestamp,
        data: item.data,
        priority: item.priority,
        read: false // Backend doesn't track read status, so all are unread
      }));

      return {
        success: response.data.success,
        data: notifications
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      return {
        success: true,
        data: notifications
      };
    }
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/count');
      return response.data.data.total;
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
    entityId: string | number;
    entityName: string;
    priority?: Notification['priority'];
  }): Promise<Notification> => {
    try {
      // Backend doesn't support creating notifications, so store in localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString(),
        priority: notification.priority || 'medium',
        read: false
      };
      notifications.unshift(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read (localStorage only)
  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const notification = notifications.find((n: Notification) => n.id === id);
      if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read (localStorage only)
  markAllAsRead: async (): Promise<void> => {
    try {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.forEach((n: Notification) => {
        n.read = true;
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification (localStorage only)
  deleteNotification: async (id: string): Promise<void> => {
    try {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const filteredNotifications = notifications.filter((n: Notification) => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Clear all notifications (localStorage only)
  clearAllNotifications: async (): Promise<void> => {
    try {
      localStorage.setItem('notifications', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
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
        entityId: productId,
        entityName: productName,
        priority: 'medium'
      }),
    
    updated: (productName: string, productId: string | number) =>
      notificationService.createNotification({
        title: 'Product Updated',
        message: `Product "${productName}" has been updated`,
        type: 'product',
        entityId: productId,
        entityName: productName,
        priority: 'low'
      }),
    
    deleted: (productName: string, productId: string | number) =>
      notificationService.createNotification({
        title: 'Product Deleted',
        message: `Product "${productName}" has been removed from the catalog`,
        type: 'product',
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
        entityId: categoryId,
        entityName: categoryName,
        priority: 'medium'
      }),
    
    updated: (categoryName: string, categoryId: string | number) =>
      notificationService.createNotification({
        title: 'Category Updated',
        message: `Category "${categoryName}" has been updated`,
        type: 'category',
        entityId: categoryId,
        entityName: categoryName,
        priority: 'low'
      }),
    
    deleted: (categoryName: string, categoryId: string | number) =>
      notificationService.createNotification({
        title: 'Category Deleted',
        message: `Category "${categoryName}" has been removed`,
        type: 'category',
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
        type: 'user',
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
        entityId: orderId,
        entityName: orderNumber,
        priority: 'high'
      }),
    
    updated: (orderNumber: string, orderId: string | number, status: string) =>
      notificationService.createNotification({
        title: `Order ${status}`,
        message: `Order ${orderNumber} has been ${status.toLowerCase()}`,
        type: 'order',
        entityId: orderId,
        entityName: orderNumber,
        priority: status === 'completed' ? 'medium' : 'high'
      })
  }
};
