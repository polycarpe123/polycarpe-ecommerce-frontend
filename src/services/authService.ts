// Auth Service API
import api from './api';

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string | number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth API calls
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data; // Backend returns { success: true, data: AuthResponse }
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data; // Backend returns { success: true, data: AuthResponse }
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data; // Backend returns { success: true, data: User }
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data.data; // Backend returns { success: true, data: User }
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put('/auth/password', data);
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  // Social login (Google, Facebook, etc.)
  socialLogin: async (provider: string, token: string): Promise<AuthResponse> => {
    const response = await api.post(`/auth/social/${provider}`, { token });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification', { email });
  },
};
