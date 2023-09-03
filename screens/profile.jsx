import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { Avatar, Divider, Button, IconButton, List } from "react-native-paper";
import StaticTopBar from "../components/StaticTopBar";
import { StyleSheet } from "react-native";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  where,
  query,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/authentication";
import { ThemeContext } from "../Theme";

export default function Profile({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const CurrentUser = useSelector((state) => state.authStatus.userData);
  const dispatch = useDispatch();
  const Theme = useContext(ThemeContext);

  const handleLogOut = () => {
    Alert.alert("Hesaptan çıkış yap...", "", [
      {
        text: "Hayır",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Evet",
        onPress: async (e) => {
          await signOut(auth);
//          dispatch(setUserData(null)); //// Main js de ayarlandı ancak güvenlik açısından kontrol et !!
          console.log("çıkış yapıldı");
        },
      },
    ]);
  };

  const [userProfileData, setUserProfileData] = useState([]);
  useEffect(() => {
    const getUserProfile = () => {
      const firebaseTimestamp = CurrentUser?.createdDate.seconds * 1000;
      const date = new Date(firebaseTimestamp);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("tr-TR", options);
      setUserProfileData({
        ...CurrentUser,
        registeredDate: formattedDate,
      });
    };

    getUserProfile();
  }, [CurrentUser]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventArray = userProfileData?.registeredEvents ?? [];

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
  }, [userProfileData]);

  let arr = [];
  const chooseEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      // arr.push({ Id: doc.id, ...doc.data() });
      arr.push(doc.data());
    });
    setAllEvents(arr);
    setModalVisible(!modalVisible);
  };

  const addEvent = async (data) => {
    try {
      const ref = doc(db, "users", CurrentUser.userId);
      await updateDoc(ref, {
        registeredEvents: arrayUnion(data),
      });
      CurrentUser.registeredEvents = [...CurrentUser.registeredEvents, data];
      dispatch(setUserData(JSON.stringify(CurrentUser)));
    } catch (error) {
      console.error("Hata oluştu:", error);
      console.error("Hatanın detayı:", error.stack);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: null,
      height: Dimensions.get("window").width / 2,
      overflow: "hidden",
      backgroundColor: "transparent",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      
    },
    detailsView: {
      padding:10,
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
    },
    logOutView: {
      alignItems: "flex-end",
      marginTop: 20,
    },
    logOutButton: {
      backgroundColor: "#ff0000",
      width: 100,
      borderRadius: 10,
    },

    bioView: {
      paddingHorizontal: 10,
      backgroundColor: Theme.component,
      borderRadius: 5,
      minHeight: 150,
      marginTop: 5,
    },
    eventBadges: {
      height: 50,
      width: 50,
      backgroundColor: "gray",
      marginHorizontal: 5,
      borderRadius: 0,
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
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      marginTop: 10,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: Theme.color,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <View style={{ backgroundColor: Theme.backgroundColor }}>
      <SafeAreaView style={{ minHeight: "100%" }}>
        <StaticTopBar text={"Profil"} />

        <ScrollView style={{ marginBottom: 50, padding: 5 }}>
          <View style={styles.container}>
            <Image
              source={{ uri: userProfileData.storageProfileImageURL }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.detailsView}>
              <Text style={styles.displayNameText}>
                {userProfileData.displayName}
              </Text>
              <Text style={styles.detailTexts}>@{userProfileData.userName}</Text>
              <Text style={styles.detailTexts}>
                Katılım: {userProfileData.registeredDate ?? ""}
              </Text>
              <Text style={styles.detailTexts}>
                {userProfileData.country} / {userProfileData.state} / {userProfileData.cities ?? "..." }
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
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
              <IconButton
                icon="plus-thick"
                iconColor="white"
                size={20}
                onPress={() => chooseEvents()}
              />
            </View>
          </View>

          <View style={styles.bioView}>
            <Text style={{ color: Theme.color, marginTop: 5 }}>
              {userProfileData.userDescription ?? "Biyografi ne eklemek istediklerin..."}
            </Text>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ScrollView style={{ width: "100%" }}>
                  {allEvents.map((eventItem, index) => (
                    <React.Fragment key={index}>
                      <Pressable
                        style={({ pressed }) => [
                          {
                            backgroundColor: pressed
                              ? Theme.modalPressable
                              : "transparent",
                            borderRadius: 10,
                          },
                        ]}
                      >
                        <List.Item
                          title={eventItem.eventTitle}
                          titleStyle= {{color: Theme.color}}
                          left={() => (
                            <Image
                              source={{
                                uri: eventItem.eventIconURL,
                              }}
                              resizeMode="cover"
                              style={{ width: 50, height: 50,marginLeft:5 }}
                            />
                          )}
                          right={() => (
                            <IconButton
                              icon="plus"
                              onPress={() => addEvent(eventItem.eventTitle)}
                            />
                          )}
                        />
                      </Pressable>
                    </React.Fragment>
                  ))}
                </ScrollView>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Tamam</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.logOutView}>
            <Button
              style={styles.logOutButton}
              onPress={handleLogOut}
              icon="account-lock"
              title="Log Out"
              mode="contained"
              touchSoundDisabled={true}
            >
              Log Out
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
