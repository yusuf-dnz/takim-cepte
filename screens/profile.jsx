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
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setUserProfileData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    getUserProfile();
  }, []);

  // console.log(userProfileData)

  return (
    <View style={{ backgroundColor: "#282A3A" }}>
      <SafeAreaView style={{ backgroundColor: "#282A3A", minHeight: "100%" }}>
        <View>
          <StaticTopBar text={"PROFILE"} />

          <ScrollView style={{ marginBottom: 50, padding: 5 }}>
            {/* <Avatar.Image size={Dimensions.get('window').width} style={{borderRadius:0,backgroundColor:'transparent'}} source={require('../assets/ism.png') } /> */}
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
                @yuefi
              </Text>

              <Text style={{ color: "#eeeeee", marginTop: 5 }}>
                {userProfileData.userDescription}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end", marginTop: 20 }}>
              <Button
                style={{ backgroundColor: "#ff000022", width: 100,borderRadius:10 }}
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
        </View>
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
    marginBottom:5,
  },
});
