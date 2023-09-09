import React, { useState } from "react";

import LogIn from "./screens/login";
import SignUp from "./screens/signup";
import HomeScreen from "./screens/home";
import ChatScreen from "./screens/chat_screen";
import VisitProfile from "./screens/visit_profile";
import CreateProfile from "./screens/create_profile";
import ParticipantsPage from "./screens/participants_page";

import { View, Text, StyleSheet, Dimensions,  } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { setAuthId, setUserData } from "./redux/authentication";
import { doc, getDoc } from "firebase/firestore";
import { ThemeContext } from "./Theme";
import { useContext } from "react";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

const Stack = createStackNavigator();

export default function Main() {
  const Theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const authId = useSelector((state) => state.authStatus.authId);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setAuthId(auth.currentUser.uid));
      } else {
        // dispatch(setUserData(null));
        dispatch(setAuthId(null));
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.backgroundColor,
    },
  });

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor={Theme.topBar} />
      <View
        style={{
          height: "100%",
          paddingTop:40
        }}
      >
        <NavigationContainer
          theme={{ colors: { background: Theme.backgroundColor } }}
        >
          <Stack.Navigator>
            {!authId ? (
              <>
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
              </>
            ) : (
              <>
                <Stack.Screen
                  name="HomeScreen"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateProfile"
                  component={CreateProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ChatScreen"
                  component={ChatScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="VisitProfile"
                  component={VisitProfile}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="ParticipantsPage"
                  component={ParticipantsPage}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}
