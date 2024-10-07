import React from 'react';
import Constants from 'expo-constants';

import { SafeAreaView, StyleSheet, View } from'react-native';

function Screen ({children, style}){
    return (
        <SafeAreaView style={[styles.screen, style ]}>
            <View style={[styles.veiw, style]} >
                {children}
            </View>
            
        </SafeAreaView>
    );

}


const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight,
        flex:1,
    },
    veiw:{
        flex:1,
    },
});

export default Screen;