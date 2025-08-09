// app/sceens/RegisterScreen.js
// Updated registration screen that integrates with authentication context

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
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required')
        .label("Name"),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required')
        .label("Email"),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
        .label("Password"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
        .label("Confirm Password"),
});

function RegisterScreen({ navigation }) {
    // Get authentication functions and state from context
    const { register, isLoading, error, clearError } = useAuth();
    
    // Local state for form handling
    const [submitAttempted, setSubmitAttempted] = useState(false);

    /**
     * Handle form submission
     * @param {Object} values - Form values (name, email, password, confirmPassword)
     */
    const handleSubmit = async (values) => {
        try {
            setSubmitAttempted(true);
            clearError(); // Clear any previous errors

            console.log('Attempting registration for:', values.email);

            // Call register function from AuthContext
            await register(values.name, values.email, values.password);

            // Registration successful - navigation will be handled by App.js
            // based on authentication state change
            console.log('✅ Registration successful, user authenticated');

            // Show success message
            Alert.alert(
                'Welcome!',
                'Your account has been created successfully.',
                [{ text: 'Continue' }]
            );

        } catch (error) {
            // Error is handled by AuthContext and will be displayed
            console.log('❌ Registration failed:', error.message);
            
            // Show alert for better user experience
            Alert.alert(
                'Registration Failed',
                error.message || 'Please check your information and try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setSubmitAttempted(false);
        }
    };

    /**
     * Navigate to login screen
     */
    const navigateToLogin = () => {
        clearError(); // Clear any errors when navigating
        navigation.navigate('Login');
    };

    return (
        <Screen style={styles.container}>
            {/* App Logo */}
            <Image 
                style={styles.logo}
                source={require("../assets/logo_kiko.png")} 
            />

            {/* Welcome Text */}
            <AppText style={styles.welcomeText}>Create Account</AppText>
            <AppText style={styles.subtitleText}>Join us today!</AppText>

            {/* Error Message Display */}
            {error && (
                <View style={styles.errorContainer}>
                    <AppText style={styles.errorText}>{error}</AppText>
                </View>
            )}

            {/* Registration Form */}
            <AppForm
                initialValues={{ 
                    name: '', 
                    email: '', 
                    password: '', 
                    confirmPassword: '' 
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {/* Name Input */}
                <AppFormField
                    autoCapitalize="words"
                    autoCorrect={false}
                    icon="account"
                    name="name"
                    placeholder="Full Name"
                    textContentType="name"
                    editable={!isLoading} // Disable during loading
                />

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

                {/* Confirm Password Input */}
                <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock-check"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    textContentType="password"
                    editable={!isLoading} // Disable during loading
                />

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    {isLoading ? (
                        // Show loading indicator during registration
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator 
                                size="large" 
                                color={colors.primary} 
                            />
                            <AppText style={styles.loadingText}>
                                Creating account...
                            </AppText>
                        </View>
                    ) : (
                        <SubmitButton title="Create Account" />
                    )}
                </View>
            </AppForm>

            {/* Login Link */}
            <View style={styles.loginContainer}>
                <AppText style={styles.loginText}>
                    Already have an account?{' '}
                </AppText>
                <AppText 
                    style={styles.loginLink}
                    onPress={navigateToLogin}
                >
                    Sign In
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
        paddingTop: 20,
        justifyContent: 'center',
        flex: 1,
    },
    
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 20,
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
        marginBottom: 30,
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
    
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 20,
    },
    
    loginText: {
        fontSize: 16,
        color: colors.medium,
    },
    
    loginLink: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
    },
    
    devInfo: {
        marginTop: 10,
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

export default RegisterScreen;