import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
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
  const [inspectPicture, showInspectPicture] = useState(false);
  const [eventDetail, showEventDetail] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  const getEventDetails = async (eventId) => {
    const docRef = doc(db, `events/${eventId}/participants`, targetUserData.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSelectedEventDetail(docSnap.data());
    } else {
      console.log("No EventDetail such document!");
    }
  };

  useEffect(() => {
    let eventData = [];
    for (const key in selectedEventDetail) {
      if (selectedEventDetail.hasOwnProperty(key)) {
        const value = selectedEventDetail[key];
        eventData.push({ key: key, value: value });
      }
    }
    setEventData(eventData);
  }, [selectedEventDetail]);


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
        messages: [],
        [CurrentUser]: lastView,
        [targetID]: lastView,
      });
      // console.log(create.id)
      console.log("chat oluşturuldu");
      navigation.navigate("ChatScreen", {
        chatId: create.id,
        targetUserName: targetUserData.userName,
        targetUserImage: targetUserData.storageProfileImageURL,
      });
    } else {
      console.log(querySnapshot.docs[0].id);
      navigation.navigate("ChatScreen", {
        chatId: querySnapshot.docs[0].id,
        targetUserName: targetUserData.userName,
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

  const handleGoBack = () => {
    // Geri gitme işlemi
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      width: null,
      height: Dimensions.get("window").width / 2,
      overflow: "hidden",
      backgroundColor: "transparent",
      marginVertical: 5,
    },
    detailsView: {
      position: "absolute",
      bottom: 10,
      right: 10,
      padding: 10,
      borderRadius: 20,
      width: 250,
      minHeight: 80,
      justifyContent: "center",
      backgroundColor: Theme.component,
    },
    image: {
      borderRadius: 15,
      width: "100%",
      height: "100%",
    },
    displayNameText: {
      color: Theme.color,
      fontSize: 20,
      maxWidth: 150,
    },
    detailTexts: {
      color: Theme.softColor,
      fontSize: 12,
      maxWidth: 150
    },
    registeredEvents: {
      marginVertical: 5,
      width: "100%",
      borderRadius: 5,
      height: 60,
      padding: 5,
      flexDirection: "row",
      backgroundColor: Theme.component,
      marginBottom: 5,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      width: "80%",
      maxHeight: "80%",

      backgroundColor: Theme.modalColor,
      borderRadius: 20,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  return (
    <SafeAreaView>
      <IconButton
        icon="arrow-left"
        iconColor={Theme.color}
        onPress={handleGoBack}
        style={{ height: 20 }}
      />
      <Modal
        animationType="fade"
        transparent={false}
        visible={inspectPicture}
        onRequestClose={() => {
          showInspectPicture(!inspectPicture);
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            height: "100%",
          }}
        >
          <Image
            source={{ uri: targetUserData.storageProfileImageURL }}
            style={{ width: "100%", height: Dimensions.get("window").width }}
            resizeMode="cover"
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={eventDetail}
        onRequestClose={() => {
          showEventDetail(!eventDetail);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <IconButton
              icon="close-thick"
              iconColor={Theme.danger}
              onPress={() => {
                showEventDetail(!eventDetail);
              }}
            />
            <ScrollView style={{ width: "100%" }}>
              <View style={{ alignItems: "center" }}>

                <View style={{ width: "70%" }}>
                  {eventData?.map((item, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          borderRadius: 5,
                          backgroundColor: Theme.secondaryContainer,
                          margin: 5,
                        }}
                      >
                        <Text style={{ color: Theme.color, padding: 5, fontSize: 16 }}>
                          {item.key.charAt(0).toUpperCase() + item.key.slice(1)} :
                        </Text>
                        <Text style={{ color: Theme.color, padding: 5, fontSize: 16 }}>{item.value}</Text>

                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView
        style={{
          backgroundColor: Theme.backgroundColor,
          height: "100%",
          padding: 5,
        }}
      >
        <View style={{ marginBottom: 5, borderWidth: 2, borderRadius: 17, borderColor: Theme.secondaryContainer }}>
          <TouchableOpacity
            style={{ height: Dimensions.get("window").width }}
            onPress={() => {
              showInspectPicture(true);
            }}
          >
            <Image
              source={{ uri: targetUserData.storageProfileImageURL }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.detailsView}>
            <View >
              <Text style={styles.displayNameText}>
                @{targetUserData.userName}
              </Text>
              <Text style={styles.detailTexts}>{targetUserData.displayName}</Text>

              <Text style={styles.detailTexts}>
                {targetUserData.country} / {targetUserData.state} /{" "}
                {targetUserData.cities ?? "..."}
              </Text>
            </View>

            <IconButton
              icon="chat"
              iconColor="white"
              size={35}
              style={{
                backgroundColor: "red",
                position: "absolute",
                right: 10,
              }}
              onPress={() => createChat(targetUserData.userId)}
            />
          </View>
        </View>

        <View style={styles.registeredEvents}>
          <ScrollView horizontal={true}>
            {events?.map((event, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity onPress={() => {
                  showEventDetail(!eventDetail),
                    getEventDetails(event.eventId)
                }}>

                  <Image
                    style={{ width: 50, height: 50, marginHorizontal: 5 }}
                    source={{
                      uri: event.eventIconURL,
                    }}
                  />
                </TouchableOpacity>

              </React.Fragment>
            ))}
          </ScrollView>
        </View>
        {/* Açıklama alanı */}
        <View
          style={{
            padding: 10,
            backgroundColor: Theme.backgroundColor,
            borderWidth: 2,
            borderColor: Theme.secondaryContainer,
            borderRadius: 5,
            minHeight: 100,
            marginVertical: 5,
          }}
        >
          <Text style={{ color: Theme.color, marginTop: 5 }}>
            {targetUserData.userDescription
              ? targetUserData.userDescription
              : "..."}
          </Text>
        </View>

        <Text style={{ textAlign: "right", color: Theme.color, margin: 10 }}>
          Katılım: {formattedDate}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
