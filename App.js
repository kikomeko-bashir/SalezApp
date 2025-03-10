import React from 'react';
import { Text } from 'react-native';
import Screen from "./app/components/Screen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';

// Define screen components
const Tweets = ({ navigation }) => (
  <Screen >
    <Text>Tweets Screen</Text>
    <Button 
      title='View Tweet'
      onPress={() => navigation.navigate("TweetDetails", { id: 1})}  
    />
  </Screen>
);

const TweetDetails = ({ route }) => (  
  <Screen>
    <Text>Tweet Details Screen {route.params.id} </Text>
  </Screen>
);

const Account = () => (  // Fixed typo here
  <Screen>
    <Text>Account Screen</Text>
  </Screen>
);

// Create stack navigator
const Stack = createStackNavigator();

const StackNavigator = () => ( 
  <Stack.Navigator 
    screenOptions={{
      headerStyle: { backgroundColor: "dodgerblue"},
      headerTintColor: "white"
    }}
  >
    <Stack.Screen 
      name="Tweets" 
      component={Tweets} 
    />
    <Stack.Screen 
      name="TweetDetails" 
      component={TweetDetails} 
      options={({ route }) => ({ title: route.params.id })} 
    />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer theme={ navigationTheme }>
      <AppNavigator/>
      
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
