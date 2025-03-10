import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ListingsScreen from '../sceens/ListingsScreen';
import ListingDetailsScreen from '../sceens/ListingDetailsScreen';


const Stack = createStackNavigator();

const FeedNavigator = () => (
    <Stack.Navigator mode= "modal" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Listings" component={ListingsScreen}  />
        <Stack.Screen name="ListingDetails" component={ListingDetailsScreen}  />
    </Stack.Navigator>
)

export default FeedNavigator;  