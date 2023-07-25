import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { TextInput, Avatar, Button } from 'react-native-paper';
import { authState, logOutApp, loginApp } from '../firebase';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Chat from './chat';
import Profile from './profile';
import Search from './search';
import { StyleSheet } from 'react-native';


const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen({ navigation }) {
 

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {

      const uid = user.uid;
      console.log("giriş yapılmış")
    } else {

      navigation.navigate('LogIn')
    }
  });

  return (
    <Tab.Navigator >
    
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Search" component={Search} />

      <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>


  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});