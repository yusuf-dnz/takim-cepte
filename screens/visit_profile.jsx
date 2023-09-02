import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { Avatar, Divider, IconButton, Button } from "react-native-paper";
import StaticTopBar from "../components/StaticTopBar";
import { StyleSheet } from "react-native";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
  where,
  query,
  addDoc,
  or,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/core";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { ThemeContext } from "../Theme";
import { LinearGradient } from "expo-linear-gradient";

export default function VisitProfile({ navigation }) {
  const Theme = useContext(ThemeContext);

  const CurrentUser = useSelector((state) => state.authStatus.userData.userId);
  const route = useRoute();
  const targetUserData = route.params.targetUserData;


  const createChat = async (targetID) => {
    const date = new Date();
    const lastView = Timestamp.fromDate(date);

    const docRef = query(
      collection(db, "chats"),
      or(
        where("participants", "==", [targetID, CurrentUser]),
        where("participants", "==", [CurrentUser, targetID])
      )
    );
    const querySnapshot = await getDocs(docRef);
    if (querySnapshot.empty) {
      const create = await addDoc(collection(db, "chats"), {
        participants: [CurrentUser, targetID],
        [CurrentUser]: lastView,
        [targetID]: lastView,
      });
      // console.log(create.id)
      console.log("chat oluşturuldu");
      navigation.navigate("ChatScreen", {
        chatId: create.id,
        targetUserName: targetUserData.displayName,
        targetUserImage: targetUserData.storageProfileImageURL,
      });
    } else {
      console.log(querySnapshot.docs[0].id);
      navigation.navigate("ChatScreen", {
        chatId: querySnapshot.docs[0].id,
        targetUserName: targetUserData.displayName,
        targetUserImage: targetUserData.storageProfileImageURL,
      });
    }
  };

  const firebaseTimestamp = targetUserData.createdDate.seconds * 1000;

  // Timestamp'i JavaScript tarih nesnesine dönüştürme
  const date = new Date(firebaseTimestamp);

  // Tarih formatını belirleme (örnek format: "dd/mm/yyyy")
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  // Tarihi istenen formata dönüştürme
  const formattedDate = date.toLocaleDateString("tr-TR", options);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventArray = targetUserData?.registeredEvents ?? [];

    setEvents([]);

    const regEvent = async () => {
      if (eventArray.length > 0) {
        const eventRef = collection(db, "events");
        const q = query(eventRef, where("eventTitle", "in", eventArray));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setEvents((prevData) => [...prevData, doc.data()]);
        });
      } else {
        console.log("event boş");
      }
    };
    regEvent();
  }, []);

  const styles = StyleSheet.create({
    container: {
      width: null,
      height: Dimensions.get("window").width / 2,
      overflow: "hidden",
      backgroundColor: "transparent",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
    },
    detailsView: {
      padding: 10,
      borderRadius: 20,
      width: "49%",
      height: null,
      justifyContent: "center",
      backgroundColor: Theme.component,
    },
    image: {
      borderRadius: 20,
      width: "49%",
      height: null,
    },
    displayNameText: {
      color: Theme.color,
      fontSize: 20,
      marginBottom: 5,
    },
    detailTexts: {
      color: Theme.softColor,
      marginBottom: 5,
      fontSize: 12,
    },
    registeredEvents: {
      width: "100%",
      borderRadius: 5,
      height: 60,
      padding: 5,
      flexDirection: "row",
      backgroundColor: Theme.component,
      marginBottom: 5,
    },
  });

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Theme.backgroundColor,
          height: "100%",
          padding: 5,
        }}
      >
        <View style={styles.container}>
          <Image
            source={{ uri: targetUserData.storageProfileImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.detailsView}>
            <View style={{ height: "70%" }}>
              <Text style={styles.displayNameText}>
                {targetUserData.displayName}
              </Text>
              <Text style={styles.detailTexts}>@{targetUserData.userName}</Text>
              {/* <Text style={styles.detailTexts}>
                Katılım: {formattedDate}
              </Text> */}
              <Text style={styles.detailTexts}>
                {targetUserData.country} / {targetUserData.state} /{" "}
                {targetUserData.cities ?? "..."}
              </Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                marginRight: 10,
                zIndex: 2,
              }}
            >
              <IconButton
                icon="chat"
                iconColor="white"
                size={35}
                style={{
                  backgroundColor: "red",
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => createChat(targetUserData.userId)}
              />
            </View>
          </View>
        </View>

        {/* <View style={styles.container}>
          <Image
            source={{ uri: targetUserData.storageProfileImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
          
        </View> */}

        {/* Açıklama alanı */}
        <View
          style={{
            padding: 10,
            backgroundColor: Theme.component,
            borderRadius: 5,
            minHeight: 100,
            marginBottom: 5,

          }}
        >
          <Text style={{ color: Theme.color, marginTop: 5 }}>
            {targetUserData.userDescription
              ? targetUserData.userDescription
              : "..."}
          </Text>
        </View>

        <View style={styles.registeredEvents}>
          <ScrollView horizontal={true}>
            {events?.map((event, index) => (
              <React.Fragment key={index}>
                <Image
                  style={{ width: 50, marginHorizontal: 5 }}
                  source={{
                    uri: event.eventIconURL,
                  }}
                />
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        <Text style={{ textAlign: "right", color: Theme.color, margin: 10 }}>
          Katılım: {formattedDate}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
