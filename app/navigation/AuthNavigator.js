import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../sceens/WelcomeScreen"; // Corrected import path
import LoginScreen from "../sceens/LoginScreen";  // Corrected import path
import RegisterScreen from "../sceens/RegisterScreen";  // Corrected import path

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
