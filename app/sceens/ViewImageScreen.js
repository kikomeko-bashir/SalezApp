import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';

function ViewImageScreen(props) {
    return (
        <View style={styles.container}>
            <View style={styles.closeIcon}>
                <MaterialCommunityIcons name='close' size={35} color={colors.white} />
            </View>

            <View style={styles.deleteIcon}>
                <MaterialCommunityIcons name='trash-can-outline' size={35} color={colors.white} />
            </View>
            <Image 
            resizeMode='contain' 
            style={styles.image} 
            source={require('../assets/kikooo.jpg')}/>
        </View>
        
    );
}


const styles = StyleSheet.create({
    closeIcon: {
        position: 'absolute',
        top: 40,
        left: 30,
    },

    container: {
        flex: 1,
        backgroundColor: colors.black,
    },

    deleteIcon: {
        position: 'absolute',
        top: 40,
        right: 30,
    },

    image : {
        width: '100%',
        height: '100%',
        
    },

});

export default ViewImageScreen;