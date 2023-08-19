import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ChatList from "./chat_list";
import Profile from "./profile";
import Search from "./search";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, Button } from "react-native-paper";
import {
  BottomTabBarHeightContext,
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  return (
    <Tab.Navigator
      style={{backgroundColor:'black'}}
      initialRouteName="Search"
      activeColor="#fff"
      inactiveColor="#888888"
      labeled={false}
      barStyle={{
        backgroundColor: "#282A3A",
        height: 60,
        borderTopWidth: 2,
        borderTopColor: "gray",
        shadowColor: "blue",
      }}
    >
      <Tab.Screen
        name="ChatList"
        options={{
          tabBarColor: "blue",
          tabBarBadge: "2",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />
          ),
        }}
        component={ChatList}
      />

      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons color={color} name="earth" size={26} />
          ),
        }}
        component={Search}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              color={color}
              name="account-arrow-right"
              size={26}
            />
          ),
        }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
