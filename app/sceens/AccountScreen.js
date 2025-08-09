// app/sceens/AccountScreen.js
// Updated account screen with logout functionality

import React from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import Icon from '../components/Icon';
import colors from '../config/colors';
import ListItemSeparator from '../components/ListItemSeparator';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  {
    title: 'My Listings',
    icon: {
      name: 'format-list-bulleted',
      backgroundColor: colors.primary,
    },
  },
  {
    title: 'My Messages',
    icon: {
      name: 'email',
      backgroundColor: colors.secondary,
    },
    targetScreen: "Messages",
  },
];

function AccountScreen({ navigation }) {
  // Get user data and logout function from auth context
  const { user, logout, isLoading } = useAuth();

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically by App.js
              // when authentication state changes
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Screen style={styles.screen}>
      {/* User Profile Section */}
      <View style={styles.container}>
        <ListItem
          title={user?.name || 'User Name'}
          subTitle={user?.email || 'user@example.com'}
          image={require('../assets/kikooo.jpg')}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>

      {/* Logout Button */}
      <ListItem
        title="Log Out"
        IconComponent={
          <Icon name="logout" backgroundColor="#ffe66d" />
        }
        onPress={handleLogout}
      />

      {/* Development Info */}
      {__DEV__ && (
        <View style={styles.devInfo}>
          <ListItem
            title="User ID"
            subTitle={user?.id || 'Not available'}
            IconComponent={
              <Icon name="account-details" backgroundColor={colors.medium} />
            }
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.light,
  },
  devInfo: {
    marginTop: 20,
    opacity: 0.7,
  },
});

export default AccountScreen;