import React from "react";

const Themes = {
  dark: {
    color: "blue",
    backgroundColor: "black",
  },
  light: {
    color: "black",
    backgroundColor: "white",
  },
};

export let theme = {
  color: "white",
  softColor: "#eeeeee77",
  backgroundColor: "#0b2027",
  component: "#3c6e7155",
  tabBar: "#3c6e71",
  topBar: "#3c6e71",
  tabBarIconActive: "white",
  tabBarIcon: "#ccc",
  modalColor: "#0b2027",
  modalPressable: "#3c6e7155",
  senderBubble: "#3c6e71",
  receiverBubble: "#eeeeee",
  cardShadow:"#3c6e71",
};

export function selectTheme(x) {
  switch (x) {
    case dark:
      theme = Themes.dark;
      break;
    case light:
      theme = Themes.light;
      break;
    default:
      theme = Themes.light;
  }
}
export const ThemeContext = React.createContext();
