import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  Divider,
  IconButton,
  List,
} from "react-native-paper";
import StaticTopBar from "../components/StaticTopBar";
import { useNavigation } from "@react-navigation/native";
import ChatScreen from "./chat_screen";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { updateMsgCounter } from "../redux/messageCounter";
import { useContext } from "react";
import { ThemeContext } from "../Theme";

export default function ChatList({ navigation }) {
  const currentUser = auth.currentUser.uid; // AUTH VERİSİ ID
  const [chats, setChats] = useState([]);
  const [onSnap, setOnSnap] = useState([]);

  const Theme = useContext(ThemeContext);

  let totalUnRead = 0;
  const dispatch = useDispatch();

  useEffect(() => {
    const docRef = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser)
    );
    const unsub = onSnapshot(docRef, (querySnapshot) => {
      console.log("ONSNAP ÇALIŞTI");
      setChats([]);
      setOnSnap(querySnapshot.docs);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    totalUnRead = 0;
    onSnap.map((doc) => {
      let targetUser;
      const chatData = doc;
      const chatUsers = doc.data().participants;
      if (chatUsers[0] == currentUser) {
        targetUser = chatUsers[1];
      } else targetUser = chatUsers[0];

      createTargetChats(chatData, targetUser);
    });
    dispatch(updateMsgCounter(totalUnRead));
  }, [onSnap]);

  const createTargetChats = async (x, y) => {
    let unreadCounter = 0;
    const lastView = x.data()[currentUser];
    const msgs = x.data().messages;

    if (msgs && msgs.length > 0) {
      for (const msg of msgs) {
        const targetTS = msg.createdAt;

        if (
          lastView.seconds === targetTS.seconds &&
          lastView.nanoseconds < targetTS.nanoseconds
        ) {
          unreadCounter++;
        } else if (lastView.seconds < targetTS.seconds) {
          unreadCounter++;
        } else break;
      }
    }

    totalUnRead = totalUnRead + unreadCounter;

    const docRef = doc(db, "users", y);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const newItem = {
        unreadMessages: unreadCounter,
        chatID: x.id,
        messages: x.data().messages,
        targetUserName: docSnap.data().displayName,
        targetUserImage: docSnap.data().storageProfileImageURL,
      };

      setChats((prevChats) => [...prevChats, newItem]);
    } else {
      console.log("No getTargetUser such document!");
    }
  };

  const updateLastView = async (targetChat) => {
    const date = new Date();
    const lastView = Timestamp.fromDate(date);
    const chatRef = doc(db, "chats", targetChat);
    await updateDoc(chatRef, {
      [currentUser]: lastView,
    });
  };

  return (
    <View>
      <SafeAreaView
        style={{ backgroundColor: Theme.backgroundColor, minHeight: "100%" }}
      >
        <StaticTopBar text={"Konuşmalar"} />

        <ScrollView>
          <View style={{ flex: 1, marginHorizontal: 10, marginBottom: 50 }}>
            {chats.map((chat, index) => (
              <React.Fragment key={index}>
                <List.Item
                  style={{
                    backgroundColor: Theme.component,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}
                  title={chat.targetUserName}
                  titleStyle={{ color: Theme.color }}
                  description={(chat.messages ?? [])[0]?.text ?? undefined}
                  descriptionStyle={{ color: Theme.color }}
                  left={() => (
                    <Avatar.Image
                      style={{ marginLeft: 5 }}
                      size={56}
                      source={{ uri: chat.targetUserImage }}
                    />
                  )}
                  right={() => (
                    <>
                      {chat.unreadMessages !== 0 ? (
                        <Badge size={20}>{chat.unreadMessages}</Badge>
                      ) : null}
                    </>
                  )}
                  onPress={() => {
                    navigation.navigate("ChatScreen", {
                      chatId: chat.chatID,
                      targetUserName: chat.targetUserName,
                      targetUserImage: chat.targetUserImage,
                    });
                    updateLastView(chat.chatID);
                  }}
                />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
