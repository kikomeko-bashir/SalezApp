// Global authentication state management using React Context

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService,
  getCurrentUser,
  getStoredToken,
  getStoredUser,
  isAuthenticated
} from '../services/authService';

// AUTHENTICATION STATES
const AUTH_STATES = {
  LOADING: 'LOADING',           // Checking authentication status
  AUTHENTICATED: 'AUTHENTICATED', // User is logged in
  UNAUTHENTICATED: 'UNAUTHENTICATED' // User is not logged in
};

// ACTION TYPES for reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// INITIAL STATE
const initialState = {
  user: null,                    // Current user data
  token: null,                   // JWT token
  isLoading: true,              // Loading state
  isAuthenticated: false,       // Authentication status
  error: null                   // Error message
};

// REDUCER FUNCTION
// Manages state changes based on dispatched actions
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// CREATE CONTEXT
const AuthContext = createContext(undefined);

// AUTHENTICATION PROVIDER COMPONENT
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // CHECK AUTHENTICATION STATUS ON APP START
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is already authenticated (has stored token)
   * This runs when the app starts
   */
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Check if user has stored authentication data
      const authenticated = await isAuthenticated();
      
      if (authenticated) {
        // Get stored user data and token
        const [storedUser, storedToken] = await Promise.all([
          getStoredUser(),
          getStoredToken()
        ]);

        if (storedUser && storedToken) {
          // Try to verify token with backend
          try {
            const currentUser = await getCurrentUser();
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: currentUser,
                token: storedToken
              }
            });
          } catch (error) {
            // Token is invalid, user needs to login again
            console.log('Stored token is invalid, requiring login');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login response
   */
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await loginService({ email, password });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return response;
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * Register new user account
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Registration response
   */
  const register = async (name, email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await registerService({ name, email, password });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return response;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await logoutService();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.log('Logout error:', error);
      // Force logout even if service call fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  /**
   * Update user profile data
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // CONTEXT VALUE
  // All the data and functions available to components
  const value = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;