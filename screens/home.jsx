import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { TextInput, Avatar, Button } from 'react-native-paper';
import { authState, logOutApp, loginApp } from '../firebase';




export default function HomeScreen({navigation}) {
    const handleLogOut = async e => {
        const user = await logOutApp();
        navigation.navigate('LogIn');
      }

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
    <View>
      <Text>home screen</Text>
      <Button 
        style={{
          marginTop: 10,
          alignItems: 'flex-end',
        }}
          onPress={() => handleLogOut() }>
          Çıkış yap
        </Button>
    </View>
  )
}