import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';

function WelcomeScreen({ navigation }) {  // Destructure navigation from props
    return (
        <ImageBackground 
            blurRadius={10}
            style={styles.background} 
            source={require('../assets/background.jpg')} 
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/logo_kiko.png')}/>
                <Text style={styles.tagline}>Sell What You Don't Need</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <AppButton title="Login" onPress={() => navigation.navigate("Login")} />
                <AppButton title="Register" color="secondary" onPress={() => navigation.navigate("Register")} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonsContainer: {
        padding: 20,  // Updated from '20px' to '20'
        width: '100%',
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        position: 'absolute',
        top: 90,
        alignItems: 'center',
    },
    tagline: {
        fontSize: 24,
        fontWeight: '600',
        paddingVertical: 20,
    },
});

export default WelcomeScreen;
