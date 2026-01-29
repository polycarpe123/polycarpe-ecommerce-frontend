import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

const Cart: React.FC = () => {
  // Sample cart data - in real app, this would come from state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Men Hooded Navy Blue & Grey Track Jacket",
      price: 70.00,
      quantity: 1,
      image: "https://picsum.photos/600/400?random=401",
      color: "Navy Blue",
      size: "M"
    },
    {
      id: 2,
      name: "Women Off White Printed Blouse",
      price: 47.00,
      quantity: 2,
      image: "https://picsum.photos/600/400?random=402",
      color: "Off White",
      size: "S"
    }
  ]);

  const handleUpdateQuantity = (id: string | number, quantity: number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== numId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === numId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleRemoveItem = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    setCartItems(cartItems.filter((item) => item.id !== numId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  
  const shipping = subtotal > 200 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container px-4 max-w-7xl mx-auto py-8'>
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link> / 
          <span className="text-gray-900">Cart</span>
        </nav>

        {cartItems.length === 0 ? (
          <div className='text-center py-16'>
            <div className='max-w-md mx-auto'>
              <div className='bg-white rounded-lg shadow-sm p-8'>
                <div className='text-6xl mb-4'>🛒</div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Shopping cart is empty!</h2>
                <p className='text-gray-600 mb-8'>Looks like you haven't added anything to your cart yet.</p>
                <Link 
                  to="/"
                  className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <ArrowLeft size={20} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='p-6 border-b'>
                  <h1 className='text-2xl font-bold text-gray-900'>Shopping Cart ({cartItems.length} items)</h1>
                </div>
                
                <div className='divide-y'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='p-6'>
                      <div className='flex gap-4'>
                        {/* Product Image */}
                        <div className='w-24 h-24 bg-gray-200 rounded-lg shrink-0'>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-lg' />
                          ) : (
                            <div className='w-full h-full bg-gray-200 rounded-lg' />
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className='flex-1'>
                          <div className='flex justify-between mb-2'>
                            <h3 className='font-medium text-gray-900 line-clamp-2'>{item.name}</h3>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className='text-gray-400 hover:text-red-500 transition-colors'
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          {/* Product Options */}
                          <div className='flex gap-4 text-sm text-gray-600 mb-3'>
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                          
                          {/* Price and Quantity */}
                          <div className='flex justify-between items-end'>
                            <div className='text-right'>
                              <p className='font-bold text-lg text-gray-900'>${item.price.toFixed(2)}</p>
                              <p className='text-sm text-gray-500'>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className='flex items-center gap-2 border rounded-lg'>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors'
                              >
                                <Minus size={16} />
                              </button>
                              <span className='w-12 text-center font-medium'>{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors'
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Continue Shopping */}
                <div className='p-6 border-t'>
                  <Link 
                    to="/"
                    className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium'
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-lg shadow-sm overflow-hidden sticky top-4'>
                <div className='p-6 border-b'>
                  <h2 className='text-xl font-bold text-gray-900'>Order Summary</h2>
                </div>
                
                <div className='p-6 space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-medium'>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-medium'>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tax</span>
                    <span className='font-medium'>${tax.toFixed(2)}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-sm'>
                      <p className='text-green-800 font-medium'>Add ${(200 - subtotal).toFixed(2)} more for FREE shipping!</p>
                    </div>
                  )}
                  
                  <div className='border-t pt-4'>
                    <div className='flex justify-between mb-4'>
                      <span className='text-lg font-bold text-gray-900'>Total</span>
                      <span className='text-lg font-bold text-gray-900'>${total.toFixed(2)}</span>
                    </div>
                    
                    <Link 
                      to="/checkout"
                      className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium'
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className='p-6 border-t'>
                  <h3 className='font-medium text-gray-900 mb-3'>Coupon Code</h3>
                  <div className='flex gap-2'>
                    <input
                      type="text"
                      placeholder='Enter coupon code'
                      className='flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button className='px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors'>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;