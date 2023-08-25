import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { Avatar, Divider, Button, IconButton } from "react-native-paper";
import StaticTopBar from "../components/StaticTopBar";
import { StyleSheet } from "react-native";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile({ navigation }) {
  const userID = auth.currentUser.uid;

  const handleLogOut = async (e) => {
    await signOut(auth);
    console.log("çıkış yapıldı");
    navigation.navigate("LogIn");
  };

  const [userProfileData, setUserProfileData] = useState({});
  useEffect(() => {
    const getUserProfile = async () => {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firebaseTimestamp = docSnap.data().createdDate.seconds * 1000;
        const date = new Date(firebaseTimestamp);
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const formattedDate = date.toLocaleDateString("tr-TR", options);
        setUserProfileData({
          ...docSnap.data(),
          registeredDate: formattedDate,
        });
      } else {
        console.log("No such document!");
      }
    };

    getUserProfile();
  }, []);

  const [events, setEvents] = useState([]);
  

  useEffect(() => {
    setEvents([])
    const eventArray = userProfileData.registeredEvents;

    eventArray?.map((eventName) => {
      console.log("event map")
      getEventAsset(eventName);
    });
  }, [userProfileData]);

  const getEventAsset = async (x) => {
    const docRef = doc(db, "events", x);
    const docSnap = await getDoc(docRef);
    setEvents((prevData) => [...prevData, docSnap.data()]);
  };
  console.log(events);

  return (
    <View style={{ backgroundColor: "#282A3A" }}>
      <SafeAreaView style={{ minHeight: "100%" }}>
        <StaticTopBar text={"Profil"} />

        <ScrollView style={{ marginBottom: 50, padding: 5 }}>
          <View style={styles.container}>
            <Image
              source={{ uri: userProfileData.storageProfileImageURL }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.displayNameText}>
            {userProfileData.displayName}
          </Text>

          <View style={styles.bioView}>
            <Text style={styles.userName}>@{userProfileData.userName}</Text>

            <Text style={{ color: "#eeeeee", marginTop: 5 }}>
              {userProfileData.userDescription}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.registeredEvents}>
              <ScrollView horizontal={true}>
                {events.map((event, index) => (
                  <React.Fragment key={index}>
                    <Image
                      style={{width:50,marginHorizontal:5}}
                      
                      source={{
                        uri: event.eventIconURL,
                      }}
                    />
                  </React.Fragment>
                ))}

                {/* <View style={styles.eventBadges}>
                  
                  </View> */}
              </ScrollView>
              <IconButton
                icon="plus-thick"
                iconColor="white"
                size={20}
                onPress={() => console.log("Pressed")}
              />
            </View>
          </View>
          <Text style={{ textAlign: "right", color: "#eeeeee", margin: 10 }}>
            Katılım: {userProfileData.registeredDate ?? ""}
          </Text>
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
    paddingLeft: 10,
    marginBottom: 5,
  },
  registeredEvents: {
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
    height: 60,
    padding: 5,
    flexDirection: "row",
    backgroundColor: "#001C30",
  },
  logOutView: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  logOutButton: {
    backgroundColor: "#ff000022",
    width: 100,
    borderRadius: 10,
  },
  userName: {
    color: "#eeeeee",
    fontSize: 16,
    fontFamily: "CabinRegular",
  },
  bioView: {
    paddingHorizontal: 10,
    backgroundColor: "#001C30",
    borderRadius: 5,
    minHeight: 150,
  },
  eventBadges: {
    height: 50,
    width: 50,
    backgroundColor: "gray",
    marginHorizontal: 5,
    borderRadius: 0,
  },
});
