
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { NativeBaseProvider, Box } from "native-base";


export default function LogIn({ navigation }) {
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
        />

        <Button style={{ marginTop: 20, }} mode="contained-tonal" onPress={() => console.log('Log In')}>
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

    // avatar: {

    // }
  }
)
