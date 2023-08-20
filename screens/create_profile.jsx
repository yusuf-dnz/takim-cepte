import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Button,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { IconButton, List, MD3Colors } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import StaticTopBar from "../components/StaticTopBar";
import { auth, db, storage } from "../firebase";
import { Timestamp, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SegmentedButtons } from "react-native-paper";


console.log("CREATE PROFILE")

export const uriToBlob = (uri) => {
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

export default function CreateProfile({ navigation }) {
  const [description, onChangeDescription] = React.useState("");
  const [image, setImage] = useState(null);
  const [storageImageURL, setStorageImageURL] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);//Modal içeriği
  const [gender, setGender] = React.useState("other");
  const userID = auth.currentUser.uid;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDatepicker = (currentMode) => {
    DateTimePickerAndroid.open({
      
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  const regionModal = () => {
    setSelectedContent(
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
        </View>
      </View>
    );
    setModalVisible(true);
  };

  const addProfileDetails = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      country: "Türkiye",
      province:"Samsun",
      district:"Atakum",
      userGender: gender,
      userDescription: description,
      bornDate: Timestamp.fromDate(date),
      storageProfileImageURL: storageImageURL,
      profileDetailsCreated: true,
    });

    navigation.navigate("HomeScreen");
  };

  // console.log(auth.currentUser.uid);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      const storageRef = ref(
        storage,
        `UserAvatars/${userID}/pp.jpg`
      );
      const blobFile = await uriToBlob(result.assets[0].uri);
      await uploadBytes(storageRef, blobFile).then(async (snapshot) => {
        const url = await getDownloadURL(storageRef);
        setStorageImageURL(url);
      });
    }
  };


  return (
    <View>
      <SafeAreaView style={{ backgroundColor: "#282A3A", height: "100%" }}>
        <StaticTopBar text={"Create Profile"} />

        <ScrollView style={{ padding: 10 }}>
          <View style={styles.container}>
            {storageImageURL && (
              <Image source={{ uri: storageImageURL }} style={styles.image} />
            )}
          </View>

          <View style={{ alignItems: "flex-end", marginTop: -40 }}>
            <IconButton
              icon="camera"
              iconColor={"white"}
              animated={true}
              size={20}
              onPress={pickImage}
            />
          </View>

          <View
            style={{
              backgroundColor: "#001C30",
              borderBottomColor: "#000000",
              minHeight: 150,
              borderRadius:5
            }}
          >
            <TextInput
              editable
              multiline
              placeholder="Kendini açıkla :)"
              placeholderTextColor={"#eeeeeeaa"}
              maxLength={400}
              onChangeText={(text) => onChangeDescription(text)}
              value={description}
              style={{ padding: 10, color: "#eeeeee" }}
            />
          </View>

          <Pressable
            style={{ marginTop: 5, padding: 10, backgroundColor: "#001C30",borderRadius:5 }}
            onPress={() => showDatepicker()}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                
              }}
            >
              <Text style={{ color: "#eeeeee66", fontSize: 20 }}>
                Born Date:{" "}
              </Text>
              <Text style={{ color: "#eeeeee66", fontSize: 20 }}>
                {date.getDate()} / {date.getMonth()+1} / {date.getFullYear()}
              </Text>

              <Text
                style={{
                  color: "red",
                  fontSize: 10,
                  textAlign: "right",
                }}
              >
                Profilinde görüntülenmez*
              </Text>
            </View>
          </Pressable>

          <View
            style={{
              marginTop: 5,
              backgroundColor: "#001C30",
              height: 40,
              borderRadius:5,

            }}
          >
            <Pressable onPress={() => regionModal()}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                  padding: 10,
                }}
              >
                <Text style={styles.regionText}> Ülke </Text>
                <Text style={styles.regionText}>/ Şehir </Text>
                <Text style={styles.regionText}>/ İlçe </Text>
              </View>
            </Pressable>
          </View>

          <View
            style={{
              alignItems: "center",
              marginTop: 5,
              padding: 5,
              height: 80,
            }}
          >
            <SegmentedButtons
              style={{borderRadius:20,backgroundColor:'#001C30'}}
              
              value={gender}
              onValueChange={setGender}
              buttons={[
                {
                  value: "male",
                  label: "Erkek",
                  checkedColor: "blue",
                  uncheckedColor:"white",
                  icon: "face-man-shimmer",
                },
                {
                  value: "other",
                  label: "Belirtme",
                  checkedColor: "red",
                  uncheckedColor:"white",

                },
                {
                  value: "female",
                  label: "Kadın",
                  checkedColor: "purple",
                  uncheckedColor:"white",

                  icon: "face-woman-shimmer",
                },
              ]}
            />
          </View>

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              {selectedContent}
            </Modal>
          </View>
        </ScrollView>

        <View
          style={{
            alignItems: "flex-end",
            backgroundColor: "transparent",
            borderTopColor: "rgba(0,0,255,0.2)",
            borderTopWidth: 2,
          }}
        >
          <IconButton
            icon="arrow-right"
            iconColor={"white"}
            animated={true}
            size={20}
            onPress={addProfileDetails}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  genderButtonText: {
    color: "#eeeeeeaa",
    fontSize: 18,
    padding: 5,
  },

  regionText: {
    color: "#eeeeeeaa",
  },
  container: {
    borderRadius:5,
    width: '100%',
    height: Dimensions.get("window").width-20, // Eğer dörtgen bir avatar isteniyorsa bu kısmı özelleştirebilirsiniz.
    overflow: "hidden",
    backgroundColor: "#00000095",
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: 400,
    margin: 20,
    backgroundColor: "white",
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
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "gray",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  datePickerTexts: {
    textAlign: "center",
    width: 80,
    fontWeight: "bold",
    fontSize: 20,
  },
});
