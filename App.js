import React, { useState } from 'react';
import { 
  View, 
  Image,
  TextInput,
  Text,
  Switch, 
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
import AppTextInput from './app/components/AppTextInput';
import AppPicker from './app/components/AppPicker';
import LoginScreen from './app/sceens/LoginScreen';
import ListingEditScreen from './app/sceens/ListingEditScreen';



export default function App() {
  
  

  return (
    <ListingEditScreen/>
  );
}


