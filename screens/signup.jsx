import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// import { NativeBaseProvider, Box } from "native-base";



export default function SignUp({ navigation }) {
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRepeatPassword] = useState('');
  const [passwordMatches, setPasswordMatches] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const passwordCheck = () => {
    if (password != rePassword) {
      console.log("şifre eşleşmedi kontrol et");
      setPasswordMatches(true);
    }
    else {
      setPasswordMatches(false);
    } return 0; //// eşleştiği durum için gönderme yapabilirisin
  }


  return (
    <SafeAreaProvider style={styles.container}>

      <View style={styles.view}>
        <TextInput style={styles.input}
          label="Email"
          value={email}
          onChangeText={(text) => setMail(text)}
        />

        <TextInput style={styles.input}
          label="Password"
          value={password}
          onChangeText={(text) => { setPassword(text); }}
          secureTextEntry={!showPassword}
        />

        <View style={{ display: 'flex' }}>
          <TextInput style={styles.input}
            label="Repeat the password"
            value={rePassword}
            onChangeText={(text) => setRepeatPassword(text)}
            secureTextEntry={!showPassword}
            error={passwordMatches}
          />

          <Button style={{ width: 20 }} icon="eye" mode="text" onPress={togglePasswordVisibility} />

        </View>


        <Button style={{ marginTop: 20, }} mode="contained-tonal"
          onPress={() => {
            passwordCheck();
            getAuth();

          }}>
          Sign Up
        </Button>

        <Button style={{ marginTop: 10, alignItems: 'flex-end' }} onPress={() => navigation.navigate('LogIn')}>
          Log In
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
      backgroundColor: 'white',
    },

    input: {
      marginTop: 20,
      border: 0,
      backgroundColor: 'white',
    },

    // avatar: {

    // }
  }
)