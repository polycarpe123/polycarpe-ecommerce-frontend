const express = require('express');
const Product = require('../models/Product.cjs');
const Notification = require('../models/Notification.cjs');
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      onSale,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (onSale === 'true') {
      query.oldPrice = { $exists: true, $ne: null };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create new product
router.post('/', (req, res) => {
  console.log('Products POST endpoint hit');
  try {
    console.log('Received product data:', req.body);
    
    const product = new Product(req.body);
    
    // Validate before saving
    const validationError = product.validateSync();
    if (validationError) {
      console.error('Product validation error:', validationError);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.keys(validationError.errors).map(key => ({
          field: key,
          message: validationError.errors[key].message
        }))
      });
    }
    
    product.save().then((savedProduct) => {
      console.log('Product saved successfully:', savedProduct);
      
      // Create notification for new product
      const notification = new Notification({
        title: 'New Product Created',
        message: `Product "${savedProduct.name}" has been added to the catalog`,
        type: 'product',
        action: 'created',
        entityId: savedProduct._id,
        entityName: savedProduct.name,
        priority: 'medium'
      });
      
      notification.save().then(() => {
        console.log('Product notification created');
      }).catch((notifError) => {
        console.error('Error creating product notification:', notifError);
      });
      
      res.status(201).json(savedProduct);
    }).catch((error) => {
      console.error('Save product error:', error);
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ 
          message: `${field} already exists`, 
          field: field 
        });
      }
      
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
