import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  ImageComponent,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  List,
  Button,
} from "react-native-paper";
import { auth, db } from "../firebase";
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
import { useSelector } from "react-redux";
import ParticipantsPage from "./participants_page";
import { ThemeContext } from "../Theme";
import { useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Search({ navigation }) {
  const Theme = useContext(ThemeContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    var eventArray = [];
    const eventLister = async () => {
      console.log("event yenilendi");
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        eventArray.push(doc.data());
      });
      setEvents(eventArray);
    };

    eventLister();
  }, [refreshing]);

  const clearEvent = () => {
    setSelectedEvent(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    eventCard: {
      marginVertical: 5,
      marginHorizontal: 10,
      borderRadius: 20,
      backgroundColor: Theme.cardShadow,
      shadowColor: Theme.cardShadow,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardTitle: {
      zIndex: 1,
      color: Theme.color,
      fontWeight: "bold",
      fontSize: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingLeft: 10,
    },
    cardCover: {
      height: "100%",
      height: 160,
      overflow: "hidden",
      backgroundColor: "transparent",
      borderRadius: 10,
    },
    linearGradient: {
      flex: 1,
      zIndex:1,
      height:null,
      marginBottom:-27,
      borderTopLeftRadius:5,
      borderTopRightRadius:5,
      
    },
  });

  return (
    <View style={{ backgroundColor: Theme.backgroundColor }}>
      <SafeAreaView>
        <StaticTopBar text={"Topluluk"} />
        {selectedEvent == null ? (
          <ScrollView
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ flex: 1, marginBottom: 100 }}>
              {events.map((event, index) => (
                <React.Fragment key={index}>
                  <View style={styles.eventCard}>
                    <Pressable
                      onPress={() => setSelectedEvent(event.eventTitle)}
                    >

                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={["#38a3a5", "#0000ff33", "transparent"]}
                        style={styles.linearGradient}
                      >
                      <Text style={styles.cardTitle}>{event.eventTitle} </Text>

                      </LinearGradient>

                      <Card.Cover
                        source={{ uri: event.eventImageURL }}
                        style={styles.cardCover}
                      />
                    </Pressable>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ParticipantsPage
            navigation={navigation}
            selectedEvent={selectedEvent}
            clearEvent={clearEvent}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
