// Global App Context
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface AppContextType {
  // Auth
  user: any;
  login: any;
  register: any;
  logout: any;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  
  // Cart
  cart: any;
  addToCart: any;
  updateQuantity: any;
  removeFromCart: any;
  clearCart: any;
  getCartCount: () => number;
  getCartTotal: () => number;
  cartLoading: boolean;
  cartError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useAuth();

  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const value: AppContextType = {
    // Auth
    user,
    login,
    register,
    logout,
    isAuthenticated,
    authLoading,
    authError,
    
    // Cart
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    cartLoading,
    cartError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
