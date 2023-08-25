import { View, Text, BackHandler, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import { Timestamp, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
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

export default function ChatScreen({ navigation }) {
  const route = useRoute();
  const chatID = route.params.chatId;
  const targetUserName = route.params.targetUserName;
  const targetUserImage = route.params.targetUserImage;
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
    return <Send {...props} />;
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

  const updateLastView = async () => {
    const date = new Date();
    const lastView = Timestamp.fromDate(date);
    const chatRef = doc(db, "chats", chatID);
    await updateDoc(chatRef, {
      [userID]: lastView,
    });
  };

  useEffect(() => {
    const backAction = () => {
      // Kullanıcı geri tuşuna bastığında veya uygulamadan çıktığında
      // Firebase'e veriyi gönderme işlemini burada yapabilirsiniz.
      updateLastView();
       // false döndürerek geri tuşunun varsayılan işlevini sürdürebilirsiniz.
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Temizleme işlemi
  }, []);

  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#282A3A" }}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={20}
            onPress={() => {
              navigation.navigate("HomeScreen");
              updateLastView();
            }}
          />
          <Avatar.Image size={40} source={{ uri: targetUserImage }} />

          <Text
            style={{
              color: "white",
              fontSize: 22,
              textAlign: "center",
              padding: 7,
              fontFamily: "Kanit",
            }}
          >
            {targetUserName}
          </Text>
        </View>
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
      </SafeAreaView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 5,
  },
});
