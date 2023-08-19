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
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Divider, IconButton, List ,Button, } from "react-native-paper";
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

export default function Search({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const currentUserID = auth.currentUser.uid;

  useEffect(() => {
    var eventArray = [];
    const eventLister = async () => {
      console.log("event yenilendi")
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        eventArray.push(doc.data());
      });
      setEvents(eventArray);
    };

    eventLister();
  }, [refreshing]);

  useEffect(() => {
    var userArray = [];
    const userLister = async () => {
      console.log("users yenilendi")

      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        userArray.push(doc.data());
      });

      setUsers([...userArray]);
    };

    userLister();
  }, [refreshing]);

 

  return (
    <View style={{backgroundColor:'#282A3A'}}>
      <SafeAreaView>
        <StaticTopBar text={"COMMUNITY"} />
        <ScrollView
          style={{height:'100%'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ flex: 1, marginBottom: 100 }}>
            <View>
              {events.map((event, index) => (
                <React.Fragment key={index}>
                  <View
                    style={{
                      marginVertical: 7,
                      marginHorizontal: 16,
                      borderRadius: 20,
                      backgroundColor:'blue',
                      shadowColor: "blue", 
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      }, 
                      shadowOpacity: 0.25, 
                      shadowRadius: 3.84, 
                      elevation: 5, 
                    }}
                  >
                    <Text
                      style={{
                        zIndex: 1,
                        color: "#eeeeee",
                        fontWeight: "bold",
                        fontSize: 20,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        marginBottom: -25,
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
                    titleStyle={{color:'#eeeeee'}}
                    description={user.userDescription}
                    descriptionStyle={{color:'#eeeeee'}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});