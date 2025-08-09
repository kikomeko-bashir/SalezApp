// middleware/auth.js - Authentication middleware
// This middleware protects routes by verifying JWT tokens
// It runs before protected route handlers to ensure user is authenticated

// Import required packages and models
const jwt = require('jsonwebtoken'); // For verifying JWT tokens
const User = require('../models/User'); // User model to fetch user data

// AUTHENTICATION MIDDLEWARE FUNCTION
// This function checks if a request has a valid JWT token
// If valid, it adds user information to the request object
// If invalid, it returns an error response
const auth = async (req, res, next) => {
  try {
    let token;

    // EXTRACT TOKEN FROM REQUEST HEADER
    // Check if Authorization header exists and starts with 'Bearer'
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token by splitting "Bearer token" and taking the second part
      token = req.headers.authorization.split(' ')[1];
    }

    // CHECK IF TOKEN EXISTS
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    try {
      // VERIFY AND DECODE TOKEN
      // jwt.verify() checks if token is valid and not expired
      // If valid, it returns the decoded payload (which contains user ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // FETCH USER FROM DATABASE
      // Using the user ID from the decoded token, get full user information
      req.user = await User.findById(decoded.id);
      
      // CHECK IF USER STILL EXISTS
      // User might have been deleted after token was created
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // AUTHENTICATION SUCCESSFUL
      // Call next() to proceed to the actual route handler
      // req.user is now available in the route handler
      next();
      
    } catch (error) {
      // TOKEN VERIFICATION FAILED
      // This happens if:
      // - Token is malformed
      // - Token has expired
      // - Token was signed with different secret
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
    
  } catch (error) {
    // UNEXPECTED SERVER ERROR
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in auth middleware'
    });
  }
};

// HOW TO USE THIS MIDDLEWARE:
// 1. Import this middleware in your route files
// 2. Add it as the second parameter in route definitions:
//    router.get('/protected-route', auth, (req, res) => { ... })
// 3. The route handler will only execute if authentication succeeds
// 4. Inside the route handler, you can access user data via req.user

module.exports = auth;