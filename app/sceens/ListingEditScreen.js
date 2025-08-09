// Updated listing edit screen with real categories and backend integration



import React, { useState } from "react";
import { StyleSheet, Alert, ActivityIndicator, View, ScrollView } from "react-native";
import * as Yup from "yup";

// Import components
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import CategoryPickerItem from "../components/CategoryPickerItem";
import { AppForm, AppFormField, AppFormPicker, SubmitButton } from "../components/forms";
import FormImagePicker from "../components/forms/FormImagePicker";

// Import services and data
import { createListing, validateListingData } from "../services/listingService";
import { MARKETPLACE_CATEGORIES } from "../config/categories";
import useLocation from "../hooks/useLocation";
import colors from "../config/colors";

// FORM VALIDATION SCHEMA
const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(255, "Title cannot exceed 255 characters")
        .label("Title"),
    
    price: Yup.number()
        .required("Price is required")
        .min(0.01, "Price must be greater than 0")
        .max(1000000, "Price cannot exceed $1,000,000")
        .label("Price"),
    
    description: Yup.string()
        .max(1000, "Description cannot exceed 1000 characters")
        .label("Description"),
    
    category: Yup.object()
        .required("Please select a category")
        .nullable()
        .label("Category"),
    
    images: Yup.array()
        .min(1, "Please add at least one image")
        .max(5, "Maximum 5 images allowed")
        .label("Images"),
});

