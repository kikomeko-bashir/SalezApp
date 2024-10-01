import React from 'react';
import { Text, StyleSheet } from 'react-native';

function AppText({ children, style }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#000',
  },
});

export default AppText;
