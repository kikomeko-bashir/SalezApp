// routes/auth.js - Authentication routes
// This file handles all user authentication endpoints (register, login, profile management)

// Import required packages and modules
const express = require('express');   // Express router
const jwt = require('jsonwebtoken');  // JSON Web Token for authentication
const User = require('../models/User'); // User model for database operations
const auth = require('../middleware/auth'); // Authentication middleware

// Create Express router instance
const router = express.Router();

// UTILITY FUNCTION: Generate JWT Token
// This function creates a signed JWT token containing the user's ID
const generateToken = (id) => {
  return jwt.sign(
    { id },                                      // Payload: user ID
    process.env.JWT_SECRET || 'your-secret-key', // Secret key for signing
    { expiresIn: '30d' }                        // Token expires in 30 days
  );
};

// ROUTE 1: USER REGISTRATION
// @route   POST /api/auth/register
// @desc    Register a new user account
// @access  Public (no authentication required)
router.post('/register', async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, password } = req.body;

    // INPUT VALIDATION
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // CHECK FOR EXISTING USER
    // Prevent duplicate email registrations
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // CREATE NEW USER
    // The password will be automatically hashed by the User model's pre-save middleware
    const user = await User.create({
      name,
      email,
      password
    });

    // GENERATE AUTHENTICATION TOKEN
    const token = generateToken(user._id);

    // SEND SUCCESS RESPONSE
    // Return user data (excluding password) and authentication token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    // ERROR HANDLING
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// ROUTE 2: USER LOGIN
// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // INPUT VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // FIND USER BY EMAIL
    // .select('+password') includes password field (normally excluded for security)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials' // Don't specify if email or password is wrong
      });
    }

    // VERIFY PASSWORD
    // Use the matchPassword method from User model to compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // GENERATE AUTHENTICATION TOKEN
    const token = generateToken(user._id);

    // SEND SUCCESS RESPONSE
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    // ERROR HANDLING
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ROUTE 3: GET CURRENT USER
// @route   GET /api/auth/me
// @desc    Get current authenticated user's information
// @access  Private (requires valid JWT token)
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware after verifying the JWT token
    const user = await User.findById(req.user.id);
    
    // SEND USER DATA
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    // ERROR HANDLING
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ROUTE 4: UPDATE USER PROFILE
// @route   PUT /api/auth/profile
// @desc    Update user profile information
// @access  Private (requires valid JWT token)
router.put('/profile', auth, async (req, res) => {
  try {
    // Extract update data from request body
    const { name, email } = req.body;
    
    // FIND AND UPDATE USER
    const user = await User.findById(req.user.id);
    
    // Update fields only if provided in request
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Save updated user to database
    await user.save();
    
    // SEND SUCCESS RESPONSE
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    // ERROR HANDLING
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Export the router to be used in server.js
module.exports = router;