import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { NativeBaseProvider, Box } from "native-base";



export default function SignUp({ navigation }) {

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }


  return (
    <SafeAreaProvider style={styles.container}>
      {/* <Avatar.Image style={styles.avatar} size={64} source={""} /> */}
      <View style={styles.view}>
        <TextInput style={styles.input}
          label="Email"
        // value={""}
        // onChangeText={""}
        />
        <TextInput style={styles.input}
          label="Password"
          // value={""}
          // onChangeText={""}
          secureTextEntry={true}

        />
        <View style={{display:'flex'}}>
        <TextInput style={styles.input}
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={showPassword}
        />
        <Button style={{ width: 20, }} icon="eye" mode="text" onPressOut={togglePasswordVisibility} />
        </View>
        




        <Button style={{ marginTop: 20, }} mode="contained-tonal" onPress={() => console.log('signup')}>
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