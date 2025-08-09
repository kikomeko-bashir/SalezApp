// App.js - Main application component with authentication integration
// This component now handles authentication state and shows appropriate screens

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";

// Import navigation components
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';

// Import authentication context
import { AuthProvider, useAuth } from './app/context/AuthContext';
import AppText from './app/components/AppText';
import colors from './app/config/colors';

/**
 * MAIN APP CONTENT COMPONENT
 * This component determines which navigator to show based on authentication state
 * It's separate from App component so it can use the useAuth hook
 */
function AppContent() {
  // Get authentication state from context
  const { isAuthenticated, isLoading, user } = useAuth();

  // LOADING STATE
  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText style={styles.loadingText}>Loading...</AppText>
      </View>
    );
  }

  // NAVIGATION DECISION
  // Show different navigators based on authentication status
  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        // User is logged in - show main app navigator (listings, account, etc.)
        <>
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <AppText style={styles.debugText}>
                ✅ Authenticated as: {user?.name || 'Unknown'}
              </AppText>
            </View>
          )}
          <AppNavigator />
        </>
      ) : (
        // User is not logged in - show authentication navigator (login, register)
        <>
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <AppText style={styles.debugText}>
                🔒 Not authenticated - showing login
              </AppText>
            </View>
          )}
          <AuthNavigator />
        </>
      )}
    </NavigationContainer>
  );
}

/**
 * MAIN APP COMPONENT
 * Wraps the entire app with necessary providers
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 
        AuthProvider must wrap NavigationContainer so that 
        navigation components can access authentication state 
      */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.medium,
  },
  
  debugInfo: {
    backgroundColor: colors.light,
    padding: 8,
    alignItems: 'center',
  },
  
  debugText: {
    fontSize: 12,
    color: colors.medium,
  },
});