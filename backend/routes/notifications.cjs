const express = require('express');
const Notification = require('../models/Notification.cjs');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for admin
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const notifications = await Notification.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ read: false });

    res.json({
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notifications/count
// @desc    Get unread notification count
router.get('/count', async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ read: false });
    res.json({ unreadCount });
  } catch (error) {
    console.error('Get notification count error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification (internal use)
router.post('/', async (req, res) => {
  try {
    const { title, message, type, action, entityId, entityName, priority = 'medium' } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      action,
      entityId,
      entityName,
      priority
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/notifications
// @desc    Clear all notifications
router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
