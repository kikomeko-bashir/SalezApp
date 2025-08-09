// models/User.js - User database model/schema
// This file defines the structure of user data in MongoDB and includes validation

// Import required packages
const mongoose = require('mongoose'); // MongoDB object modeling library
const bcrypt = require('bcryptjs');   // Library for hashing passwords

// Define the user schema - this describes the structure of user documents in MongoDB
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,                    // Data type is string
    required: [true, 'Name is required'], // Field is mandatory with custom error message
    trim: true,                      // Remove whitespace from beginning and end
    maxlength: 50                    // Maximum 50 characters allowed
  },
  
  // User's email address (used for login)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,                    // No two users can have the same email
    lowercase: true,                 // Convert to lowercase before saving
    // Regular expression to validate email format
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // User's password (will be hashed before storing)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6                     // Minimum 6 characters required
  },
  
  // Optional profile picture URL
  avatar: {
    type: String,
    default: null                    // No avatar by default
  },
  
  // Whether user has verified their email
  isVerified: {
    type: Boolean,
    default: false                   // Users start as unverified
  },
  
  // Fields for password reset functionality (for future use)
  resetPasswordToken: String,        // Token sent to user's email for password reset
  resetPasswordExpire: Date          // When the reset token expires
}, {
  // Add createdAt and updatedAt timestamps automatically
  timestamps: true
});

// PRE-SAVE MIDDLEWARE
// This function runs before saving a user to the database
// It automatically hashes the password if it has been modified
userSchema.pre('save', async function(next) {
  // If password hasn't been modified, skip hashing
  if (!this.isModified('password')) {
    next();
  }
  
  // Generate salt (random data) for hashing - higher number = more secure but slower
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// INSTANCE METHODS
// This method compares a plain text password with the hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  // bcrypt.compare safely compares plain text with hashed password
  // Returns true if passwords match, false otherwise
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
// This creates a collection called 'users' in MongoDB (mongoose pluralizes 'User')
module.exports = mongoose.model('User', userSchema);