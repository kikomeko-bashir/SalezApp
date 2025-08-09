// This file defines the structure of product listings in MongoDB

const mongoose = require('mongoose');

// Define the listing schema - describes the structure of listing documents in MongoDB
const listingSchema = new mongoose.Schema({
  // Basic listing information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,                          // Remove whitespace
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [1000000, 'Price cannot exceed 1,000,000']
  },
  
  // Category information
  category: {
    type: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      backgroundColor: String,           // Color for category display
      Icon: String                       // Icon name for category
    },
    required: [true, 'Category is required']
  },
  
  // Image URLs - array to support multiple images
  images: [{
    type: String,                        // URL to image file
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  
  // User who created this listing
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                         // Reference to User model
    required: [true, 'User ID is required']
  },
  
  // Location information (from useLocation hook)
  location: {
    latitude: {
      type: Number,
      min: [-90, 'Invalid latitude'],
      max: [90, 'Invalid latitude']
    },
    longitude: {
      type: Number,
      min: [-180, 'Invalid longitude'],
      max: [180, 'Invalid longitude']
    }
  },
  
  // Listing status
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'], // Only allow these values
    default: 'active'
  },
  
  // View count for analytics
  views: {
    type: Number,
    default: 0
  },
  
  // Favorited by users (for future wishlist feature)
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  // Add createdAt and updatedAt timestamps automatically
  timestamps: true
});

// INDEXES for better query performance
// Index on userId for finding user's listings
listingSchema.index({ userId: 1 });

// Index on category for filtering by category
listingSchema.index({ 'category.value': 1 });

// Index on status and createdAt for getting active listings
listingSchema.index({ status: 1, createdAt: -1 });

// Compound index for location-based queries (for future nearby listings feature)
listingSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// VIRTUAL FIELDS
// Virtual field to populate user information when needed
listingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// INSTANCE METHODS
// Method to increment view count
listingSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to check if user owns this listing
listingSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Method to mark listing as sold
listingSchema.methods.markAsSold = function() {
  this.status = 'sold';
  return this.save();
};

// STATIC METHODS
// Static method to find listings by category
listingSchema.statics.findByCategory = function(categoryValue) {
  return this.find({ 
    'category.value': categoryValue,
    status: 'active'
  }).sort({ createdAt: -1 });
};

// Static method to find user's listings
listingSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find active listings with pagination
listingSchema.statics.findActiveListings = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email'); // Include user name and email
};

// PRE-SAVE MIDDLEWARE
// Ensure at least one image is provided
listingSchema.pre('save', function(next) {
  if (this.isNew && (!this.images || this.images.length === 0)) {
    const error = new Error('At least one image is required');
    return next(error);
  }
  next();
});

// Export the Listing model
// This creates a collection called 'listings' in MongoDB
module.exports = mongoose.model('Listing', listingSchema);