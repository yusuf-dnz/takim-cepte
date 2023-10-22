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
import { useDispatch, useSelector } from "react-redux";
import { updateMsgCounter } from "../redux/messages";
import { useContext } from "react";
import { ThemeContext } from "../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ChatList({ navigation }) {
  const currentUser = auth.currentUser.uid; // AUTH VERİSİ ID
  const Theme = useContext(ThemeContext);

  const dispatch = useDispatch();
  const chats = useSelector((state) => state.msgCounter.chats);
  const [chatAssets, setChatAssets] = useState([])
  let chatIds = Object.keys(chats);



  useEffect(() => {
    let totalUnread = 0;
    chatIds.forEach(element => {
      if (chats[element].unreadCount > 0) { totalUnread++ }
    });
    dispatch(updateMsgCounter(totalUnread));
  }, [chats])



  useEffect(() => {
    getMultiple = async () => {
      let values
      try {
        values = await AsyncStorage.multiGet(chatIds)
      } catch (e) {
        // read error
      }
      setChatAssets(values)
      // console.log(values)
    }
    getMultiple();
  }, [chats])

  const [data, setData] = useState({});
  useEffect(() => {
    // console.log(chatAssets)
    let obj = {};
    chatAssets.forEach((x) => {
      const key = x[0];
      obj[key] = JSON.parse(x[1]);
    })
    setData(obj)
  }, [chatAssets])



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
        {/* <StaticTopBar text={"Konuşmalar"} /> */}

        <ScrollView style={{ flex: 1, marginHorizontal: 10, marginBottom: 50, height: "100%", }}>
          {/* <Text>{x}</Text> */}

          {chatIds.length > 0 ? (
            <>
              {chatIds.map((id, index) => (
                <React.Fragment key={index}>
                  {chats[id].messages.length > 0 ? (
                    <List.Item
                      style={{
                        backgroundColor: Theme.component,
                        borderRadius: 5,
                        marginVertical: 5,
                      }}
                      title={"@" + data[id]?.userName}
                      titleStyle={{ color: Theme.color }}
                      description={(chats[id].messages ?? [])[0]?.text ?? undefined}
                      descriptionStyle={{ color: Theme.color }}
                      left={() => (
                        <Avatar.Image
                          style={{ marginLeft: 5 }}
                          size={56}
                          source={{ uri: data[id]?.userPicture }}
                        />
                      )}
                      right={() => (
                        <>
                          {chats[id].unreadCount !== 0 ? (
                            <Badge
                              style={{
                                position: "absolute",
                                top: "30%",
                                right: "5%",
                              }}
                              size={20}
                            >
                              {chats[id].unreadCount}
                            </Badge>
                          ) : null}
                        </>
                      )}
                      onPress={() => {
                        navigation.navigate("ChatScreen", {
                          chatId: id,
                          targetUserName: data[id]?.userName,
                          targetUserImage: data[id]?.userPicture,
                        });
                        updateLastView(id);
                      }}
                    />
                  ) : (<>
                  </>)}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              <View
                style={{
                  marginTop: "80%",
                  display: "flex",
                  alignItems: "center",
                  height: "100%"
                }}
              >
                <Text style={{ color: Theme.color }}>Henüz mesajın yok! </Text>
                <Text style={{ color: Theme.color }}>Etkinlikler ve keşfetten sohbet başlat. </Text>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
