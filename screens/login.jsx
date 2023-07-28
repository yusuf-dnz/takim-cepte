
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { auth, authState, loginApp } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function LogIn({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleLogIn = async () => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    // console.log(JSON.stringify(user, null, 2))
    navigation.navigate('HomeScreen');// Cycle sorunu yok
  }



  return (
    <SafeAreaProvider style={styles.container}>

      <View style={styles.view}>

        <TextInput style={styles.input}
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput style={styles.input}
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
        />

        <Button style={{ width: 20, alignItems: 'flex-end' }} icon="eye" mode="text" onPressOut={togglePasswordVisibility} />

        <Button style={{ marginTop: 20, backgroundColor: '#be7535' }} mode="contained-tonal" onPress={() => {
          handleLogIn(email, password);
        }}>
          Log In
        </Button>

        <Button style={{ marginTop: 10, alignItems: 'flex-end' }} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Button>

      </View>

    </SafeAreaProvider>
  )

}


const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,

    },

    view: {
      paddingTop: 150,

    },

    input: {
      marginTop: 20,
      border: 0,
      backgroundColor: 'white',
    },

  }
)
