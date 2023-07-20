import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Avatar , Button} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { NativeBaseProvider, Box } from "native-base";

export class LogIn extends Component {
  render() {
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

          <Button style={{marginTop:20,}}  mode="contained-tonal" onPress={() => console.log('Pressed')}>
            Giriş Yap
          </Button>
        </View>
      </SafeAreaProvider>
    )
  }
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
export default LogIn