import { View, Text, Image, ScrollView, ImageBackground, ImageBackgroundComponent } from 'react-native'
import React, { useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { TextInput, Avatar, Button, Title } from 'react-native-paper';
import { authState, logOutApp, loginApp } from '../firebase';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Chat from './chat';
import Profile from './profile';
import Search from './search';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageBackgroundBase } from 'react-native';
import { useTheme } from 'react-native-paper';



const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";
  theme.colors.primaryContainer= "transperent";


  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {

      const uid = user.uid;
      navigation.navigate('HomeScreen')

      console.log("giriş yapılmış")
    } else {

      navigation.navigate('LogIn')
    }
  });

  return (


    <Tab.Navigator
      initialRouteName="Home"
    
      barStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)', height: 60,  }}
      shifting='true'
      tabBarOptions={{
        activeBackgroundColor: 'transparent',}}
      
    >
      <Tab.Screen name="Chat" options={{ 
        title: '', tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="chat" color={'#fff'} size={26} />
        ),
      }} component={Chat} />

      <Tab.Screen name="Search" options={{
        title: '',

        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="earth" color={'#fff'} size={26} />
        ),
      }} component={Search} />

      <Tab.Screen name="Profile" options={{
        title: '',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account-arrow-right" color={'#fff'} size={26} />
        ),
      }} component={Profile} />

    </Tab.Navigator>


  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});