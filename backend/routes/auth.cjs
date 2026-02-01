const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer.cjs');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, gender } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
    const customer = new Customer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      gender
    });

    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        addresses: customer.addresses,
        preferences: customer.preferences,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        isActive: customer.isActive,
        isGuest: customer.isGuest
      },
      token,
      expiresIn: 604800 // 7 days in seconds
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login customer
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for customer
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    customer.lastLoginAt = new Date();
    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        addresses: customer.addresses,
        preferences: customer.preferences,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        isActive: customer.isActive,
        isGuest: customer.isGuest,
        lastLoginAt: customer.lastLoginAt
      },
      token,
      expiresIn: 604800 // 7 days in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout customer
router.post('/logout', (req, res) => {
  // In a real app, you might want to invalidate the token
  // For now, we'll just return success
  res.json({ message: 'Logged out successfully' });
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // In a real app, you would send an email with reset link
    // For now, we'll just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
