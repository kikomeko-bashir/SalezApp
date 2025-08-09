// app/sceens/ListingDetailsScreen.js
// Updated listing details screen to display real listing data from database

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity
} from 'react-native';

// Import components and services
import AppText from '../components/AppText';
import ListItem from '../components/ListItem';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import { getListingById, formatPrice, getTimeAgo } from '../services/listingService';
import { getCategoryByValue } from '../config/categories';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

function ListingDetailsScreen({ route, navigation }) {
  // HOOKS AND STATE
  const { user } = useAuth(); // Get current user
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get listing ID from navigation params
  const listingId = route.params?._id || route.params?.id;

  /**
   * Fetch listing details from backend
   */
  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching listing details:', listingId);

      if (!listingId) {
        throw new Error('Listing ID is required');
      }

      // FETCH LISTING DATA
      const listingData = await getListingById(listingId);
      setListing(listingData);

      console.log('✅ Listing details loaded:', listingData.title);

    } catch (error) {
      console.error('❌ Error fetching listing details:', error);
      setError(error.message);
      
      Alert.alert(
        'Error Loading Listing',
        error.message,
        [
          { text: 'Go Back', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: fetchListingDetails }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD LISTING ON COMPONENT MOUNT
  useEffect(() => {
    fetchListingDetails();
  }, [listingId]);

  /**
   * Handle contact seller action
   */
  const handleContactSeller = () => {
    if (!listing?.userId) {
      Alert.alert('Error', 'Seller information not available');
      return;
    }

    Alert.alert(
      'Contact Seller',
      `Would you like to contact ${listing.userId.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Message', 
          onPress: () => {
            // TODO: Navigate to messaging screen
            Alert.alert('Feature Coming Soon', 'Messaging feature will be available soon!');
          }
        }
      ]
    );
  };

  /**
   * Check if current user owns this listing
   */
  const isOwner = () => {
    return user?.id === listing?.userId?._id;
  };

  /**
   * Handle image navigation
   */
  const goToNextImage = () => {
    if (listing?.images && currentImageIndex < listing.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText style={styles.loadingText}>Loading listing...</AppText>
      </View>
    );
  }

  // ERROR STATE
  if (error || !listing) {
    return (
      <View style={styles.errorContainer}>
        <AppText style={styles.errorTitle}>Listing Not Found</AppText>
        <AppText style={styles.errorMessage}>
          {error || 'This listing may have been removed or doesn\'t exist.'}
        </AppText>
        <AppButton 
          title="Go Back" 
          onPress={() => navigation.goBack()}
          color="secondary"
        />
      </View>
    );
  }

  // GET CATEGORY INFORMATION
  const category = getCategoryByValue(listing.category?.value);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* IMAGE GALLERY */}
      <View style={styles.imageContainer}>
        {listing.images && listing.images.length > 0 ? (
          <>
            <Image 
              style={styles.image} 
              source={{ uri: listing.images[currentImageIndex] }}
              resizeMode="cover"
            />
            
            {/* IMAGE NAVIGATION */}
            {listing.images.length > 1 && (
              <>
                {/* Previous Button */}
                {currentImageIndex > 0 && (
                  <TouchableOpacity 
                    style={[styles.imageNav, styles.imageNavLeft]} 
                    onPress={goToPreviousImage}
                  >
                    <AppText style={styles.imageNavText}>‹</AppText>
                  </TouchableOpacity>
                )}
                
                {/* Next Button */}
                {currentImageIndex < listing.images.length - 1 && (
                  <TouchableOpacity 
                    style={[styles.imageNav, styles.imageNavRight]} 
                    onPress={goToNextImage}
                  >
                    <AppText style={styles.imageNavText}>›</AppText>
                  </TouchableOpacity>
                )}
                
                {/* Image Counter */}
                <View style={styles.imageCounter}>
                  <AppText style={styles.imageCounterText}>
                    {currentImageIndex + 1} / {listing.images.length}
                  </AppText>
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.noImageContainer}>
            <AppText style={styles.noImageText}>No Image Available</AppText>
          </View>
        )}
      </View>

      {/* LISTING DETAILS */}
      <View style={styles.detailsContainer}>
        {/* TITLE AND PRICE */}
        <View style={styles.headerSection}>
          <AppText style={styles.title}>{listing.title}</AppText>
          <AppText style={styles.price}>{formatPrice(listing.price)}</AppText>
          
          {/* CATEGORY AND TIME */}
          <View style={styles.metaInfo}>
            {category && (
              <View style={styles.categoryTag}>
                <AppText style={styles.categoryText}>{category.label}</AppText>
              </View>
            )}
            <AppText style={styles.timeText}>
              Listed {getTimeAgo(listing.createdAt)}
            </AppText>
          </View>
        </View>

        {/* DESCRIPTION */}
        {listing.description && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Description</AppText>
            <AppText style={styles.description}>{listing.description}</AppText>
          </View>
        )}

        {/* LISTING STATS */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Listing Information</AppText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Views</AppText>
              <AppText style={styles.statValue}>{listing.views || 0}</AppText>
            </View>
            <View style={styles.statItem}>
              <AppText style={styles.statLabel}>Status</AppText>
              <AppText style={[
                styles.statValue,
                { color: listing.status === 'active' ? colors.primary : colors.medium }
              ]}>
                {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
              </AppText>
            </View>
          </View>
        </View>

        {/* SELLER INFORMATION */}
        <View style={styles.sellerSection}>
          <AppText style={styles.sectionTitle}>Seller</AppText>
          <ListItem
            title={listing.userId?.name || 'Unknown Seller'}
            subTitle={`Member since ${new Date(listing.userId?.createdAt || listing.createdAt).getFullYear()}`}
            image={require('../assets/kikooo.jpg')} // Default avatar
            IconComponent={null}
          />
        </View>

        {/* LOCATION (if available) */}
        {listing.location && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Location</AppText>
            <AppText style={styles.locationText}>
              📍 Approximate location provided
            </AppText>
          </View>
        )}

        {/* ACTION BUTTONS */}
        <View style={styles.actionSection}>
          {isOwner() ? (
            // OWNER ACTIONS
            <View style={styles.ownerActions}>
              <AppText style={styles.ownerText}>This is your listing</AppText>
              <AppButton 
                title="Edit Listing" 
                onPress={() => {
                  // TODO: Navigate to edit screen
                  Alert.alert('Feature Coming Soon', 'Edit functionality will be available soon!');
                }}
                color="secondary"
              />
              {listing.status === 'active' && (
                <AppButton 
                  title="Mark as Sold" 
                  onPress={() => {
                    // TODO: Implement mark as sold
                    Alert.alert('Feature Coming Soon', 'Mark as sold functionality will be available soon!');
                  }}
                />
              )}
            </View>
          ) : (
            // BUYER ACTIONS
            <View style={styles.buyerActions}>
              <AppButton 
                title="Contact Seller" 
                onPress={handleContactSeller}
              />
              <AppButton 
                title="Save to Favorites" 
                onPress={() => {
                  // TODO: Implement favorites
                  Alert.alert('Feature Coming Soon', 'Favorites functionality will be available soon!');
                }}
                color="secondary"
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 10,
    color: colors.medium,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
  },
  
  errorMessage: {
    fontSize: 16,
    color: colors.medium,
    textAlign: 'center',
    marginBottom: 30,
  },
  
  imageContainer: {
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: 300,
  },
  
  noImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  noImageText: {
    color: colors.medium,
    fontSize: 16,
  },
  
  imageNav: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageNavLeft: {
    left: 20,
  },
  
  imageNavRight: {
    right: 20,
  },
  
  imageNavText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  imageCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  
  imageCounterText: {
    color: colors.white,
    fontSize: 12,
  },
  
  detailsContainer: {
    padding: 20,
  },
  
  headerSection: {
    marginBottom: 25,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
  },
  
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  categoryTag: {
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 15,
  },
  
  categoryText: {
    fontSize: 12,
    color: colors.medium,
    fontWeight: '600',
  },
  
  timeText: {
    fontSize: 14,
    color: colors.medium,
  },
  
  section: {
    marginBottom: 25,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
  },
  
  description: {
    fontSize: 16,
    color: colors.dark,
    lineHeight: 24,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 10,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statLabel: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 5,
  },
  
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  
  sellerSection: {
    marginBottom: 25,
  },
  
  locationText: {
    fontSize: 14,
    color: colors.medium,
  },
  
  actionSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  
  ownerActions: {
    gap: 15,
  },
  
  ownerText: {
    fontSize: 16,
    color: colors.medium,
    textAlign: 'center',
    marginBottom: 10,
  },
  
  buyerActions: {
    gap: 15,
  },
});

export default ListingDetailsScreen;