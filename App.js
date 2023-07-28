import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import LogIn from './screens/login';
import SignUp from './screens/signup';
import HomeScreen from './screens/home';
import { Appbar, Title } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import CreateProfile from './screens/create_profile';
// import '/screens/index.css';

const Stack = createStackNavigator();

export default function App() {
  console.log('app')

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator animationEnabled='true'>
        {/* <Stack.Screen name="createProfile" component={CreateProfile} options={{ headerShown: false }} /> */}
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false, title: 'SEA' }} />

      </Stack.Navigator>

    </NavigationContainer>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
