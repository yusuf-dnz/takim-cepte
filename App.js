import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import LogIn from './screens/login';
import SignUp from './screens/signup';
import { Appbar, Title } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />

        {/* </SafeAreaProvider> */}
        {/* <SafeAreaProvider> */}
        {/* <StatusBar style="auto" /> */}
        {/* <LogIn /> */}




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
