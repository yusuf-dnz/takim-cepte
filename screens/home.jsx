import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ChatList from "./chat_list";
import Profile from "./profile";
import Search from "./search";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{ backgroundColor: "rgb(255, 200, 0)" }}
      tabBarOpr
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ChatList"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={"blue"} size={26} />
          ),
        }}
        component={ChatList}
      />

      <Tab.Screen
        name="Search"
        options={{
          title: "Search",

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="earth" color={"blue"} size={26} />
          ),
        }}
        component={Search}
      />

      <Tab.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-arrow-right"
              color={"blue"}
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
