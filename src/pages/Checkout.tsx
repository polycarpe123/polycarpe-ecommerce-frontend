import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { CreditCard, Truck, Shield, User } from 'lucide-react';
import { orderService, type CreateOrderData } from '../services/orderService';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useApp();
  
  const cartItems = cart?.items || [];
  
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  // Form states
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [shippingInfo, setShippingInfo] = useState({
    sameAsBilling: true,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Validation errors state (temporarily disabled for testing)
  const [errors /*, setErrors*/] = useState<{
    billing?: Record<string, string>;
    shipping?: Record<string, string>;
    payment?: Record<string, string>;
  }>({});

  const validateForm = (): boolean => {
    // TEMPORARILY DISABLED: All validation commented out for testing
    // const newErrors: typeof errors = {
    //   billing: {},
    //   shipping: {},
    //   payment: {}
    // };

    // // Validate billing information
    // if (!billingInfo.firstName.trim()) newErrors.billing!.firstName = 'First name is {/* required */}';
    // if (!billingInfo.lastName.trim()) newErrors.billing!.lastName = 'Last name is {/* required */}';
    // if (!billingInfo.email.trim()) newErrors.billing!.email = 'Email is {/* required */}';
    // else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) newErrors.billing!.email = 'Email is invalid';
    // if (!billingInfo.phone.trim()) newErrors.billing!.phone = 'Phone number is {/* required */}';
    // if (!billingInfo.address.trim()) newErrors.billing!.address = 'Street address is {/* required */}';
    // if (!billingInfo.city.trim()) newErrors.billing!.city = 'City is {/* required */}';
    // if (!billingInfo.state.trim()) newErrors.billing!.state = 'State is {/* required */}';
    // if (!billingInfo.zipCode.trim()) newErrors.billing!.zipCode = 'ZIP code is {/* required */}';

    // // Validate shipping information if different from billing
    // if (!shippingInfo.sameAsBilling) {
    //   if (!shippingInfo.firstName.trim()) newErrors.shipping!.firstName = 'First name is {/* required */}';
    //   if (!shippingInfo.lastName.trim()) newErrors.shipping!.lastName = 'Last name is {/* required */}';
    //   if (!shippingInfo.address.trim()) newErrors.shipping!.address = 'Street address is {/* required */}';
    //   if (!shippingInfo.city.trim()) newErrors.shipping!.city = 'City is {/* required */}';
    //   if (!shippingInfo.state.trim()) newErrors.shipping!.state = 'State is {/* required */}';
    //   if (!shippingInfo.zipCode.trim()) newErrors.shipping!.zipCode = 'ZIP code is {/* required */}';
    // }

    // // Validate payment information
    // if (paymentMethod === 'card') {
    //   if (!cardInfo.cardNumber.trim()) newErrors.payment!.cardNumber = 'Card number is {/* required */}';
    //   else if (!/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, ''))) newErrors.payment!.cardNumber = 'Card number is invalid';
    //   if (!cardInfo.cardName.trim()) newErrors.payment!.cardName = 'Cardholder name is {/* required */}';
    //   if (!cardInfo.expiryDate.trim()) newErrors.payment!.expiryDate = 'Expiry date is {/* required */}';
    //   else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardInfo.expiryDate)) newErrors.payment!.expiryDate = 'Expiry date is invalid (MM/YY)';
    //   if (!cardInfo.cvv.trim()) newErrors.payment!.cvv = 'CVV is {/* required */}';
    //   else if (!/^\d{3,4}$/.test(cardInfo.cvv)) newErrors.payment!.cvv = 'CVV is invalid';
    // }

    // setErrors(newErrors);
    // return Object.keys(newErrors.billing || {}).length === 0 && 
    //        Object.keys(newErrors.shipping || {}).length === 0 && 
    //        Object.keys(newErrors.payment || {}).length === 0;

    // TEMPORARY: Always return true for testing
    return true;
  };

  const handleInputChange = (section: 'billing' | 'shipping' | 'card', field: string, value: string) => {
    if (section === 'billing') {
      setBillingInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setCardInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Prepare order data
        const orderData: CreateOrderData = {
          items: cartItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            color: item.color,
            size: item.size
          })),
          subtotal,
          tax,
          shipping,
          total,
          billingInfo: {
            firstName: billingInfo.firstName,
            lastName: billingInfo.lastName,
            email: billingInfo.email,
            phone: billingInfo.phone,
            address: billingInfo.address,
            apartment: billingInfo.apartment,
            city: billingInfo.city,
            state: billingInfo.state,
            zipCode: billingInfo.zipCode,
            country: billingInfo.country
          },
          shippingInfo: shippingInfo.sameAsBilling ? {
            firstName: billingInfo.firstName,
            lastName: billingInfo.lastName,
            address: billingInfo.address,
            apartment: billingInfo.apartment,
            city: billingInfo.city,
            state: billingInfo.state,
            zipCode: billingInfo.zipCode,
            country: billingInfo.country
          } : {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            apartment: shippingInfo.apartment,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country
          },
          paymentMethod,
          paymentInfo: paymentMethod === 'card' ? {
            cardNumber: cardInfo.cardNumber,
            cardName: cardInfo.cardName,
            expiryDate: cardInfo.expiryDate
          } : undefined
        };

        // Create order in database
        const order = await orderService.createOrder(orderData);
        
        console.log('Order created successfully:', order);
        console.log('Order Number:', order.orderNumber);
        
        // Clear the cart
        clearCart();
        
        // Show success message with order number
        alert(`Order placed successfully! Order Number: ${order.orderNumber}. Redirecting to home...`);
        
        // Redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
      }
    } else {
      // Scroll to first error (disabled for testing)
      // const firstErrorField = document.querySelector('.border-red-500');
      // if (firstErrorField) {
      //   firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container px-4 max-w-7xl mx-auto py-8'>
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link> / 
          <Link to="/cart" className="hover:text-blue-600">Cart</Link> / 
          <span className="text-gray-900">Checkout</span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Billing Information */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <User className="text-blue-600" size={20} />
                <h2 className='text-xl font-bold text-gray-900'>Billing Information</h2>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                  <input
                    type="text"
                    value={billingInfo.firstName}
                    onChange={(e) => handleInputChange('billing', 'firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.firstName && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.firstName}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                  <input
                    type="text"
                    value={billingInfo.lastName}
                    onChange={(e) => handleInputChange('billing', 'lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.lastName && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.lastName}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.email}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                  <input
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.phone && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.phone}</p>
                  )}
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Street Address</label>
                  <input
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.address && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.address}</p>
                  )}
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Apartment, Suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={billingInfo.apartment}
                    onChange={(e) => handleInputChange('billing', 'apartment', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                  <input
                    type="text"
                    value={billingInfo.city}
                    onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.city && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.city}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                  <input
                    type="text"
                    value={billingInfo.state}
                    onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.state && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.state}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>ZIP Code</label>
                  <input
                    type="text"
                    value={billingInfo.zipCode}
                    onChange={(e) => handleInputChange('billing', 'zipCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billing?.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billing?.zipCode && (
                    <p className='text-red-500 text-sm mt-1'>{errors.billing.zipCode}</p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                  <select
                    value={billingInfo.country}
                    onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <Truck className="text-blue-600" size={20} />
                <h2 className='text-xl font-bold text-gray-900'>Shipping Information</h2>
              </div>
              
              <div className='mb-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type="checkbox"
                    checked={shippingInfo.sameAsBilling}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, sameAsBilling: e.target.checked }))}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>Same as billing address</span>
                </label>
              </div>

              {!shippingInfo.sameAsBilling && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  {/* Additional shipping fields... */}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <CreditCard className="text-blue-600" size={20} />
                <h2 className='text-xl font-bold text-gray-900'>Payment Method</h2>
              </div>
              
              <div className='space-y-4 mb-6'>
                <label className='flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-4 h-4 text-blue-600'
                  />
                  <CreditCard size={20} className="text-gray-600" />
                  <span className='font-medium'>Credit/Debit Card</span>
                </label>
                
                <label className='flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-4 h-4 text-blue-600'
                  />
                  <div className='w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold'>P</div>
                  <span className='font-medium'>PayPal</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChange={(e) => handleInputChange('card', 'cardNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                    {errors.payment?.cardNumber && (
                      <p className='text-red-500 text-sm mt-1'>{errors.payment.cardNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardInfo.cardName}
                      onChange={(e) => handleInputChange('card', 'cardName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.payment?.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                    {errors.payment?.cardName && (
                      <p className='text-red-500 text-sm mt-1'>{errors.payment.cardName}</p>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.cvv}
                        onChange={(e) => handleInputChange('card', 'cvv', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.payment?.cvv && (
                        <p className='text-red-500 text-sm mt-1'>{errors.payment.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className='w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg'
            >
              Place Order • ${total.toFixed(2)}
            </button>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden sticky top-4'>
              <div className='p-6 border-b'>
                <h2 className='text-xl font-bold text-gray-900'>Order Summary</h2>
              </div>
              
              {/* Cart Items */}
              <div className='p-6 border-b max-h-64 overflow-y-auto'>
                {cartItems.map((item: any) => (
                  <div key={item.id} className='flex gap-3 mb-4 last:mb-0'>
                    <div className='w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0'>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-lg' />
                      ) : (
                        <div className='w-full h-full bg-gray-200 rounded-lg' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-sm font-medium text-gray-900 line-clamp-2'>{item.name}</h4>
                      <p className='text-xs text-gray-500'>
                        {item.color && <span>{item.color}</span>}
                        {item.color && item.size && <span> • </span>}
                        {item.size && <span>{item.size}</span>}
                      </p>
                      <p className='text-sm font-medium text-gray-900'>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Summary */}
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
                </div>
              </div>
              
              {/* Security Badge */}
              <div className='p-6 border-t bg-gray-50'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Shield size={16} className="text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
