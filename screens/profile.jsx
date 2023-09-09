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
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
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
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setAuthId, setUserData } from "../redux/authentication";
import { ThemeContext, theme } from "../Theme";
import * as ImagePicker from "expo-image-picker";
import { RenderHTML, RenderHTMLSource } from "react-native-render-html";
import * as EventForm from "../components/EventForms";

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const Theme = useContext(ThemeContext);
  let CurrentUser = useSelector((state) => state.authStatus.userData);

  const [eventModal, showEventModal] = useState(false);
  const [eventDetailModal, showEventDetailModal] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [eventForm, setEventForm] = useState(false);

  const [inspectPicture, showInspectPicture] = useState(false);
  const [description, onChangeDescription] = useState(
    CurrentUser?.userDescription
  );
  const [descriptionModal, showDescriptionModal] = useState(false);

  const forms = {
    basketball: <EventForm.Basketball_Form />,
    football: <EventForm.Football_Form />,
    league_of_legends: <EventForm.LOL_Form />,
    counter_strike_2: <EventForm.CS2_Form />,
    valorant: <EventForm.Valorant_Form />,
  };

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
          // dispatch(setAuthId(null));
          // dispatch(setUserData(null));
          //// Main js de ayarlandı ancak güvenlik açısından kontrol et !!
        },
      },
    ]);
  };

  const deleteEvent = () => {
    Alert.alert("Etkinliği silmek üzeresin...", "Bilgeler silinecek!", [
      {
        text: "Geri Dön",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Sil",
        onPress: async (e) => {
          try {
            await deleteDoc(
              doc(
                db,
                `events/${selectedEvent.eventId}/participants`,
                CurrentUser.userId
              )
            );
          } catch (error) {
            console.log(error);
          }
          try {
            const ref = doc(db, "users", CurrentUser.userId);
            await updateDoc(ref, {
              registeredEvents: arrayRemove(selectedEvent.eventTitle),
            });
          } catch (error) {
            console.log(error);
          }
          let newArray = CurrentUser.registeredEvents.filter(
            (item) => item !== selectedEvent.eventTitle
          );
          CurrentUser.registeredEvents = newArray;
          dispatch(setUserData(JSON.stringify(CurrentUser)));
        },
      },
    ]);
    showEventDetailModal(!eventDetailModal);
    setSelectedEvent(null);
  };

  const updateDescription = async () => {
    try {
      const ref = doc(db, "users", CurrentUser.userId);
      await updateDoc(ref, {
        userDescription: description,
      });
    } catch (error) {}
    CurrentUser.userDescription = description;
    dispatch(setUserData(JSON.stringify(CurrentUser)));
    showDescriptionModal(!descriptionModal);
  };
  const firebaseTimestamp = CurrentUser?.createdDate.seconds * 1000;
  const date = new Date(firebaseTimestamp);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("tr-TR", options);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventArray = CurrentUser?.registeredEvents ?? [];

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
  }, [CurrentUser]);

  let arr = [];
  const chooseEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setAllEvents(arr);
    showEventModal(!eventModal);
  };

  const addEvent = async (title, id) => {
    try {
      const ref = doc(db, "users", CurrentUser.userId);
      await updateDoc(ref, {
        registeredEvents: arrayUnion(title),
      });
      CurrentUser.registeredEvents = [...CurrentUser.registeredEvents, title];
      dispatch(setUserData(JSON.stringify(CurrentUser)));
    } catch (error) {
      console.error("Hata oluştu:", error);
      console.error("Hatanın detayı:", error.stack);
    }

    try {
      await setDoc(
        doc(db, `events/${id}/participants`, CurrentUser.userId),
        {}
      );
    } catch (error) {
      console.log(" setdoc: ", error);
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const [storageImageURL, setStorageImageURL] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const storageRef = ref(
        storage,
        `UserAvatars/${CurrentUser?.userId}/pp.jpg`
      );
      const blobFile = await uriToBlob(result.assets[0].uri);
      await uploadBytes(storageRef, blobFile).then(async (snapshot) => {
        const url = await getDownloadURL(storageRef);
        setStorageImageURL(url);
        const docRef = doc(db, "users", CurrentUser.userId);
        await updateDoc(docRef, {
          storageProfileImageURL: url,
        });
      });
    }
  };

  useEffect(() => {
    if (storageImageURL !== null) {
      CurrentUser.storageProfileImageURL = storageImageURL;
      dispatch(setUserData(JSON.stringify(CurrentUser)));
    }
  }, [storageImageURL]);

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
      width: "100%",
      height: "100%",
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
      minHeight: 100,
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
        {/* <StaticTopBar text={"Profil"} /> */}
        {/* INSPEC PICTURE MODAL */}
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
              source={{ uri: CurrentUser?.storageProfileImageURL }}
              style={{ width: "100%", height: Dimensions.get("window").width }}
              resizeMode="cover"
            />

            <IconButton
              style={{ marginTop: "10%", backgroundColor: "red" }}
              icon="image"
              iconColor="white"
              onPress={pickImage}
            />
          </View>
        </Modal>

        <ScrollView style={{ marginBottom: 50, padding: 5 }}>
          <View style={styles.container}>
            <View style={{ width: "49%" }}>
              <TouchableOpacity
                onPress={() => {
                  showInspectPicture(true);
                }}
              >
                <Image
                  source={{ uri: CurrentUser?.storageProfileImageURL }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsView}>
              <Text style={styles.displayNameText}>
                {CurrentUser?.displayName}
              </Text>
              <Text style={styles.detailTexts}>@{CurrentUser?.userName}</Text>
              <Text style={styles.detailTexts}>
                Katılım: {formattedDate ?? ""}
              </Text>
              <Text style={styles.detailTexts}>
                {CurrentUser?.country} / {CurrentUser?.state ?? "..."} /{" "}
                {CurrentUser?.cities ?? "..."}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.registeredEvents}>
              <ScrollView horizontal={true}>
                {events?.map((event, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        showEventDetailModal(!eventDetailModal);
                        setSelectedEvent(event);
                      }}
                    >
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
              <IconButton
                icon="plus-thick"
                iconColor={Theme.color}
                size={20}
                onPress={() => chooseEvents()}
              />
            </View>
          </View>

          <View style={styles.bioView}>
            {CurrentUser?.userDescription ? (
              <Text style={{ color: Theme.color, marginTop: 5 }}>
                {CurrentUser.userDescription}
              </Text>
            ) : (
              <Text style={{ color: "gray", marginTop: 5 }}>
                Henüz açıklama eklemediniz.
              </Text>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                alignContent: "flex-end",
              }}
            >
              <IconButton
                onPress={() => showDescriptionModal(!descriptionModal)}
                icon="pencil"
                iconColor={Theme.color}
                style={{}}
              />
            </View>
          </View>
          {/* EVENT DETAIL MODAL */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={eventDetailModal}
            onRequestClose={() => {
              showEventDetailModal(!eventDetailModal);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ScrollView style={{ width: "100%" }}>
                  <IconButton
                    onPress={deleteEvent}
                    icon="trash-can"
                    iconColor={Theme.color}
                  />
                </ScrollView>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => showEventDetailModal(!eventDetailModal)}
                >
                  <Text style={styles.textStyle}>Tamam</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          {/* EVENT ADD MODAL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={eventModal}
            onRequestClose={() => {
              showEventModal(!eventModal);
              setEventForm(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <IconButton
                style={{position:"absolute",left:0}}
                icon="close-thick"
                iconColor={Theme.danger}
                onPress={() => {
                  showEventModal(!eventModal), setEventForm(false);
                }}
                />
                <ScrollView style={{ width: "100%" }}>
                  {!eventForm ? (
                    <>
                      {allEvents.map((eventItem, index) => (
                        <React.Fragment key={index}>
                          <Pressable
                            onPress={() => {
                              setEventForm(true), setSelectedEvent(eventItem);
                            }}
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
                              titleStyle={{ color: Theme.color }}
                              left={() => (
                                <Image
                                  source={{
                                    uri: eventItem.eventIconURL,
                                  }}
                                  resizeMode="cover"
                                  style={{
                                    width: 50,
                                    height: 50,
                                    marginLeft: 5,
                                  }}
                                />
                              )}
                              // right={() => (
                              //   <IconButton
                              //     icon="plus"
                              //     onPress={() =>
                              //       addEvent(
                              //         eventItem.eventTitle,
                              //         eventItem.eventId
                              //       )
                              //     }
                              //   />
                              // )}
                            />
                          </Pressable>
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <>{forms[selectedEvent.eventTitle]}</>
                  )}
                </ScrollView>
                
              </View>
            </View>
          </Modal>
          {/* EDIT BIOGRAPHY MODAL */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={descriptionModal}
            onRequestClose={() => {
              showDescriptionModal(!descriptionModal);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    icon="close"
                    iconColor={Theme.color}
                    onPress={() => {
                      showDescriptionModal(!descriptionModal);
                      onChangeDescription(CurrentUser?.userDescription);
                    }}
                  />
                  <IconButton
                    icon="check"
                    iconColor={Theme.color}
                    onPress={updateDescription}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: Theme.component,
                    minHeight: 150,
                    width: "100%",
                    borderRadius: 5,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    placeholder="Açıklama ekleyebilirsin..."
                    placeholderTextColor={Theme.softColor}
                    maxLength={250}
                    onChangeText={(text) => onChangeDescription(text)}
                    value={description}
                    style={{ padding: 10, color: Theme.color }}
                  />
                </View>
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
