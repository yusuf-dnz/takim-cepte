import { View, Text, BackHandler, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ChatList from "./chat_list";
import Profile from "./profile";
import Search from "./search";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, Button } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setAuthId } from "../redux/authentication";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { ThemeContext } from "../Theme";

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  const Theme = useContext(ThemeContext);



  const msgCount = useSelector((state) => state.msgCounter.value);

  return (
    <>
      <Tab.Navigator
      
        screenOptions={{
          
          // tabBarActiveBackgroundColor:'green',
          tabBarInactiveTintColor: Theme.tabBarIcon,
          tabBarActiveTintColor: Theme.tabBarIconActive,
          headerShown: false,
          tabBarStyle: {
            
            borderTopWidth:0,
            backgroundColor: Theme.tabBar,
            height:35,
            borderTopLeftRadius:10,
            borderTopRightRadius:10
            
          },
          tabBarShowLabel: false,
        }}
        style={{ backgroundColor: "black" }}
        initialRouteName="Search"
        activeColor="#fff"
        inactiveColor="#888888"
        labeled={false}
        
      >
        <Tab.Screen
          name="ChatList"
          options={{
            tabBarBadge: msgCount !== 0 ? msgCount : null,
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
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
