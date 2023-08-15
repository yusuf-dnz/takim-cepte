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

  // const [targetUserID, setTargetUserID] = useState("");

  // useEffect(() => {}, []);

 const [targetUserData, setTargetUserData] = useState([]);

  // const getTargetUserData = async () => {
  //   const docRef = doc(db, "users", targetUserID);
  //   const docSnap = await getDoc(docRef);
  //   setTargetUserData(docSnap.data());
  // };

  useEffect(() => {
    const docRef = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserID)
    );
    onSnapshot(docRef, (querySnapshot) => {
      const queryDatas = querySnapshot.docs.map((doc) => {
        const targetUser = doc
          .data()
          .participants.find((x) => x !== currentUserID);

        console.log(targetUser);

        // setTargetUserID(targetUser);
        getTargetUserData(targetUser);
        console.log("veri1")
      });

      setChats(querySnapshot.docs);
    });
    console.log("Mesajlar güncellendi");
  }, []);

  const getTargetUserData = async (x) => {
    // console.log("hello",targetUserID)
    const docRef = doc(db, "users", x);
    const docSnap = await getDoc(docRef);
    const stateData = targetUserData;
    stateData.push(docSnap.data())
    setTargetUserData(stateData)
  };
  console.log(targetUserData)

  return (
    <SafeAreaView>
      <View>
        <StaticTopBar text={"CHATS"} />

        <ScrollView>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            {chats.map((chat, index) => (
              <React.Fragment key={index}>
                <List.Item
                  title={chat
                    .data()
                    .participants.find((x) => x !== currentUserID)}
                  description={
                    (chat.data().messages ?? [])[0]?.text ?? undefined
                  }
                  left={() => (
                    <Avatar.Image
                      size={56}
                      source={{ uri: "https://picsum.photos/200/300" }}
                    />
                  )}
                  onPress={() =>
                    navigation.navigate("ChatScreen", { chatId: chat.id })
                  }
                />
                <Divider />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
