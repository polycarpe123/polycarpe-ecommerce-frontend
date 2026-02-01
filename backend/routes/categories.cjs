const express = require('express');
const Category = require('../models/Category.cjs');
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
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
