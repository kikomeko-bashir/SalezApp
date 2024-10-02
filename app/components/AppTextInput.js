import React from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colors from '../config/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import defaultStyles from '../config/styles';



function AppTextInput({ icon, ...otherProps }) {

    return (
        <View style={styles.container}>
            {icon && <MaterialCommunityIcons name= {icon} size={25} color={colors.medium} style={styles.icon} />}
            <TextInput style={defaultStyles.text} {...otherProps} />
        </View>
    );

}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.light,
        borderRadius: 25,
        padding: 15,
        marginVertical: 10,
        
        flexDirection: 'row',
        width: '100%',

    },

    icon: {
        marginRight: 10,
    },

});


export default AppTextInput;