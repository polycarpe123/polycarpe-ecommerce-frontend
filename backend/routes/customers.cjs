const express = require('express');
const Customer = require('../models/Customer.cjs');
const Order = require('../models/Order.cjs');
const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers with order information (admin)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const customers = await Customer.find(query)
      .select('-password') // Exclude password from results
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get order information for each customer
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ 
          $or: [
            { customerEmail: customer.email },
            { customerId: customer._id }
          ]
        });

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const lastOrderDate = orders.length > 0 ? 
          new Date(Math.max(...orders.map(o => new Date(o.createdAt)))) : null;

        return {
          ...customer.toObject(),
          totalOrders,
          totalSpent,
          lastOrderDate,
          orders: orders.map(order => ({
            id: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            itemCount: order.items ? order.items.length : 0
          }))
        };
      })
    );

    const total = await Customer.countDocuments(query);

    res.json({
      customers: customersWithOrders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/customers/stats
// @desc    Get customer statistics
router.get('/stats', async (req, res) => {
  try {
    const customers = await Customer.find();
    const activeCustomers = customers.filter(c => c.isActive);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const stats = {
      totalCustomers: customers.length,
      activeCustomers: activeCustomers.length,
      newCustomersThisMonth: customers.filter(c => new Date(c.createdAt) > oneMonthAgo).length,
      totalOrders: 0, // TODO: Calculate from orders
      averageOrderValue: 0, // TODO: Calculate from orders
      customerRetentionRate: 85 // Mock data
    };

    res.json(stats);
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
