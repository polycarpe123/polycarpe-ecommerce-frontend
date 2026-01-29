// Custom hook for authentication
import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Disabled automatic auth check - user must explicitly login
  // This prevents loading issues on app startup

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
};
