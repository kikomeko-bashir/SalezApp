import React, { useRef }from 'react';
import {StyleSheet, View} from 'react-native';
import ImageInput from './ImageInput';
import { ScrollView } from 'react-native';

function ImageInputList({ imageUris = [], onRemoveImage, onAddImage }) {
    const scrollView = useRef();
    

    return (
        <View>
            <ScrollView 
                ref={scrollView} 
                horizontal 
                onContentSizeChange={() => scrollView.current.scrollToEnd()}>
                    <View style={styles.container}>
                        {imageUris.map((uri) => (
                            <View key={uri} style={styles.image}>
                                <ImageInput 
                                imageUri={uri} 
                                onChangeImage={() => onRemoveImage(uri)}
                                /> 
                            </View>
                        ))}
                        <ImageInput onChangeImage={(uri) => onAddImage(uri)} />

                    </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    image: {
        marginRight: 5,
        marginLeft:5
    }, 
    kiko: {
        
        
    }
});

export default ImageInputList; 