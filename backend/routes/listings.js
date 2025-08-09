// routes/listings.js - API routes for product listings
// This file handles all CRUD operations for listings

const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

// ROUTE 1: CREATE NEW LISTING
// @route   POST /api/listings
// @desc    Create a new product listing
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    // Extract listing data from request body
    const { title, description, price, category, images, location } = req.body;

    // INPUT VALIDATION
    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and category are required'
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    if (price < 0 || price > 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Price must be between 0 and 1,000,000'
      });
    }

    // CREATE NEW LISTING
    // req.user.id is set by the auth middleware
    const listingData = {
      title: title.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category,
      images,
      userId: req.user.id, // From authenticated user
      location: location || null
    };

    const listing = await Listing.create(listingData);

    // POPULATE USER INFORMATION
    // Get the created listing with user details
    const populatedListing = await Listing.findById(listing._id)
      .populate('userId', 'name email');

    console.log(`✅ New listing created: ${listing.title} by ${req.user.id}`);

    // SEND SUCCESS RESPONSE
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: populatedListing
    });

  } catch (error) {
    console.error('❌ Create listing error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating listing'
    });
  }
});

// ROUTE 2: GET ALL ACTIVE LISTINGS
// @route   GET /api/listings
// @desc    Get all active listings with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    // EXTRACT QUERY PARAMETERS
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const userId = req.query.userId;

    let query = { status: 'active' };

    // FILTER BY CATEGORY if provided
    if (category) {
      query['category.value'] = parseInt(category);
    }

    // FILTER BY USER if provided
    if (userId) {
      query.userId = userId;
    }

    // CALCULATE PAGINATION
    const skip = (page - 1) * limit;

    // GET LISTINGS with pagination
    const listings = await Listing.find(query)
      .populate('userId', 'name email') // Include user info
      .sort({ createdAt: -1 })         // Newest first
      .skip(skip)
      .limit(limit);

    // GET TOTAL COUNT for pagination info
    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);

    console.log(`📄 Retrieved ${listings.length} listings (page ${page})`);

    // SEND RESPONSE
    res.json({
      success: true,
      listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalListings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching listings'
    });
  }
});

// ROUTE 3: GET SINGLE LISTING BY ID
// @route   GET /api/listings/:id
// @desc    Get a specific listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listingId = req.params.id;

    // VALIDATE MONGODB OBJECT ID
    if (!listingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    // FIND LISTING BY ID
    const listing = await Listing.findById(listingId)
      .populate('userId', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // INCREMENT VIEW COUNT (don't wait for completion)
    listing.incrementViews().catch(err => 
      console.log('Error incrementing views:', err)
    );

    console.log(`👁️ Listing viewed: ${listing.title}`);

    // SEND RESPONSE
    res.json({
      success: true,
      listing
    });

  } catch (error) {
    console.error('❌ Get listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching listing'
    });
  }
});

// ROUTE 4: UPDATE LISTING
// @route   PUT /api/listings/:id
// @desc    Update a listing (only by owner)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const listingId = req.params.id;
    const updates = req.body;

    // FIND LISTING
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // CHECK OWNERSHIP
    if (!listing.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // VALIDATE UPDATES
    const allowedUpdates = ['title', 'description', 'price', 'category', 'images', 'status'];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid update fields'
      });
    }

    // APPLY UPDATES
    updateKeys.forEach(key => {
      if (updates[key] !== undefined) {
        listing[key] = updates[key];
      }
    });

    // SAVE UPDATED LISTING
    await listing.save();

    // GET UPDATED LISTING WITH USER INFO
    const updatedListing = await Listing.findById(listingId)
      .populate('userId', 'name email');

    console.log(`✏️ Listing updated: ${listing.title}`);

    // SEND RESPONSE
    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing
    });

  } catch (error) {
    console.error('❌ Update listing error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating listing'
    });
  }
});

// ROUTE 5: DELETE LISTING
// @route   DELETE /api/listings/:id
// @desc    Delete a listing (only by owner)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const listingId = req.params.id;

    // FIND LISTING
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // CHECK OWNERSHIP
    if (!listing.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    // DELETE LISTING
    await Listing.findByIdAndDelete(listingId);

    console.log(`🗑️ Listing deleted: ${listing.title}`);

    // SEND RESPONSE
    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting listing'
    });
  }
});

// ROUTE 6: GET USER'S LISTINGS
// @route   GET /api/listings/user/me
// @desc    Get current user's listings
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    // GET USER'S LISTINGS
    const listings = await Listing.findByUser(req.user.id)
      .populate('userId', 'name email');

    console.log(`📋 Retrieved ${listings.length} listings for user ${req.user.id}`);

    // SEND RESPONSE
    res.json({
      success: true,
      listings,
      count: listings.length
    });

  } catch (error) {
    console.error('❌ Get user listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user listings'
    });
  }
});

// ROUTE 7: MARK LISTING AS SOLD
// @route   PATCH /api/listings/:id/sold
// @desc    Mark listing as sold
// @access  Private (owner only)
router.patch('/:id/sold', auth, async (req, res) => {
  try {
    const listingId = req.params.id;

    // FIND LISTING
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // CHECK OWNERSHIP
    if (!listing.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // MARK AS SOLD
    await listing.markAsSold();

    console.log(`💰 Listing marked as sold: ${listing.title}`);

    // SEND RESPONSE
    res.json({
      success: true,
      message: 'Listing marked as sold',
      listing
    });

  } catch (error) {
    console.error('❌ Mark as sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating listing status'
    });
  }
});

module.exports = router;