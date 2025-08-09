// app/services/listingService.js - DEBUG VERSION
// Add comprehensive logging to debug the listing creation issue

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './authService';

console.log('🔧 DEBUG: listingService.js loaded with debug version');

/**
 * Create a new product listing - DEBUG VERSION
 */
export const createListing = async (listingData) => {
  try {
    console.log('🚀 === STARTING LISTING CREATION ===');
    console.log('📡 Input data:', JSON.stringify(listingData, null, 2));

    // CHECK AUTHENTICATION
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 Auth token exists:', !!token);
    console.log('🔐 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

    // CHECK API CLIENT CONFIGURATION
    console.log('📡 API Base URL:', apiClient.defaults.baseURL);
    console.log('📡 API Headers:', apiClient.defaults.headers);

    // VALIDATE REQUIRED FIELDS
    console.log('✅ Validating required fields...');
    if (!listingData.title || !listingData.price || !listingData.category) {
      console.log('❌ Missing required fields:');
      console.log('   - Title:', !!listingData.title);
      console.log('   - Price:', !!listingData.price);
      console.log('   - Category:', !!listingData.category);
      throw new Error('Title, price, and category are required');
    }

    if (!listingData.images || listingData.images.length === 0) {
      console.log('⚠️ No images provided - this might cause backend validation error');
      // Don't throw error, let backend handle it
    }

    // PREPARE PAYLOAD
    const payload = {
      title: listingData.title.trim(),
      description: listingData.description?.trim() || '',
      price: parseFloat(listingData.price),
      category: listingData.category,
      images: listingData.images || [],
      location: listingData.location || null
    };

    console.log('📦 Final payload to send:', JSON.stringify(payload, null, 2));
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'characters');

    // MAKE API CALL WITH DETAILED LOGGING
    console.log('🌐 Making API call to /listings...');
    
    const startTime = Date.now();
    const response = await apiClient.post('/listings', payload);
    const endTime = Date.now();
    
    console.log('⏱️ API call took:', endTime - startTime, 'ms');
    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', response.headers);
    console.log('📨 Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('✅ === LISTING CREATION SUCCESSFUL ===');
      console.log('🎉 Created listing ID:', response.data.listing?._id);
      return response.data;
    } else {
      console.log('❌ Backend returned success=false');
      throw new Error(response.data.message || 'Failed to create listing');
    }

  } catch (error) {
    console.log('💥 === LISTING CREATION FAILED ===');
    console.log('❌ Error type:', error.constructor.name);
    console.log('❌ Error message:', error.message);
    
    if (error.response) {
      // Request was made and server responded with error status
      console.log('🔴 HTTP Error Response:');
      console.log('   Status:', error.response.status);
      console.log('   Status Text:', error.response.statusText);
      console.log('   Headers:', error.response.headers);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('🔐 Authentication issue - token might be invalid');
      } else if (error.response.status === 400) {
        console.log('📝 Validation error - check required fields');
      } else if (error.response.status === 500) {
        console.log('💥 Server error - check backend logs');
      }
      
    } else if (error.request) {
      // Request was made but no response received
      console.log('📡 Network Error - No response received:');
      console.log('   Request:', error.request);
      console.log('   This usually means:');
      console.log('   - Backend server is not running');
      console.log('   - Wrong IP address in API_BASE_URL');
      console.log('   - Network connectivity issue');
      
    } else {
      // Something happened in setting up the request
      console.log('⚙️ Request Setup Error:', error.message);
    }
    
    console.log('📱 Check these things:');
    console.log('   1. Backend server running on port 5000?');
    console.log('   2. API_BASE_URL set to http://192.168.1.113:5000/api?');
    console.log('   3. User logged in with valid token?');
    console.log('   4. Network connection working?');
    
    // Re-throw with more specific error message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.errors) {
      throw new Error(error.response.data.errors.join(', '));
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to create listing. Please check your connection and try again.');
    }
  }
};

// Keep all other functions the same...
export const getListings = async (options = {}) => {
  try {
    console.log('📄 Fetching listings with options:', options);
    
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category.toString());
    if (options.userId) params.append('userId', options.userId);

    const queryString = params.toString();
    const url = queryString ? `/listings?${queryString}` : '/listings';

    const response = await apiClient.get(url);

    if (response.data.success) {
      console.log(`✅ Retrieved ${response.data.listings.length} listings`);
      return response.data;
    } else {
      throw new Error('Failed to fetch listings');
    }

  } catch (error) {
    console.error('❌ Get listings error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to fetch listings. Please try again.');
    }
  }
};

// All other utility functions remain the same
export const validateListingData = (listingData) => {
  const errors = [];

  if (!listingData.title?.trim()) {
    errors.push('Title is required');
  }

  if (!listingData.price || listingData.price <= 0) {
    errors.push('Valid price is required');
  }

  if (listingData.price > 1000000) {
    errors.push('Price cannot exceed 1,000,000');
  }

  if (!listingData.category) {
    errors.push('Category is required');
  }

  if (!listingData.images || listingData.images.length === 0) {
    errors.push('At least one image is required');
  }

  if (listingData.title && listingData.title.length > 255) {
    errors.push('Title cannot exceed 255 characters');
  }

  if (listingData.description && listingData.description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};