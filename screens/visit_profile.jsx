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

export default function VisitProfile({ navigation }) {
  const currentUserID = auth.currentUser.uid;

  const route = useRoute();
  const targetUserData = route.params.targetUserData;

  const createChat = async (targetID) => {
    const date = new Date();
    const lastView = Timestamp.fromDate(date);

    const docRef = query(
      collection(db, "chats"),
      or(
        where("participants", "==", [targetID, currentUserID]),
        where("participants", "==", [currentUserID, targetID])
      )
    );
    const querySnapshot = await getDocs(docRef);
    if (querySnapshot.empty) {
      const create = await addDoc(collection(db, "chats"), {
        participants: [currentUserID, targetID],
        [currentUserID]: lastView,
        [targetID]: lastView,
      });
      // console.log(create.id)
      console.log("chat oluşturuldu");
      navigation.navigate("ChatScreen", { chatId: create.id });
    } else {
      console.log(querySnapshot.docs[0].id);
      navigation.navigate("ChatScreen", { chatId: querySnapshot.docs[0].id });
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

  return (
    <SafeAreaView style={{ backgroundColor: "#282A3A" }}>
      <StaticTopBar text={"PROFILE"} />

      <ScrollView
        style={{ backgroundColor: "#282A3A", height: "100%", padding: 5 }}
      >
        {/* <Avatar.Image size={Dimensions.get('window').width} style={{borderRadius:0,backgroundColor:'transparent'}} source={require('../assets/ism.png') } /> */}
        <View style={styles.container}>
          <Image
            source={{ uri: targetUserData.storageProfileImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View
          style={{
            alignItems: "flex-end",
            marginTop: -50,
            marginBottom: 0,
            marginRight: 30,
          }}
        >
          <IconButton
            icon="chat"
            iconColor="white"
            size={40}
            style={{
              backgroundColor: "red",
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={() => createChat(targetUserData.userId)}
          />
        </View>

        <Text style={styles.displayNameText}>{targetUserData.displayName}</Text>

        {/* Açıklama alanı */}
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: "#001C30",
            borderRadius: 5,
            minHeight: 150,
          }}
        >
          <Text
            style={{
              color: "#eeeeee",
              fontSize: 16,
              fontFamily: "CabinRegular",
            }}
          >
            @{targetUserData.userName}
          </Text>

          <Text style={{ color: "white", marginTop: 5 }}>
            {targetUserData.userDescription}
          </Text>
        </View>

        <Text style={{ textAlign: "right", color: "#eeeeee", margin: 10 }}>
          Katılım: {formattedDate}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    width: Dimensions.get("window").width - 10,
    height: Dimensions.get("window").width - 10, // Eğer dörtgen bir avatar isteniyorsa bu kısmı özelleştirebilirsiniz.
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  displayNameText: {
    fontFamily: "Kanit",

    color: "#eeeeee",
    fontSize: 20,
    marginVertical: 5,
    paddingLeft: 10,
    marginTop: -20,
  },
});
