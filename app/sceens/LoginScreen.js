import React from 'react';
import * as Yup from 'yup';
import { View, Text, StyleSheet, Image } from 'react-native';
import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required().label("Email"),
    password: Yup.string().min(4).required().label("Password"),
});

function LoginScreen(props) {
    return (
        <Screen style={styles.container}>
            <Image 
                style={styles.logo}
                source={require("../assets/logo_kiko.png")} 
            />

            <AppForm
                initialValues={{ email: '', password: '' }}
                onSubmit={values => console.log(values)}
                validationSchema={validationSchema}
            >
                <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="email"
                    keyboardType="email-address"
                    name="email"
                    placeholder="Email"
                    textContentType="emailAddress"
                />

                <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock"
                    name="password"
                    placeholder="Password"
                    secureTextEntry={true}
                    textContentType="password"
                />

                <SubmitButton title="Login" />
            </AppForm>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 100,
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 80,
        marginTop: 50,
    },
});

export default LoginScreen;
