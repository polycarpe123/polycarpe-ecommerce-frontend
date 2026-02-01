const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say'
  },
  addresses: [{
    type: { type: String, enum: ['billing', 'shipping'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    newsletter: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' }
  },
  isActive: { type: Boolean, default: true },
  isGuest: { type: Boolean, default: false },
  lastLoginAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
