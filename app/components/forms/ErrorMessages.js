import React from "react";
import { StyleSheet } from "react-native";

import AppText from "../AppText";


function ErrorMessage({ error, visible }) {
    if (!visible ||!error) return null;

    return (
        <AppText style={styles.error}>{error}</AppText>
    );
}



const styles = StyleSheet.create({
    error: {
        color: "red",
        marginBottom: 10
    }
 
});


export default ErrorMessage;