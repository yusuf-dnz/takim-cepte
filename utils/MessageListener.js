import { View, Text } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setChatData } from "../redux/messages";
import chat_user_assets from "./getChatAssets";
import { useState } from "react";

export default async function MessageListener() {
  const [targetUsers, setTargetUsers] = useState([]);

  const dispatch = useDispatch();
  const authId = auth.currentUser.uid;
  const docRef = query(
    collection(db, "chats"),
    where("participants", "array-contains", authId)
  );

  useEffect(() => {
    const unsub = onSnapshot(docRef, (querySnapshot) => {
      console.log("messages update");
      let arr = [];
      querySnapshot.docChanges().forEach((change) => {
        let chat = {};
        let unreadCounter = 0;
        const _data = change.doc.data();
        const lastView = _data[authId];

        if (_data.messages.length != 0) {
          const lastMessageOwner = _data.messages[0].user._id;
          for (let msg of _data.messages) {
            const targetTimestamp = msg.createdAt;
            if (authId == lastMessageOwner) {
              break;
            } else if (
              lastView.seconds === targetTimestamp.seconds &&
              lastView.nanoseconds < targetTimestamp.nanoseconds
            ) {
              unreadCounter++;
            } else if (lastView.seconds < targetTimestamp.seconds) {
              unreadCounter++;
            } else break;
          }
        }

        chat[change.doc.id] = { ..._data, unreadCount: unreadCounter };
        dispatch(setChatData(JSON.stringify(chat)));
        const targetUser = _data.participants.filter(
          (_id) => _id !== authId
        )[0];
        arr.push({ chatId: change.doc.id, targetUser: targetUser });
      });
      setTargetUsers(arr);
    });
  }, []);

  useEffect(() => {
    targetUsers.map((element) => {
      _retrieveData(element.targetUser, element.chatId);
    });
  }, [targetUsers]);
}

_retrieveData = async (id, chatId) => {
  try {
    const value = await AsyncStorage.getItem(chatId);
    if (value == null) {
      chat_user_assets(id, chatId);
      // console.log("kayıtsız", id, chatId);
    }
  } catch (error) {
    console.log(error);
  }
};
