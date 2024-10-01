import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppText from "./AppText";


import colors from "../config/colors";
import { TouchableHighlight } from "react-native";

function ListItem({title, subTitle, image, onPress}){

    return(
        <TouchableHighlight
        underlayColor={colors.light} 
        onPress={onPress}>
            <View style={styles.container}>
                <Image style={styles.image} source={image}/>
                <View>
                    <AppText style={styles.title}>{title}</AppText>
                    <AppText style={styles.subTitle}>{subTitle}</AppText>
                </View>
            </View>
        </TouchableHighlight>
    );
}


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        padding: 10,
    },
    image:{
        width: 70,
        height:70,
        borderRadius: 35,
        marginRight: 10
    },

    title: {
        fontSize: 18,
        fontWeight: 600,
    },
    subTitle: {
        fontSize: 16,
        color: colors.medium,
    },

})

export default ListItem;