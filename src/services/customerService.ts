// Customer Service API
import api from './api';

export interface Customer {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  addresses: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isGuest: boolean;
  preferences: CustomerPreferences;
}

export interface CustomerAddress {
  id: string | number;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomerPreferences {
  newsletter: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  language: string;
  currency: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  totalOrders: number;
  averageOrderValue: number;
  customerRetentionRate: number;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar?: string;
  preferences?: Partial<CustomerPreferences>;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface AuthResponse {
  customer: Customer;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// Customer API calls
export const customerService = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch {
      // Fallback to localStorage for demo
      console.log('Database login failed, using localStorage');
      return customerService.mockLogin(credentials);
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch {
      // Fallback to localStorage for demo
      console.log('Database registration failed, using localStorage');
      return customerService.mockRegister(userData);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      console.log('Database logout failed, clearing localStorage');
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('customer');
  },

  // Customer CRUD
  getCustomer: async (customerId?: string | number): Promise<Customer> => {
    try {
      const response = await api.get(`/customers/${customerId || 'me'}`);
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database customer fetch failed, using localStorage');
      return customerService.getCustomerFromStorage();
    }
  },

  updateCustomer: async (customerId: string | number, data: UpdateCustomerRequest): Promise<Customer> => {
    try {
      const response = await api.put(`/customers/${customerId}`, data);
      return response.data;
    } catch {
      // Fallback to localStorage
      console.log('Database customer update failed, using localStorage');
      return customerService.updateCustomerInStorage(customerId, data);
    }
  },

  deleteCustomer: async (customerId: string | number): Promise<void> => {
    try {
      await api.delete(`/customers/${customerId}`);
    } catch {
      // Fallback to localStorage
      console.log('Database customer deletion failed, using localStorage');
      customerService.deleteCustomerFromStorage(customerId);
    }
  },

  // Customer Lists
  getCustomers: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    sortBy?: 'createdAt' | 'name' | 'email';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ customers: Customer[]; total: number; page: number; totalPages: number }> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/customers?${params}`);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      console.log('Database customers fetch failed, using localStorage');
      return customerService.getCustomersFromStorage(filters);
    }
  },

  // Customer Stats
  getCustomerStats: async (): Promise<CustomerStats> => {
    try {
      const response = await api.get('/customers/stats');
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      console.log('Database stats fetch failed, using localStorage');
      return customerService.getCustomerStatsFromStorage();
    }
  },

  // Address Management
  addAddress: async (customerId: string | number, address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress> => {
    try {
      const response = await api.post(`/customers/${customerId}/addresses`, address);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      console.log('Database address addition failed, using localStorage');
      return customerService.addAddressToStorage(customerId, address);
    }
  },

  updateAddress: async (customerId: string | number, addressId: string | number, address: Partial<CustomerAddress>): Promise<CustomerAddress> => {
    try {
      const response = await api.put(`/customers/${customerId}/addresses/${addressId}`, address);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      console.log('Database address update failed, using localStorage');
      return customerService.updateAddressInStorage(customerId, addressId, address);
    }
  },

  deleteAddress: async (customerId: string | number, addressId: string | number): Promise<void> => {
    try {
      await api.delete(`/customers/${customerId}/addresses/${addressId}`);
    } catch (error) {
      // Fallback to localStorage
      console.log('Database address deletion failed, using localStorage');
      customerService.deleteAddressFromStorage(customerId, addressId);
    }
  },

  // Password Management
  changePassword: async (customerId: string | number, currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put(`/customers/${customerId}/password`, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.log('Database password change failed');
      throw error;
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', { email });
    } catch (error) {
      console.log('Database password reset failed');
      throw error;
    }
  },

  // Mock methods for demo purposes
  mockLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const customers = customerService.getCustomersFromStorage();
    const customer = customers.customers.find(c => c.email === credentials.email);
    
    if (!customer || customer.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('customer', JSON.stringify(customer));

    return {
      customer,
      token,
      expiresIn: 3600
    };
  },

  mockRegister: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const customers = customerService.getCustomersFromStorage();
    
    // Check if email already exists
    if (customers.customers.some(c => c.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newCustomer: Customer = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isGuest: false,
      preferences: {
        newsletter: true,
        marketingEmails: true,
        smsNotifications: false,
        language: 'en',
        currency: 'USD'
      }
    };

    customers.customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('customer', JSON.stringify(newCustomer));

    return {
      customer: newCustomer,
      token,
      expiresIn: 3600
    };
  },

  // Local storage helpers
  getCustomerFromStorage: (): Customer => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      return JSON.parse(customerData);
    }
    throw new Error('No customer found');
  },

  updateCustomerInStorage: (customerId: string | number, data: UpdateCustomerRequest): Customer => {
    const customers = customerService.getCustomersFromStorage();
    const customerIndex = customers.customers.findIndex((c: Customer) => c.id === customerId);
    
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const updatedCustomer: Customer = { 
      ...customers.customers[customerIndex], 
      ...data, 
      updatedAt: new Date().toISOString(),
      preferences: {
        ...customers.customers[customerIndex].preferences,
        ...data.preferences
      }
    };
    
    customers.customers[customerIndex] = updatedCustomer;
    localStorage.setItem('customers', JSON.stringify(customers));
    
    if (localStorage.getItem('customer')) {
      const currentCustomer = JSON.parse(localStorage.getItem('customer')!);
      if (currentCustomer.id === customerId) {
        localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      }
    }

    return updatedCustomer;
  },

  deleteCustomerFromStorage: (customerId: string | number): void => {
    const customers = customerService.getCustomersFromStorage();
    customers.customers = customers.customers.filter((c: Customer) => c.id !== customerId);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    if (localStorage.getItem('customer')) {
      const currentCustomer = JSON.parse(localStorage.getItem('customer')!);
      if (currentCustomer.id === customerId) {
        localStorage.removeItem('customer');
        localStorage.removeItem('authToken');
      }
    }
  },

  getCustomersFromStorage: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    sortBy?: 'createdAt' | 'name' | 'email';
    sortOrder?: 'asc' | 'desc';
  }): { customers: Customer[]; total: number; page: number; totalPages: number } => {
    const customersData = localStorage.getItem('customers');
    let customers = customersData ? JSON.parse(customersData).customers || [] : [];
    
    // Ensure customers is always an array
    if (!Array.isArray(customers)) {
      customers = [];
    }
    
    // Apply filters
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      customers = customers.filter((c: Customer) => 
        (c.firstName || '').toLowerCase().includes(searchLower) ||
        (c.lastName || '').toLowerCase().includes(searchLower) ||
        (c.email || '').toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.status && filters.status !== 'all') {
      customers = customers.filter((c: Customer) => c.isActive === (filters.status === 'active'));
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    return {
      customers: paginatedCustomers,
      total: customers.length,
      page,
      totalPages: Math.ceil(customers.length / limit)
    };
  },

  getCustomerStatsFromStorage: (): CustomerStats => {
    const customers = customerService.getCustomersFromStorage();
    const activeCustomers = customers.customers.filter(c => c.isActive);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return {
      totalCustomers: customers.customers.length,
      activeCustomers: activeCustomers.length,
      newCustomersThisMonth: customers.customers.filter(c => new Date(c.createdAt) > oneMonthAgo).length,
      totalOrders: 0, // TODO: Calculate from orders
      averageOrderValue: 0, // TODO: Calculate from orders
      customerRetentionRate: 85 // Mock data
    };
  },

  addAddressToStorage: (customerId: string | number, address: Omit<CustomerAddress, 'id'>): CustomerAddress => {
    const customer = customerService.getCustomerFromStorage();
    const newAddress: CustomerAddress = {
      ...address,
      id: Date.now()
    };
    
    customer.addresses.push(newAddress);
    customerService.updateCustomerInStorage(customerId, customer);
    
    return newAddress;
  },

  updateAddressInStorage: (customerId: string | number, addressId: string | number, address: Partial<CustomerAddress>): CustomerAddress => {
    const customer = customerService.getCustomerFromStorage();
    const addressIndex = customer.addresses.findIndex(a => a.id === addressId);
    
    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    const updatedAddress = { ...customer.addresses[addressIndex], ...address };
    customer.addresses[addressIndex] = updatedAddress;
    customerService.updateCustomerInStorage(customerId, customer);
    
    return updatedAddress;
  },

  deleteAddressFromStorage: (customerId: string | number, addressId: string | number): void => {
    const customer = customerService.getCustomerFromStorage();
    customer.addresses = customer.addresses.filter(a => a.id !== addressId);
    customerService.updateCustomerInStorage(customerId, customer);
  }
};
