import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../services/productService';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  showQuantity?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  onCartOpen?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  showQuantity = false,
  size = 'md',
  variant = 'primary',
  onCartOpen
}) => {
  const { addToCart, loading } = useCart();
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    console.log('Add to cart button clicked, product:', product);
    
    if (!product) {
      console.log('No product available');
      return;
    }
    
    try {
      setIsAdding(true);
      setShowSuccess(false);
      console.log('Starting add to cart process...');
      
      // Create cart item with the structure expected by CartContext
      const cartItem = {
        productId: product.id,
        quantity: itemQuantity,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-image.jpg',
        category: product.category || 'General'
      };
      
      console.log('Cart item created:', cartItem);
      
      // Add to cart using the CartContext
      await addToCart(cartItem);
      console.log('Item added to cart successfully');
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Open cart modal after a short delay to ensure cart is updated
      if (onCartOpen) {
        setTimeout(() => {
          onCartOpen();
        }, 100);
      }
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  };

  const baseClasses = `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <div className={`flex items-center gap-2 ${showQuantity ? 'flex-col sm:flex-row' : ''}`}>
      {showQuantity && (
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            disabled={isAdding}
          >
            −
          </button>
          <span className="px-3 py-2 min-w-[3rem] text-center font-medium">
            {itemQuantity}
          </span>
          <button
            onClick={() => setItemQuantity(itemQuantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            disabled={isAdding}
          >
            +
          </button>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || loading}
          className={`${baseClasses} ${(isAdding || loading) ? disabledClasses : ''}`}
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : showSuccess ? (
            '✓ Added!'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToCartButton;
