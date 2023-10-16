import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

export default function chat_user_assets(targetUser, chatId) {
  const authId = auth.currentUser.uid;

  console.log("chat_user_assets", targetUser);

  const getTargetUser = async () => {
    const docRef = doc(db, "users", targetUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //   console.log("document exist", docSnap.data());
      const obj = {
        userPicture: docSnap.data().storageProfileImageURL,
        userName: docSnap.data().userName,
      };
      try {
        await AsyncStorage.setItem(chatId, JSON.stringify(obj));
        console.log("storage e yazdırıldı");
      } catch (error) {}
    } else {
      console.log("No such chat_user_assets document!", targetUser);
    }
  };
  getTargetUser();
}
