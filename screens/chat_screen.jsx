import { View, Text, BackHandler, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/core";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  Bubble,
  Composer,
  GiftedAvatar,
  GiftedChat,
  InputToolbar,
  MessageText,
  Send,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, Avatar } from "react-native-paper";
import { useContext } from "react";
import { ThemeContext } from "../Theme";
import { useSelector } from "react-redux";

export default function ChatScreen({ navigation }) {
  const Theme = useContext(ThemeContext);
  const route = useRoute();

  const userID = auth.currentUser.uid;

  const chatID = route.params.chatId;
  const targetUserName = route.params.targetUserName;
  const targetUserImage = route.params.targetUserImage;
  const [messages, setMessages] = useState([])

  const chat = useSelector((state) => state.msgCounter.chats[chatID].messages);

  function timestampToDate(timestampData) {
    const milliseconds = timestampData.seconds * 1000 + Math.floor(timestampData.nanoseconds / 1000000);
    return Timestamp.fromMillis(milliseconds).toDate();
  }




  useEffect(() => {

    if (chat?.length) {
      setMessages(
        chat.map((element) => ({
          ...element,
          createdAt: timestampToDate(element.createdAt),
        })
        ))
    }
  }, [chat])


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

        containerStyle={{
          backgroundColor: Theme.backgroundColor,
          borderTopColor: Theme.senderBubble,
          borderTopWidth: 1,
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <View style={{}}>
        <IconButton

          size={24}
          style={{ marginBottom: -30 }}
          icon="arrow-right-bold"
          iconColor={Theme.senderBubble}
        />
        <Send
          {...props}
          label={"     "}
          sendButtonProps={{
            style: {
            },
          }}
        />
      </View>

    );
  }
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Theme.senderBubble, // Change this color for sent messages
          },
          left: {
            backgroundColor: Theme.receiverBubble, // Change this color for received messages
          },
        }}
      />
    );
  };

  const updateLastView = async () => {
    const chatRef = doc(db, "chats", chatID);
    const date = new Date();
    const lastView = Timestamp.fromDate(date);
    await updateDoc(chatRef, {
      [userID]: lastView,
    }).then(navigation.navigate("HomeScreen"));
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        updateLastView
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );


  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      marginTop: 4,
      borderBottomWidth: 1,
      borderBottomColor: Theme.secondaryContainer,
    },
  });

  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 1, backgroundColor: Theme.backgroundColor }}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={20}
            onPress={() => {

              updateLastView();
            }}
          />
          <Avatar.Image size={40} source={{ uri: targetUserImage }} />

          <Text
            style={{
              color: Theme.color,
              fontSize: 22,
              textAlign: "center",
              padding: 7,
            }}
          >
            {targetUserName}
          </Text>
        </View>
        <GiftedChat
          renderAvatar={() => <Avatar.Image size={36} source={{ uri: targetUserImage }} />}
          renderSend={renderSend}
          renderBubble={this.renderBubble}
          renderInputToolbar={renderInputToolbar}
          textInputProps={{ color: "white" }}
          messages={messages}
          onSend={(msg) => onSend(msg)}
          user={{
            _id: userID,
          }}
        />
      </SafeAreaView>
    </React.Fragment>
  );
}
