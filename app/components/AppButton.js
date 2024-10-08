import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';


import colors from '../config/colors.js';

function AppButton({title, onPress, color = "primary"}) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor:colors[color]}]} onPress={onPress}>
            <View >
                <Text style= {styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({ 
   button : { 
        backgroundColor: colors.primary,
        borderRadius:25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        marginVertical: 10,
   
    },
    text: {
        color: colors.white,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})

export default AppButton;