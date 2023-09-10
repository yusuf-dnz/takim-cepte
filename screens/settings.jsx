import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button, IconButton } from "react-native-paper";
import { useContext } from "react";
import { ThemeContext } from "../Theme";
import { useFocusEffect } from "@react-navigation/core";
import { useCallback } from "react";
import { BackHandler } from "react-native";

export default function Settings({ navigation }) {
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
        },
      },
    ]);
  };

  const handleGoBack = () => {
    // Geri gitme işlemi
    navigation.goBack();
  };

  return (
    <View>
      <SafeAreaView>
        <ScrollView style={{padding:10}}>
          <IconButton
            icon="arrow-left"
            iconColor={Theme.color}
            onPress={handleGoBack}
          />
          <Button
            style={{backgroundColor: Theme.secondaryContainer}}
            onPress={handleLogOut}
            icon="account-lock"
            title="Çıkış yap"
            mode="contained"
            touchSoundDisabled={true}
          >
            Log Out
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
