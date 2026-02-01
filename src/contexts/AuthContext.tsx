import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { customerService, type Customer, type LoginRequest, type RegisterRequest } from '../services/customerService';

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateCustomer: (data: any) => Promise<Customer>;
  updateCustomerPreferences: (preferences: any) => Promise<void>;
  addAddress: (address: any) => Promise<any>;
  updateAddress: (addressId: string | number, address: any) => Promise<any>;
  deleteAddress: (addressId: string | number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { customer: Customer; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { customer: Customer; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        customer: action.payload.customer,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        customer: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        customer: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customer: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    customer: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const customerData = localStorage.getItem('customer');
    
    if (token && customerData) {
      try {
        const customer = JSON.parse(customerData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { customer, token } });
      } catch (error) {
        console.error('Error parsing stored customer data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await customerService.login(credentials);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('customer', JSON.stringify(response.customer));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const response = await customerService.register(userData);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('customer', JSON.stringify(response.customer));
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: response });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await customerService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('customer');
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateCustomer = async (data: any): Promise<Customer> => {
    if (!state.customer) {
      throw new Error('No customer logged in');
    }
    
    try {
      const updatedCustomer = await customerService.updateCustomer(state.customer.id, data);
      
      // Update stored customer data
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      return updatedCustomer;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update customer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateCustomerPreferences = async (preferences: any): Promise<void> => {
    if (!state.customer) {
      throw new Error('No customer logged in');
    }
    
    try {
      const updatedCustomer = await customerService.updateCustomer(state.customer.id, { preferences });
      
      // Update stored customer data
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update preferences';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const addAddress = async (address: any): Promise<any> => {
    if (!state.customer) {
      throw new Error('No customer logged in');
    }
    
    try {
      const newAddress = await customerService.addAddress(state.customer.id, address);
      
      // Update stored customer data
      const updatedCustomer = await customerService.getCustomer(state.customer.id);
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      return newAddress;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateAddress = async (addressId: string | number, address: any): Promise<any> => {
    if (!state.customer) {
      throw new Error('No customer logged in');
    }
    
    try {
      const updatedAddress = await customerService.updateAddress(state.customer.id, addressId, address);
      
      // Update stored customer data
      const updatedCustomer = await customerService.getCustomer(state.customer.id);
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      return updatedAddress;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteAddress = async (addressId: string | number): Promise<void> => {
    if (!state.customer) {
      throw new Error('No customer logged in');
    }
    
    try {
      await customerService.deleteAddress(state.customer.id, addressId);
      
      // Update stored customer data
      const updatedCustomer = await customerService.getCustomer(state.customer.id);
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateCustomer,
    updateCustomerPreferences,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
