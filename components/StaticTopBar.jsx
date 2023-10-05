import { View, Text } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
import { ThemeContext } from "../Theme";
import { useContext } from "react";

export default function StaticTopBar({ text }) {
  const Theme = useContext(ThemeContext);
  
  return (
    <View
      style={{ 
        height: 25, 
        backgroundColor: Theme.topBar, 
        alignItems: "center",
        borderBottomWidth:2,
        borderBottomColor:'rgba(0,0,255,0.2)',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
  
    }}
    >
      <Text style={{ color: Theme.color, paddingTop: 0, fontSize: 14 }}>
        {text}
      </Text>
    </View>
  );
}
