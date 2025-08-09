import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import colors from '../config/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function ImageInput({ imageUri, onChangeImage }) {
    useEffect (() => {
        requestPermission();
    }, []) 
    
    const requestPermission = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) alert('Enable permissions to access the media library.');
    };
    
    const handlePress = () => {
        if(!imageUri) selectImage();
        else Alert.alert('Delete', 'Are you sure you want to delete this image', [
            {text: 'yes', onPress: () => onChangeImage(null) },
            { text: 'No' }
        ])
    }
    const selectImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images', // Simplified - just use string instead of constant
          quality: 0.5,
          allowsEditing: true, // Allow basic editing
          aspect: [1, 1], // Square aspect ratio
        });
  
        if (!result.canceled) {
          onChangeImage(result.assets[0].uri); 
        }
      } catch (error) {
        console.log('Error reading an image', error);
      }
    };
    return (
        <TouchableWithoutFeedback onPress = {handlePress}>
            <View style={styles.container}>
            {!imageUri && (
                <MaterialCommunityIcons color={colors.medium} name="camera" size={40} />
            )}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden",
    height: 100,
    width: 100,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export default ImageInput; // Export as ImageInput (uppercase)