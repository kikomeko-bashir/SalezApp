import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Modal, Button, Pressable, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AppText from './AppText';
import Screen from './Screen';
import PickerItem from './PickerItem';

function AppPicker({ 
    icon, 
    placeholder, 
    numberOfColumns = 1, 
    onSelectItem, 
    items, 
    PickerItemComponent = PickerItem,  // Removed unnecessary {}
    selectedItem 
}) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <Pressable onPress={() => setModalVisible(true)}>
                <View style={styles.container}>
                    {icon && (
                        <MaterialCommunityIcons 
                            name={icon} 
                            size={25} 
                            color={colors.medium} 
                            style={styles.icon}
                        />
                    )}
                    <AppText style={styles.text}>{selectedItem ? selectedItem.label : placeholder}</AppText>
                    <MaterialCommunityIcons 
                        name="chevron-down" 
                        size={25} 
                        color={defaultStyles.colors.medium} 
                    />
                </View>
            </Pressable>
            <Modal visible={modalVisible} animationType="slide">
                <Screen>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.value.toString()}
                        numColumns={numberOfColumns}
                        renderItem={({ item }) => (
                            <PickerItemComponent
                                item={item}
                                label={item.label}
                                onPress={() => {
                                    setModalVisible(false);
                                    onSelectItem(item); 
                                }}
                            />
                        )}
                    />
                </Screen>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
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
    text: {
        flex: 1,
    },
});

export default AppPicker;
