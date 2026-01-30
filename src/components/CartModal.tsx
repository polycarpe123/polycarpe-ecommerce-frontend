import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string | number, quantity: number) => void;
  onRemoveItem: (id: string | number) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
  const subtotal = (items && Array.isArray(items)) ? items.reduce(
    (sum, item) => sum + (isNaN(item.price) ? 0 : (item.price || 0) * (item.quantity || 0)),
    0,
  ) : 0;
  const shippingThreshold = 200;
  const progressPercentage = (subtotal / shippingThreshold) * 100;
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">MY CART</h2>
          <button onClick={onClose} className="text-white text-xl">×</button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 mb-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                      >
                        −
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Price */}
                    <p className="font-bold text-gray-900">
                      ${isNaN(item.price * item.quantity) ? '0.00' : (item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal and Actions */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-700">SUBTOTAL:</span>
              <span className="font-bold text-lg">${isNaN(subtotal) ? '0.00' : subtotal.toFixed(2)}</span>
            </div>

            {/* Free Shipping Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Free Shipping Progress</span>
                <span className="text-sm font-medium text-blue-600">{Math.min(progressPercentage, 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              {remainingForFreeShipping > 0 ? (
                <p className="text-sm text-gray-600 mt-2">
                  Spend ${remainingForFreeShipping.toFixed(2)} to get free shipping
                </p>
              ) : (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ You qualified for FREE shipping!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button 
                onClick={handleViewCart}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                VIEW CART
              </button>
              <button 
                onClick={handleCheckout}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
