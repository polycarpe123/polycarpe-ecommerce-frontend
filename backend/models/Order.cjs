const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  productId: { type: mongoose.Schema.Types.Mixed, required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  color: { type: String },
  size: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.Mixed },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  items: [orderItemSchema],
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  trackingNumber: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
