import React from 'react';
import { CheckCircle, Package, Truck, Home, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: number;
  itemCount: number;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  itemCount
}) => {
  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4 animate-bounce">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="text-blue-600 mr-2" size={20} />
              <span className="font-semibold text-gray-900">Order Details</span>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-mono font-bold text-blue-600">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                Processing
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center text-gray-700">
            <Truck size={20} className="mr-2 text-gray-600" />
            <div>
              <p className="text-sm font-medium">Estimated Delivery</p>
              <p className="text-xs text-gray-500">3-5 business days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinueShopping}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <Home size={20} className="mr-2" />
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
