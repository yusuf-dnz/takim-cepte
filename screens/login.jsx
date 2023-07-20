import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NativeBaseProvider, Box } from "native-base";

export class LogIn extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <TextInput
          label="Email"
          value={""}
          onChangeText={text => setText("text")}
        />
      </SafeAreaProvider>
    )
  }
}

export default LogIn