import React from 'react';
import { 
  View, 
  Image, 
} from 'react-native';  // Import all components from react-native
import WelcomeScreen from './app/sceens/WelcomeScreen';
import ViewImageScreen from './app/sceens/ViewImageScreen';
import Card from './app/components/Card';
import ListingDetailsScreen from './app/sceens/ListingDetailsScreen';
import MessageScreen from './app/sceens/MessagesScreen';
import Screen from './app/components/Screen';
import Icon from './app/components/Icon';
import ListItem from './app/components/ListItem';
import AccountScreen from './app/sceens/AccountScreen';
import ListingsScreen from './app/sceens/ListingsScreen';

export default function App() {
  

  return (
    <ListingsScreen/>
  );
}


