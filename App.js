import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import "react-native-gesture-handler";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useFonts } from "expo-font";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import Main from "./Main";
import { ThemeContext, theme } from "./Theme";
import { Dimensions, Text, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useTheme } from "react-native-paper";

export default function App() {
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
    <React.Fragment>
      <ThemeContext.Provider value={theme}>
        <Provider store={store}>
          <View
            style={{
              height: "100%",
              backgroundColor: theme.backgroundColor,
            }}
          >
            <Main />
          </View>
        </Provider>
        <Toast />
      </ThemeContext.Provider>
    </React.Fragment>
  );
}
