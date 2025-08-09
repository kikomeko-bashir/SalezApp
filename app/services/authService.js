// This file handles all API calls related to user authentication

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// CONFIGURATION
// Replace with your backend URL (use your computer's IP address for real device testing)
const API_BASE_URL = 'http://192.168.1.113:5000/api'; // For emulator
// const API_BASE_URL = 'http://192.168.1.100:5000/api'; // For real device (replace with your IP)

// Storage keys for AsyncStorage
const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
// Automatically add authentication token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// Handle common response scenarios (like token expiration)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored data
      await clearAuthData();
    }
    return Promise.reject(error);
  }
);

// AUTHENTICATION FUNCTIONS

/**
 * Register a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - User data and token
 */
export const register = async (userData) => {
  try {
    console.log('Registering user:', userData.email);
    
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.data.success && response.data.token) {
      // Store authentication data locally
      await storeAuthData(response.data.token, response.data.user);
      console.log('✅ Registration successful');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.log('❌ Registration error:', error);
    
    // Handle different types of errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

/**
 * Login user with email and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - User data and token
 */
export const login = async (credentials) => {
  try {
    console.log('Logging in user:', credentials.email);
    
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      // Store authentication data locally
      await storeAuthData(response.data.token, response.data.user);
      console.log('✅ Login successful');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.log('❌ Login error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }
};

/**
 * Get current user information
 * @returns {Promise<Object>} - Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    
    if (response.data.success) {
      // Update stored user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error('Failed to get user data');
    }
  } catch (error) {
    console.log('❌ Get current user error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (updateData) => {
  try {
    const response = await apiClient.put('/auth/profile', updateData);
    
    if (response.data.success) {
      // Update stored user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error(response.data.message || 'Profile update failed');
    }
  } catch (error) {
    console.log('❌ Profile update error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Profile update failed. Please try again.');
    }
  }
};

/**
 * Logout user (clear local data)
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await clearAuthData();
    console.log('✅ Logout successful');
  } catch (error) {
    console.log('❌ Logout error:', error);
    throw new Error('Logout failed');
  }
};

// STORAGE HELPER FUNCTIONS

/**
 * Store authentication data in AsyncStorage
 * @param {string} token - JWT token
 * @param {Object} user - User data
 */
const storeAuthData = async (token, user) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)]
    ]);
  } catch (error) {
    console.log('Error storing auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Clear all authentication data from AsyncStorage
 */
const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.log('Error clearing auth data:', error);
  }
};

/**
 * Get stored authentication token
 * @returns {Promise<string|null>} - JWT token or null
 */
export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.log('Error getting stored token:', error);
    return null;
  }
};

/**
 * Get stored user data
 * @returns {Promise<Object|null>} - User data or null
 */
export const getStoredUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.log('Error getting stored user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {Promise<boolean>} - True if authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await getStoredToken();
    return !!token; // Convert to boolean
  } catch (error) {
    console.log('Error checking authentication:', error);
    return false;
  }
};

// Export API client for other services
export { apiClient };