function ListingEditScreen({ navigation }) {
    console.log('🔧 DEBUG: ListingEditScreen loaded with debug version');
    // HOOKS AND STATE
    const location = useLocation(); // Get user's current location
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    /**
     * Handle form submission
     * @param {Object} values - Form values from Formik
     */
    /**
     * Handle form submission - DEBUG VERSION
     * @param {Object} values - Form values from Formik
     */
    const handleSubmit = async (values) => {
        alert('🚨 SUBMIT BUTTON WAS PRESSED!');
        console.log('🚨 SUBMIT BUTTON PRESSED!')

        try {
            console.log('🎯 === FORM SUBMISSION STARTED ===');
            console.log('📝 Raw form values:', JSON.stringify(values, null, 2));
            
            setIsSubmitting(true);
            setSubmitError(null);

            // LOG INDIVIDUAL FIELDS
            console.log('📋 Field validation:');
            console.log('   Title:', values.title, '(length:', values.title?.length, ')');
            console.log('   Price:', values.price, '(type:', typeof values.price, ')');
            console.log('   Category:', values.category);
            console.log('   Images:', values.images, '(count:', values.images?.length, ')');
            console.log('   Description:', values.description?.substring(0, 50) + '...');
            console.log('   Location:', location);

            // VALIDATE DATA before sending to backend
            console.log('🔍 Running validation...');
            const validation = validateListingData(values);
            console.log('✅ Validation result:', validation);
            
            if (!validation.isValid) {
                console.log('❌ Validation failed:', validation.errors);
                setSubmitError(validation.errors.join(', '));
                return;
            }

            // PREPARE LISTING DATA
            const listingData = {
                title: values.title.trim(),
                description: values.description?.trim() || '',
                price: parseFloat(values.price),
                category: values.category,
                images: values.images,
                location: location // Include user's location
            };

            console.log('📦 Prepared listing data:', JSON.stringify(listingData, null, 2));
            console.log('📦 Data types check:');
            console.log('   title type:', typeof listingData.title);
            console.log('   price type:', typeof listingData.price);
            console.log('   images type:', typeof listingData.images, 'length:', listingData.images?.length);

            // CREATE LISTING via API
            console.log('🚀 Calling createListing API...');
            const response = await createListing(listingData);
            console.log('✅ API Response received:', response);

            // SUCCESS - show confirmation and navigate
            Alert.alert(
                "Success! 🎉",
                "Your item has been listed for sale successfully!",
                [
                    {
                        text: "View Listings",
                        onPress: () => {
                            console.log('🏠 Navigating to Listings screen');
                            navigation.navigate("Listings");
                        }
                    },
                    {
                        text: "Add Another",
                        style: "cancel",
                        onPress: () => {
                            console.log('➕ Resetting form for another listing');
                            navigation.replace("ListingEdit");
                        }
                    }
                ]
            );

            console.log('✅ Listing created successfully:', response.listing?.id);

        } catch (error) {
            // ERROR HANDLING
            console.log('💥 === FORM SUBMISSION FAILED ===');
            console.error('❌ Error type:', error.constructor.name);
            console.error('❌ Failed to create listing:', error.message);
            console.error('❌ Full error:', error);
            
            setSubmitError(error.message);
            
            Alert.alert(
                "Error Creating Listing",
                error.message || "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            console.log('🏁 Form submission completed, clearing loading state');
            setIsSubmitting(false);
        }
    };
    /**
     * Clear any submission errors when user starts typing
     */
    const clearError = () => {
        if (submitError) {
            setSubmitError(null);
        }
    };

    return (
        <Screen style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <AppText style={styles.headerTitle}>Sell Your Item</AppText>
                    <AppText style={styles.headerSubtitle}>
                        Fill in the details to list your item for sale
                    </AppText>
                </View>

                {/* ERROR MESSAGE */}
                {submitError && (
                    <View style={styles.errorContainer}>
                        <AppText style={styles.errorText}>{submitError}</AppText>
                    </View>
                )}

                {/* LISTING FORM */}
                <AppForm
                    initialValues={{
                        title: "",
                        price: "",
                        description: "",
                        category: null,
                        images: [],
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {/* IMAGE PICKER */}
                    <View style={styles.section}>
                        <AppText style={styles.sectionTitle}>Photos</AppText>
                        <AppText style={styles.sectionSubtitle}>
                            Add up to 5 photos (first photo will be the main image)
                        </AppText>
                        <FormImagePicker name="images" />
                    </View>

                    {/* BASIC INFORMATION */}
                    <View style={styles.section}>
                        <AppText style={styles.sectionTitle}>Basic Information</AppText>
                        
                        <AppFormField
                            name="title"
                            placeholder="What are you selling?"
                            maxLength={255}
                            onChangeText={clearError} // Clear error when typing
                        />
                        
                        <AppFormField
                            name="price"
                            placeholder="Price ($)"
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={clearError}
                        />
                    </View>

                    {/* CATEGORY SELECTION */}
                    <View style={styles.section}>
                        <AppText style={styles.sectionTitle}>Category</AppText>
                        <AppText style={styles.sectionSubtitle}>
                            Choose the category that best describes your item
                        </AppText>
                        
                        <AppFormPicker
                            name="category"
                            numberOfColumns={3}
                            PickerItemComponent={CategoryPickerItem}
                            placeholder="Select Category"
                            items={MARKETPLACE_CATEGORIES}
                        />
                    </View>

                    {/* DESCRIPTION */}
                    <View style={styles.section}>
                        <AppText style={styles.sectionTitle}>Description</AppText>
                        <AppText style={styles.sectionSubtitle}>
                            Describe your item's condition, features, and any other details
                        </AppText>
                        
                        <AppFormField
                            name="description"
                            placeholder="Describe your item..."
                            multiline
                            numberOfLines={4}
                            maxLength={1000}
                            onChangeText={clearError}
                        />
                    </View>

                    {/* LOCATION INFO */}
                    {location && (
                        <View style={styles.locationInfo}>
                            <AppText style={styles.locationText}>
                                📍 Location will be included to help buyers find your item
                            </AppText>
                        </View>
                    )}

                    {/* SUBMIT BUTTON */}
                    <View style={styles.submitContainer}>
                        {isSubmitting ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <AppText style={styles.loadingText}>Creating listing...</AppText>
                            </View>
                        ) : (
                            <SubmitButton title="List Item for Sale" />
                        )}
                    </View>

                    {/* TIPS */}
                    <View style={styles.tipsContainer}>
                        <AppText style={styles.tipsTitle}>💡 Tips for better listings:</AppText>
                        <AppText style={styles.tipText}>• Use good lighting for photos</AppText>
                        <AppText style={styles.tipText}>• Include multiple angles</AppText>
                        <AppText style={styles.tipText}>• Write detailed descriptions</AppText>
                        <AppText style={styles.tipText}>• Price competitively</AppText>
                        <AppText style={styles.tipText}>• Be honest about condition</AppText>
                    </View>
                </AppForm>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    
    scrollContent: {
        padding: 15,
        paddingBottom: 30, // Extra padding at bottom
    },
    
    header: {
        marginBottom: 20,
        paddingVertical: 10,
    },
    
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 5,
    },
    
    headerSubtitle: {
        fontSize: 16,
        color: colors.medium,
    },
    
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    
    errorText: {
        color: '#c62828',
        fontSize: 14,
    },
    
    section: {
        marginBottom: 25,
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 5,
    },
    
    sectionSubtitle: {
        fontSize: 14,
        color: colors.medium,
        marginBottom: 15,
    },
    
    locationInfo: {
        backgroundColor: colors.light,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    
    locationText: {
        fontSize: 14,
        color: colors.medium,
        textAlign: 'center',
    },
    
    submitContainer: {
        marginTop: 20,
        marginBottom: 20,
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
    
    tipsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 10,
    },
    
    tipText: {
        fontSize: 14,
        color: colors.medium,
        marginBottom: 5,
        paddingLeft: 10,
    },
});

export default ListingEditScreen;