import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { auth, db, loginApp } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';


// import { NativeBaseProvider, Box } from "native-base";



export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  var PasswordMatches = true;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSignUp = async () => {

    if (password != rePassword) {
      console.log("şifre eşleşmedi kontrol et");//toast message ekle
      PasswordMatches=false;
    }
    else {
      console.log("şifre eşleşti");//toast message ekle

      PasswordMatches=true;
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        password: password,
        displayName: user.displayName,
        // createdDate: Timestamp.fromDate(new Date()),
      });
      console.log(JSON.stringify(user, null, 2))
    }
    return
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

        <View style={{ display: 'flex' }}>
          <TextInput style={styles.input}
            label="Repeat the password"
            value={rePassword}
            onChangeText={(text) => setRepeatPassword(text)}
            secureTextEntry={!showPassword}
            error={!PasswordMatches}
          />

          {/*göz butonu */}
          <Button style={{ width: 10, marginTop: 10, }} icon="eye" col mode="text" onPress={togglePasswordVisibility} />

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

  }
)