import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { loginApp, register } from '../firebase';

// import { NativeBaseProvider, Box } from "native-base";



export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRepeatPassword] = useState('');
  const [passwordMatches, setPasswordMatches] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }


  const handleSignUp = async e => {
    if (password != rePassword) {
      console.log("şifre eşleşmedi kontrol et");//toast message ekle
      setPasswordMatches(true);
    }
    else {
      setPasswordMatches(false);
      const user = await register(email, password)
      // console.log(JSON.stringify(user, null, 2))
      navigation.navigate('HomeScreen');
      console.log("user kaydı bloğu")

    } return 0; // eşleştiği durum için gönderme yapabilirisin
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

          {/*göz butonu */}
          <Button style={{ width: 10, marginTop:10, }} icon="eye" col mode="text" onPress={togglePasswordVisibility} />

        </View>


        <Button 
        buttonColor='#be75359f'
        textColor='white'
        style={{
          marginTop: 20,
        }}
          mode="contained-tonal"
          onPress={() => {
            handleSignUp();

          }}>
          Sign Up
        </Button>

        <Button 
        style={{
          marginTop: 10,
          alignItems: 'flex-end',
        }}
          onPress={() => navigation.navigate('LogIn')}>
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