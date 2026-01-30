import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => {
      if (!prev.find(w => w.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id);
      if (exists) {
        return prev.filter(w => w.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const isInWishlist = useCallback((id: number) => {
    return wishlist.some(item => item.id === id);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
