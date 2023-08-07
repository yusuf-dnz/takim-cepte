import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import LogIn from './screens/login';
import SignUp from './screens/signup';
import HomeScreen from './screens/home';
import CreateProfile from './screens/create_profile';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
// import '/screens/index.css';
import ChatScreen from './screens/chat_screen';

const Stack = createStackNavigator();

export default function App() {
  console.log('app')

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator animationEnabled='true'>

        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false, title: 'SEA' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: true, title: 'Chat List' }} />

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
