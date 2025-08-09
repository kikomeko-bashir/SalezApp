// server.js - Updated main application entry point with listing routes
// This file sets up the Express server, connects to MongoDB, and configures middleware

// Import required packages
const express = require('express');        // Web framework for Node.js
const mongoose = require('mongoose');      // MongoDB object modeling library
const cors = require('cors');              // Cross-Origin Resource Sharing middleware
const dotenv = require('dotenv');          // Load environment variables from .env file

// Import route handlers
const authRoutes = require('./routes/auth');       // Authentication routes
const listingRoutes = require('./routes/listings'); // Listing routes (NEW)

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// MIDDLEWARE SETUP
// Enable CORS - allows your React Native app to make requests to this server
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies - enables the server to read JSON data from request bodies
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

// Parse URL-encoded bodies - for form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// DATABASE CONNECTION
// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-app', {
  useNewUrlParser: true,    // Use new URL parser (removes deprecation warning)
  useUnifiedTopology: true, // Use new connection management engine
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Exit if can't connect to database
});

// ROUTE SETUP
// Mount authentication routes at /api/auth
app.use('/api/auth', authRoutes);

// Mount listing routes at /api/listings (NEW)
app.use('/api/listings', listingRoutes);

// HEALTH CHECK ROUTES
// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shopping App API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      listings: '/api/listings'
    }
  });
});

// API status endpoint with database connection info
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GLOBAL ERROR HANDLER
// Catch any unhandled errors and return a proper response
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  
  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    message: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// 404 HANDLER
// Handle routes that don't exist
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/status',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/listings',
      'POST /api/listings',
      'GET /api/listings/:id'
    ]
  });
});

// SERVER STARTUP
// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📱 Network: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   - Authentication: /api/auth');
  console.log('   - Listings: /api/listings');
  console.log('   - Health check: /');
  console.log('   - Status: /api/status');
  console.log('192.168.1.113');
});

// GRACEFUL SHUTDOWN
// Handle app termination gracefully
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err);
  mongoose.connection.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  mongoose.connection.close(() => {
    process.exit(1);
  });
});