import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import Icon from '../components/Icon';
import colors from '../config/colors';
import ListItemSeparatorComponent from '../components/ListItemSeparator';

const menuItems = [
  {
    title: 'My Listings',
    Icon: {
      name: 'format-list-bulleted',
      backgroundColor: colors.primary,
    },
  },
  {
    title: 'My Messages',
    Icon: {
      name: 'email',
      backgroundColor: colors.secondary,
    },
  },
];

function AccountScreen(props) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title="Kikomeko Bashir"
          subTitle="kikomekobashir29@gmail.com"
          image={require('../assets/kikooo.jpg')}
        />
      </View>

      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparatorComponent}
          renderItem={({ item }) => ( // Corrected to destructure 'item'
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.Icon.name}
                  backgroundColor={item.Icon.backgroundColor}
                />
              }
            />
          )}
        />
      </View>
      <ListItem
        title= "Log Out"
        IconComponent={
            <Icon
              name="logout"
              backgroundColor='#ffe66d'
              
            />
  
        }/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },

  screen: {
    backgroundColor: colors.light,
  },


});

export default AccountScreen;
