/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Auth} from 'aws-amplify';

interface HeaderComponentProps {
  searchValue: string;
  setSearchValue: (s: string) => void;
}

const Stack = createStackNavigator();

const HeaderComponent = ({
  searchValue,
  setSearchValue,
}: HeaderComponentProps) => {
  return (
    <SafeAreaView style={{backgroundColor: '#08b3fc'}}>
      <View
        style={{
          margin: 10,
          padding: 5,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Feather name="search" size={20} />
        <TextInput
          style={{
            height: 40,
            marginLeft: 10,
            padding: 3,
            color: '#0a0300',
            fontSize: 16,
          }}
          placeholder="Search by city or product..."
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
    </SafeAreaView>
  );
};
const HomeStack = ({Status}) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <HeaderComponent
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        ),
      }}>
      <Stack.Screen name={'HomeScreen' + Status} options={{title: 'Home'}}>
        {() => <HomeScreen searchValue={searchValue} Status={Status} />}
      </Stack.Screen>
      <Stack.Screen name={'ProductDetails' + Status}>
        {() => <ProductScreen Status={Status} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Groceries"
      drawerContent={props => {
        return (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
              <View
                style={{
                  height: 130,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: 270,
                    height: 120,
                  }}
                  source={{
                    uri: 'https://appimagesabrehet.s3.amazonaws.com/logo.png',
                  }}
                />
              </View>
              <DrawerItemList {...props} />
            </SafeAreaView>

            <DrawerItem
              label={() => <Text style={{color: 'red'}}>Logout</Text>}
              onPress={() => Auth.signOut()}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen name="Groceries">
        {() => <HomeStack Status="Groceries" />}
      </Drawer.Screen>
      <Drawer.Screen name="Electronics">
        {() => <HomeStack Status="Electronics" />}
    </Drawer.Screen>
      <Drawer.Screen name="Furniture">
        {() => <HomeStack Status="Furniture" />}
      </Drawer.Screen>
      <Drawer.Screen name="Jewelry and Extras">
        {() => <HomeStack Status="Jewelry" />}
  </Drawer.Screen>
      <Drawer.Screen name="Contact Us">
        {() => (
          <View style={styles.page}>
            {/* Render Product Component */}
            <Text>Email: mesobinternational@gmail.com</Text>
            <Text>Phone Number: +1 (571) 216-3509</Text>
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    flex: 1,
  },
  text: {
    fontSize: 70,
    fontWeight: 'bold',
  },
});

export default MyDrawer;
