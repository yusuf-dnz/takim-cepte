import { View, Text } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";

export default function StaticTopBar({ text }) {
  return (
    <View
      style={{ 
        height: 25, 
        backgroundColor: "transparent", 
        alignItems: "center",
        borderBottomWidth:2,
        borderBottomColor:'rgba(0,0,255,0.2)',
  
    }}
    >
      <Text style={{ color: "#EEEEEE", paddingTop: 0, fontSize: 14 }}>
        {text}
      </Text>
    </View>
  );
}
