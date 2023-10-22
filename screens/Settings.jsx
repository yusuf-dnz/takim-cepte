import { View, Text } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useContext } from "react";
import { ThemeContext } from "../Theme";
import { useFocusEffect } from "@react-navigation/core";
import { useCallback } from "react";
import { BackHandler } from "react-native";
import Toast from "react-native-toast-message";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, updateUserData } from "../redux/authentication";


export default function Settings({ navigation }) {
  let CurrentUser = useSelector((state) => state.authStatus.userData);

  const Theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  let userRef;
  if (auth.currentUser) {
    userRef = doc(db, "users", auth.currentUser.uid);
  }



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
        },
      },
    ]);
  };

  const handleGoBack = () => {
    // Geri gitme işlemi
    navigation.goBack();
  };


  const [displayName, setDisplayName] = useState(CurrentUser.displayName);

  const updateDisplayName = async () => {
    await updateDoc(userRef, {
      displayName: displayName
    });
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    }).then(() => {
      Toast.show({
        type: 'success',
        text2: 'İsim değiştirildi'
      });
    }).catch((error) => {
      Toast.show({
        type: 'error',
        text2: 'Hata oluştu!-'
      });
    });
    dispatch(updateUserData(JSON.stringify({ displayName: displayName })));
  }

  return (
    <View>
      <SafeAreaView>
        <ScrollView style={{ padding: 10, width: "100%" }}>

          <IconButton
            icon="arrow-left"
            iconColor={Theme.color}
            onPress={handleGoBack}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              mode="outlined"
              label="Ad Soyad"
              theme={{
                colors: {
                  onSurfaceVariant: Theme.softColor,
                  outlineVariant: "blue",
                  outline: Theme.secondaryContainer,
                  placeholder: 'white',
                  background: Theme.backgroundColor,
                },
              }}
              activeOutlineColor="white"
              textColor="white"
              value={displayName}
              onChangeText={text => setDisplayName(text)}
              style={{ backgroundColor: "transparent", marginVertical: 5, width: "80%" }}
            />
            <View style={{ width: "20%", alignItems: "center" }}>
              <IconButton size={24} icon="check" iconColor="white"
                onPress={updateDisplayName}
              />
            </View>

          </View>

          <View style={{ flexDirection: "row" }}>
            <Button
              style={{ backgroundColor: Theme.secondaryContainer, marginVertical: 10, width: 120 }}
              onPress={handleLogOut}
              icon="account-lock"
              mode="contained"
              touchSoundDisabled={true}
            >
              Çıkış Yap
            </Button>

            {/* <Button
              style={{ backgroundColor: "green", marginVertical: 10, width: 120 ,position:"absolute", right:0 }}
              onPress={handleLogOut}
              icon="account-lock"
              mode="contained"
              touchSoundDisabled={true}
            >
              Kaydet
            </Button> */}

          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
