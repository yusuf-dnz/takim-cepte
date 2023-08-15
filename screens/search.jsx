import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Button,
  Image,
  ImageComponent,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Divider, IconButton, List } from "react-native-paper";
import { auth, db, eventLister } from "../firebase";
import StaticTopBar from "../components/StaticTopBar";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
  addDoc,
  query,
  where,
  or,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search({ navigation }) {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const currentUserID = auth.currentUser.uid;

  useEffect(() => {
    var eventArray = [];
    const eventLister = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        eventArray.push(doc.data());
      });
      setEvents(eventArray);
      // console.log(events)
    };

    eventLister();
  }, []);

  useEffect(() => {
    var userArray = [];
    const userLister = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        userArray.push(doc.data());
      });

      setUsers([...userArray]);
    };

    userLister();
  }, []);

  const createChat = async (targetID) => {
    const docRef = query(
      collection(db, "chats"),
      or(
        where("participants", "==", [targetID, currentUserID]),
        where("participants", "==", [currentUserID, targetID])
      )
    );
    const querySnapshot = await getDocs(docRef);
    // console.log(querySnapshot.empty)
    if (querySnapshot.empty) 
    { 
      const create = await addDoc(collection(db, "chats"), {
        participants: [currentUserID, targetID],
      });
      // console.log(create.id)
      console.log("chat oluşturuldu");
      navigation.navigate("ChatScreen", { chatId: create.id });


    } 
    else 
    {
      console.log(querySnapshot.docs[0].id);
      navigation.navigate("ChatScreen", { chatId: querySnapshot.docs[0].id });
    }
  };

  return (
    <View>
      <SafeAreaView>
        <StaticTopBar text={"COMMUNITY"} />
        <ScrollView>
          <View style={{ flex: 1, marginBottom: 100 }}>
            <View>
              {events.map((event, index) => (
                <React.Fragment key={index}>
                  <View
                    style={{
                      marginVertical: 5,
                      marginHorizontal: 5,
                      borderRadius: 20,
                      backgroundColor: "blue",
                    }}
                  >
                    <Text
                      style={{
                        zIndex: 1,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 20,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        marginBottom: -27,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        paddingLeft: 10,
                      }}
                    >
                      {event.eventTitle}{" "}
                    </Text>

                    <Card.Cover
                      source={{ uri: event.eventImageURL }}
                      style={{
                        height: "100%",
                        height: 160,
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </React.Fragment>
              ))}
            </View>
            <View>
              {users.map((user, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    style={{ paddingHorizontal: 10 }}
                    title={user.displayName}
                    description={user.userDescription}
                    left={() => (
                      <Avatar.Image
                        size={64}
                        style={{}}
                        source={{ uri: user.storageProfileImageURL }}
                      />
                    )}
                    onPress={() =>
                      navigation.navigate("VisitProfile", {
                        targetUserData: user,
                      })
                    }
                    right={() => (
                      <Button
                        title=" + "
                        onPress={() => createChat(user.userId)}
                      />
                    )}
                  />
                </React.Fragment>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
