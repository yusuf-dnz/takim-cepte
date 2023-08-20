import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import LogIn from "./screens/login";
import SignUp from "./screens/signup";
import HomeScreen from "./screens/home";
import CreateProfile from "./screens/create_profile";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./screens/chat_screen";
import VisitProfile from "./screens/visit_profile";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  console.log("app");
  const [loaded] = useFonts({
    Yatra: require("./assets/fonts/YatraOne-Regular.ttf"),
    Kanit: require("./assets/fonts/Kanit-LightItalic.ttf"),
    KanitThin: require("./assets/fonts/Kanit-Thin.ttf"),
    CabinRegular: require("./assets/fonts/Cabin-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
      

      <View style={styles.container}>
      <ExpoStatusBar style="light" />

        <NavigationContainer 
        theme={{
          colors: {
            background: '#282A3A', 
          },
        }}>
          <Stack.Navigator>
            <Stack.Screen
              name="LogIn"
              component={LogIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateProfile"
              component={CreateProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false, title: "SEA" }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{ headerShown: true, title: "Chat List" }}
            />
            <Stack.Screen
              name="VisitProfile"
              component={VisitProfile}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282A3A",
    height: "100%",
  },
});
