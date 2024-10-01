import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { View, StyleSheet } from'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';


function ListItemDeleteAction({ onPress}) {

    <TouchableWithoutFeedback onPress={ onPress }>
        <View style={styles.container}>
            <MaterialCommunityIcons name="trash-can" size={35} />
        </View>
    </TouchableWithoutFeedback>

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.danger,
        width: 70,
        justifyContent: 'center',
    }
})

export default ListItemDeleteAction;