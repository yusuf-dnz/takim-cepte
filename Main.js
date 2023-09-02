import React, { useState } from "react";

import LogIn from "./screens/login";
import SignUp from "./screens/signup";
import HomeScreen from "./screens/home";
import ChatScreen from "./screens/chat_screen";
import VisitProfile from "./screens/visit_profile";
import CreateProfile from "./screens/create_profile";
import ParticipantsPage from "./screens/participants_page";

import { View, Text, StyleSheet } from "react-native";
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

const Stack = createStackNavigator();

export default function Main() {
  const Theme = useContext(ThemeContext);

  const [userDoc, setUserDoc] = useState(null);

  const CurrentUser = useSelector((state) => state.authStatus.userData);

  // console.log(user);

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        x(auth.currentUser.uid);
      } else {
        dispatch(setUserData(null));
      }
    });
  }, []);

  const x = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    setUserDoc(docSnap.data());
  };
  useEffect(() => {
    dispatch(setUserData(JSON.stringify(userDoc)));
  }, [userDoc]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      height: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <NavigationContainer theme={{ colors: { background: Theme.backgroundColor } }}>
        <Stack.Navigator 
        >
          {!CurrentUser ? (
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
                name="CreateProfile"
                component={CreateProfile}
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
  );
}


