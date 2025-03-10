import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from '../sceens/AccountScreen';
import MessageScreen from '../sceens/MessagesScreen';



const Stack = createStackNavigator();

const AccountNavigator = () => (
    <Stack.Navigator 
        //mode= "modal"
        >
            <Stack.Screen name="Account" component={AccountScreen}  />
            <Stack.Screen name="Messages" component={MessageScreen}  />
    </Stack.Navigator>
)

export default AccountNavigator;  