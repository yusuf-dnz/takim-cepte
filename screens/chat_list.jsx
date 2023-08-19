import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Divider, IconButton, List } from "react-native-paper";
import StaticTopBar from "../components/StaticTopBar";
import { useNavigation } from "@react-navigation/native";
import ChatScreen from "./chat_screen";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ChatList({ navigation }) {
  const currentUserID = auth.currentUser.uid;
  const [chats, setChats] = useState([]);
  const [onSnap, setOnSnap] = useState([]);

  useEffect(() => {
    const docRef = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserID)
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
    setChats([])
    onSnap.map((doc) => {
      let targetUser;
      const chatData = doc;
      const chatUsers = doc.data().participants;
      if (chatUsers[0] == currentUserID) {
        targetUser = chatUsers[1];
      } else targetUser = chatUsers[0];

      createTargetChats(chatData, targetUser);
    });
  }, [onSnap]);

  const createTargetChats = async (x, y) => {
    // console.log(chatsArray)

    const docRef = doc(db, "users", y);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log(x.messages)
      // console.log("Y",JSON.stringify(docSnap.data(),null,2))

      const newItem = {
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

  return (
    <View style={{backgroundColor:'#282A3A'}}>
      <SafeAreaView style={{backgroundColor:'#282A3A',minHeight:'100%'}}>
          <StaticTopBar text={"CHATS"} />

          <ScrollView>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              {chats.map((chat, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={chat.targetUserName}
                    titleStyle={{color:'#EEEEEE'}}
                    description={(chat.messages ?? [])[0]?.text ?? undefined}
                    descriptionStyle={{color:'#EEEEEE'}}
                    left={() => (
                      <Avatar.Image
                        size={56}
                        source={{ uri: chat.targetUserImage }}
                      />
                    )}
                    onPress={() =>
                      navigation.navigate("ChatScreen", { chatId: chat.chatID })
                    }
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
      </SafeAreaView>
    </View>
  );
}
