import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons for tabs
import ListingsScreen from '../sceens/ListingsScreen';
import ListingEditScreen from '../sceens/ListingEditScreen';
import AccountScreen from '../sceens/AccountScreen';
import FeedNavigator from './FeedNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: { backgroundColor: "white" },
            headerShown: false, // Hide headers
        }}
    >
        <Tab.Screen 
            name="Feed" 
            component={FeedNavigator} 
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="view-list" color={color} size={size} />
                ),
            }} 
        />
        <Tab.Screen 
            name="ListingEdit" 
            component={ListingEditScreen} 
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
                ),
            }} 
        />
        <Tab.Screen 
            name="Account" 
            component={AccountScreen} 
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
            }} 
        />
    </Tab.Navigator>
);

export default AppNavigator;
