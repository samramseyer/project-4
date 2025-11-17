const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  color: {
    type: String,
    default: '#007bff'
  },
  icon: {
    type: String,
    default: '💬'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
