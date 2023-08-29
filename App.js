import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useFonts } from "expo-font";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import Main from "./Main";

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
    <>
      <Provider store={store}>
        <ExpoStatusBar style="light" />
        <Main/>
      </Provider>
    </>
  );
}
