const express = require('express');
const Category = require('../models/Category.cjs');
const Notification = require('../models/Notification.cjs');
const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  try {
    const { status, includeProductCount } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    let categories = await Category.find(query);

    if (includeProductCount === 'true') {
      // In a real app, you would count products for each category
      categories = categories.map(cat => ({
        ...cat.toObject(),
        productCount: Math.floor(Math.random() * 50) // Mock count for now
      }));
    }

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create new category
router.post('/', (req, res) => {
  console.log('Categories POST endpoint hit');
  try {
    console.log('Received category data:', req.body);
    
    const category = new Category(req.body);
    
    // Validate before saving
    const validationError = category.validateSync();
    if (validationError) {
      console.error('Category validation error:', validationError);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.keys(validationError.errors).map(key => ({
          field: key,
          message: validationError.errors[key].message
        }))
      });
    }
    
    category.save().then(async (savedCategory) => {
      console.log('Category saved successfully:', savedCategory);
      
      // Create notification for new category
      try {
        const notification = new Notification({
          title: 'New Category Created',
          message: `Category "${savedCategory.name}" has been added`,
          type: 'category',
          action: 'created',
          entityId: savedCategory._id,
          entityName: savedCategory.name,
          priority: 'medium'
        });
        await notification.save();
        console.log('Category notification created');
      } catch (notifError) {
        console.error('Error creating category notification:', notifError);
      }
      
      res.status(201).json(savedCategory);
    }).catch((error) => {
      console.error('Save category error:', error);
      
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
    console.error('Create category error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
