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
import { Avatar, Divider, Button } from "react-native-paper";
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
      console.log("PROFILE JS getUserProfile ");
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserProfileData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    getUserProfile();
  }, []);

   let formattedDate;
  console.log(userProfileData.createdDate.seconds)
// },[userProfileData])
// useEffect(()=>{
  const firebaseTimestamp = userProfileData.createdDate.seconds * 1000;

  const date = new Date(firebaseTimestamp);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

   formattedDate = date.toLocaleDateString("tr-TR", options);

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
            <Text style={styles.userName}>@yuefi</Text>

            <Text style={{ color: "#eeeeee", marginTop: 5 }}>
              {userProfileData.userDescription}
            </Text>
          </View>

          <View style={styles.registeredEvents}>
            <ScrollView horizontal={true} scr>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
              <View style={styles.eventBadges}></View>
            </ScrollView>
          </View>
          <Text style={{ textAlign: "right", color: "#eeeeee", margin: 10 }}>
            Katılım: {formattedDate??""}
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
    backgroundColor: "white",
    marginHorizontal: 5,
  },
});
