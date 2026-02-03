const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['product', 'category', 'customer', 'order', 'system'],
    required: true 
  },
  action: { 
    type: String, 
    enum: ['created', 'updated', 'deleted', 'pending', 'completed', 'cancelled'],
    required: true 
  },
  entityId: { type: mongoose.Schema.Types.Mixed, required: true }, // ID of related entity
  entityName: { type: String, required: true }, // Name of related entity
  read: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
