// Updated listings screen to display real listings from database

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  View, 
  ActivityIndicator,
  Alert 
} from 'react-native';

// Import components and services
import Screen from '../components/Screen';
import Card from '../components/Card';
import AppText from '../components/AppText';
import colors from '../config/colors';
import routes from '../navigation/routes';
import { getListings, formatPrice, getTimeAgo } from '../services/listingService';
import { getCategoryByValue } from '../config/categories';

function ListingsScreen({ navigation }) {
  // STATE MANAGEMENT
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Fetch listings from backend
   * @param {boolean} isRefresh - Whether this is a refresh action
   * @param {boolean} isLoadMore - Whether this is loading more data
   */
  const fetchListings = useCallback(async (isRefresh = false, isLoadMore = false) => {
    try {
      // SET LOADING STATES
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      // DETERMINE PAGE NUMBER
      const currentPage = isRefresh ? 1 : (isLoadMore ? page + 1 : 1);

      // FETCH DATA FROM API
      console.log(`📄 Fetching listings - page ${currentPage}`);
      const response = await getListings({
        page: currentPage,
        limit: 10 // Get 10 listings per page
      });

      // UPDATE STATE WITH NEW DATA
      if (isRefresh || !isLoadMore) {
        // Replace all listings (refresh or initial load)
        setListings(response.listings);
        setPage(1);
      } else {
        // Append new listings (load more)
        setListings(prevListings => [...prevListings, ...response.listings]);
        setPage(currentPage);
      }

      // UPDATE PAGINATION STATE
      setHasMoreData(response.pagination.hasNextPage);

      console.log(`✅ Loaded ${response.listings.length} listings`);

    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      setError(error.message);
      
      // Show user-friendly error
      if (!isRefresh && !isLoadMore) {
        Alert.alert(
          'Error Loading Listings',
          error.message,
          [
            { text: 'Retry', onPress: () => fetchListings() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } finally {
      // CLEAR ALL LOADING STATES
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  // LOAD LISTINGS ON COMPONENT MOUNT
  useEffect(() => {
    fetchListings();
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = () => {
    fetchListings(true);
  };

  /**
   * Handle load more (pagination)
   */
  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData) {
      fetchListings(false, true);
    }
  };

  /**
   * Handle listing card press - navigate to details
   * @param {Object} listing - Selected listing object
   */
  const handleListingPress = (listing) => {
    console.log('🔍 Opening listing:', listing.title);
    navigation.navigate(routes.LISTING_DETAILS, listing);
  };

  /**
   * Format listing data for Card component
   * @param {Object} listing - Raw listing from API
   * @returns {Object} - Formatted listing for Card
   */
  const formatListingForCard = (listing) => {
    // Get category info for display
    const category = getCategoryByValue(listing.category?.value);
    
    return {
      ...listing,
      // Format price for display
      price: formatPrice(listing.price),
      // Use first image as main image, or existing kikooo.jpg as placeholder
      image: listing.images?.[0] ? { uri: listing.images[0] } : require('../assets/kikooo.jpg'),
      // Add category name to subtitle
      subTitle: `${formatPrice(listing.price)} • ${category?.label || 'Other'}`,
      // Add time info
      timeAgo: getTimeAgo(listing.createdAt),
      // Add seller info
      sellerName: listing.userId?.name || 'Unknown Seller'
    };
  };

  /**
   * Render individual listing item
   */
  const renderListingItem = ({ item }) => {
    const formattedListing = formatListingForCard(item);
    
    return (
      <Card
        title={formattedListing.title}
        subTitle={formattedListing.subTitle}
        image={formattedListing.image}
        onPress={() => handleListingPress(formattedListing)}
      />
    );
  };

  /**
   * Render loading footer for pagination
   */
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <AppText style={styles.loadingText}>Loading more listings...</AppText>
      </View>
    );
  };

  /**
   * Render empty state when no listings
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <AppText style={styles.emptyTitle}>No Listings Found</AppText>
      <AppText style={styles.emptyMessage}>
        Be the first to list an item for sale!
      </AppText>
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <AppText style={styles.errorTitle}>Something went wrong</AppText>
      <AppText style={styles.errorMessage}>{error}</AppText>
      <AppText 
        style={styles.retryText}
        onPress={() => fetchListings()}
      >
        Tap to retry
      </AppText>
    </View>
  );

  // MAIN LOADING STATE
  if (loading && listings.length === 0) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText style={styles.loadingText}>Loading listings...</AppText>
        </View>
      </Screen>
    );
  }

  // ERROR STATE
  if (error && listings.length === 0) {
    return (
      <Screen style={styles.screen}>
        {renderErrorState()}
      </Screen>
    );
  }

  // MAIN RENDER
  return (
    <Screen style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Marketplace</AppText>
        <AppText style={styles.headerSubtitle}>
          {listings.length} item{listings.length !== 1 ? 's' : ''} available
        </AppText>
      </View>

      {/* LISTINGS LIST */}
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing._id.toString()}
        renderItem={renderListingItem}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listings.length === 0 ? styles.emptyContainer : undefined}
      />

      {/* DEVELOPMENT INFO */}
      {__DEV__ && (
        <View style={styles.devInfo}>
          <AppText style={styles.devText}>
            📊 Page: {page} | Has More: {hasMoreData ? 'Yes' : 'No'} | Total: {listings.length}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: colors.medium,
    marginTop: 5,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 10,
    color: colors.medium,
    fontSize: 16,
  },
  
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  emptyContainer: {
    flexGrow: 1,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
  },
  
  emptyMessage: {
    fontSize: 16,
    color: colors.medium,
    textAlign: 'center',
  },
  
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.danger || '#f44336',
    marginBottom: 10,
  },
  
  errorMessage: {
    fontSize: 16,
    color: colors.medium,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  retryText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  
  devInfo: {
    padding: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  
  devText: {
    fontSize: 12,
    color: colors.medium,
    textAlign: 'center',
  },
});

export default ListingsScreen;