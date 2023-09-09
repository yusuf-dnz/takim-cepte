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
  color: "#fff",
  softColor: "#d3d3d3",
  backgroundColor: "#13315c",
  component: "#1b4965",
  tabBar: "#bb9457",
  topBar: "transparent",
  tabBarIconActive: "white",
  tabBarIcon: "#ccc",
  modalColor: "#1b4965fa",
  modalPressable: "#3c6e7155",
  senderBubble: "#3c6e71",
  receiverBubble: "#eeeeee",
  cardShadow:"#3c6e71",
  secondaryContainer:"#dda15e",
  danger:"red",
  buttonPrimary:"#415a77",
  cardStart:"#8da9c4",
  cardMiddle:"#eef4ed",
  cardEnd:"transparent",
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
