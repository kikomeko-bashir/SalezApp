// app/sceens/LoginScreen.js
// Updated login screen that integrates with authentication context

import React, { useState } from 'react';
import * as Yup from 'yup';
import { View, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import AppText from '../components/AppText';
import colors from '../config/colors';
import { useAuth } from '../context/AuthContext';

// FORM VALIDATION SCHEMA
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required')
        .label("Email"),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
        .label("Password"),
});

function LoginScreen({ navigation }) {
    // Get authentication functions and state from context
    const { login, isLoading, error, clearError } = useAuth();
    
    // Local state for form handling
    const [submitAttempted, setSubmitAttempted] = useState(false);

    /**
     * Handle form submission
     * @param {Object} values - Form values (email, password)
     */
    const handleSubmit = async (values) => {
        try {
            setSubmitAttempted(true);
            clearError(); // Clear any previous errors

            console.log('Attempting login with:', values.email);

            // Call login function from AuthContext
            await login(values.email, values.password);

            // Login successful - navigation will be handled by App.js
            // based on authentication state change
            console.log('✅ Login successful, user authenticated');

        } catch (error) {
            // Error is handled by AuthContext and will be displayed
            console.log('❌ Login failed:', error.message);
            
            // Show alert for better user experience
            Alert.alert(
                'Login Failed',
                error.message || 'Please check your credentials and try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setSubmitAttempted(false);
        }
    };

    /**
     * Navigate to registration screen
     */
    const navigateToRegister = () => {
        clearError(); // Clear any errors when navigating
        navigation.navigate('Register');
    };

    return (
        <Screen style={styles.container}>
            {/* App Logo */}
            <Image 
                style={styles.logo}
                source={require("../assets/logo_kiko.png")} 
            />

            {/* Welcome Text */}
            <AppText style={styles.welcomeText}>Welcome Back!</AppText>
            <AppText style={styles.subtitleText}>Sign in to continue</AppText>

            {/* Error Message Display */}
            {error && (
                <View style={styles.errorContainer}>
                    <AppText style={styles.errorText}>{error}</AppText>
                </View>
            )}

            {/* Login Form */}
            <AppForm
                initialValues={{ email: '', password: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {/* Email Input */}
                <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="email"
                    keyboardType="email-address"
                    name="email"
                    placeholder="Email"
                    textContentType="emailAddress"
                    editable={!isLoading} // Disable during loading
                />

                {/* Password Input */}
                <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock"
                    name="password"
                    placeholder="Password"
                    secureTextEntry={true}
                    textContentType="password"
                    editable={!isLoading} // Disable during loading
                />

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    {isLoading ? (
                        // Show loading indicator during login
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator 
                                size="large" 
                                color={colors.primary} 
                            />
                            <AppText style={styles.loadingText}>
                                Signing in...
                            </AppText>
                        </View>
                    ) : (
                        <SubmitButton title="Sign In" />
                    )}
                </View>
            </AppForm>

            {/* Registration Link */}
            <View style={styles.registerContainer}>
                <AppText style={styles.registerText}>
                    Don't have an account?{' '}
                </AppText>
                <AppText 
                    style={styles.registerLink}
                    onPress={navigateToRegister}
                >
                    Sign Up
                </AppText>
            </View>

            {/* Development Info */}
            {__DEV__ && (
                <View style={styles.devInfo}>
                    <AppText style={styles.devText}>
                        Dev Mode: Make sure backend is running on localhost:5000
                    </AppText>
                </View>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        justifyContent: 'center',
        flex: 1,
    },
    
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 30,
    },
    
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.dark,
    },
    
    subtitleText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: colors.medium,
    },
    
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeft: 4,
        borderLeftColor: colors.danger || '#f44336',
    },
    
    errorText: {
        color: '#c62828',
        fontSize: 14,
        textAlign: 'center',
    },
    
    buttonContainer: {
        marginTop: 10,
    },
    
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    
    loadingText: {
        marginTop: 10,
        color: colors.medium,
        fontSize: 16,
    },
    
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 20,
    },
    
    registerText: {
        fontSize: 16,
        color: colors.medium,
    },
    
    registerLink: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
    },
    
    devInfo: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.light,
        borderRadius: 5,
    },
    
    devText: {
        fontSize: 12,
        color: colors.medium,
        textAlign: 'center',
    },
});

export default LoginScreen;