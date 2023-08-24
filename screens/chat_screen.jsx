import { View, Text, BackHandler } from "react-native";
import React, { useCallback } from "react";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  Bubble,
  Composer,
  GiftedAvatar,
  GiftedChat,
  InputToolbar,
  MessageText,
  Send,
} from "react-native-gifted-chat";

export default function ChatScreen() {
  const route = useRoute();
  const chatID = route.params.chatId;
  const userID = auth.currentUser.uid;

  const [userProfileData, setUserProfileData] = useState({});
  useEffect(() => {
    const getUserProfile = async () => {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfileData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    getUserProfile();
  }, []);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messages = onSnapshot(doc(db, "chats", chatID), (doc) => {
      setMessages(doc.data()?.messages ?? []);
    });
  }, [chatID]);

  const onSend = async (m = []) => {
    const docRef = doc(db, "chats", chatID);
    await updateDoc(
      docRef,
      {
        messages: GiftedChat.append(messages, m),
      },
      { merge: true }
    );
  };

  function renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        optionTintColor={{}}
        containerStyle={{
          backgroundColor: "#00000055",
          borderTopColor: "#E8E8E8",
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send  {...props}  />
    );
  }
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#4455ff99", // Change this color for sent messages
          },
          left: {
            backgroundColor: "white", // Change this color for received messages
          },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#282A3A" }}>
      <GiftedChat
        renderSend={renderSend}
        renderBubble={this.renderBubble}
        renderInputToolbar={renderInputToolbar}
        textInputProps={{ color: "white" }}
        alwaysShowSend={true}
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          avatar: userProfileData.storageProfileImageURL,
        }}
      />
    </View>
  );
}
