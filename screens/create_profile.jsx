import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Avatar, Badge, IconButton, List, MD3Colors } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import StaticTopBar from "../components/StaticTopBar";
import { auth, db, storage } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SegmentedButtons, Button } from "react-native-paper";
import axios from "axios";

console.log("CREATE PROFILE");

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
  const [countrysData, setCountrysData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [cities, setCities] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); //Modal içeriği

  const [description, onChangeDescription] = React.useState("");
  const [image, setImage] = useState(null);
  const [storageImageURL, setStorageImageURL] = useState("");
  const [date, setDate] = useState(new Date(1110000000000));
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
      maximumDate: new Date(1110000000000),
    });
  };

  //////////////////////////////////////////////////////////
  const countrysLister = async () => {
    var config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries/",
      headers: {
        "X-CSCAPI-KEY":
          "eXdUWjJ3Skhod29weFdleFBaZGFqT3VKeG9mdXdBN0hJaTRMVlZCSw==",
      },
    };

    axios(config)
      .then(function (response) {
        setState(null);
        setCities(null);
        setCountrysData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    setModalVisible(true);
  };

  useEffect(() => {
    setModalContent(
      <>
        <ScrollView>
          {countrysData.map((region, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => {
                  setCountry(region), setModalVisible(false);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#001C30" : "transparent",
                  },
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 20,
                      color: "#eeeeee",
                      padding: 8,
                    }}
                  >
                    {region.name}
                  </Text>
                )}
              </Pressable>
            </React.Fragment>
          ))}
        </ScrollView>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.textStyle}>OK</Text>
        </Pressable>
      </>
    );
  }, [countrysData]);

  const statesLister = () => {
    if (country == null) {
      console.log("ülke seçmediniz");
    } else {
      const stateUrl = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/`;

      var config = {
        method: "get",
        url: stateUrl,
        headers: {
          "X-CSCAPI-KEY":
            "eXdUWjJ3Skhod29weFdleFBaZGFqT3VKeG9mdXdBN0hJaTRMVlZCSw==",
        },
      };

      axios(config)
        .then(function (response) {
          setCities(null);
          setStatesData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      setModalVisible(true);
    }
  };

  useEffect(() => {
    setModalContent(
      <>
        <ScrollView>
          {statesData.map((region, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => {
                  setState(region), setModalVisible(false);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#001C30" : "transparent",
                  },
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 20,
                      color: "#eeeeee",
                      padding: 8,
                    }}
                  >
                    {region.name}
                  </Text>
                )}
              </Pressable>
            </React.Fragment>
          ))}
        </ScrollView>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.textStyle}>OK</Text>
        </Pressable>
      </>
    );
  }, [statesData]);

  const citiesLister = () => {
    if (state == null) {
      console.log("şehir seçmediniz");
    } else {
      const citiesUrl = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities/`;

      var config = {
        method: "get",
        url: citiesUrl,
        headers: {
          "X-CSCAPI-KEY":
            "eXdUWjJ3Skhod29weFdleFBaZGFqT3VKeG9mdXdBN0hJaTRMVlZCSw==",
        },
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data, null, 2));
          setCitiesData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      setModalVisible(true);
    }
  };

  useEffect(() => {
    setModalContent(
      <>
        <ScrollView>
          {citiesData.map((region, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => {
                  setCities(region), setModalVisible(false);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#001C30" : "transparent",
                  },
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 20,
                      color: "#eeeeee",
                      padding: 8,
                    }}
                  >
                    {region.name}
                  </Text>
                )}
              </Pressable>
            </React.Fragment>
          ))}
        </ScrollView>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.textStyle}>OK</Text>
        </Pressable>
      </>
    );
  }, [citiesData]);
  ////////////////////////////////////////////////////////
  const addProfileDetails = async () => {
    if (
      !country ||
      !state ||
      !storageImageURL ||
      nameIcon.availableName == false
    ) {
      // Eksik veri var, kullanıcıya bir uyarı gösterilebilir
      console.log("Lütfen zorunlu alanları doldurun.");
      return;
    }

    await updateDoc(doc(db, "users", userID), {
      country: country.name,
      state: state.name,
      cities: cities?.name ?? null,
      userGender: gender,
      userDescription: description,
      bornDate: Timestamp.fromDate(date),
      storageProfileImageURL: storageImageURL,
      profileDetailsCreated: true,
      userName: uniqueName,
    });

    navigation.navigate("HomeScreen");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      const storageRef = ref(storage, `UserAvatars/${userID}/pp.jpg`);
      const blobFile = await uriToBlob(result.assets[0].uri);
      await uploadBytes(storageRef, blobFile).then(async (snapshot) => {
        const url = await getDownloadURL(storageRef);
        setStorageImageURL(url);
      });
    }
  };

  const [uniqueName, setUniqueName] = useState("");
  const [nameIcon, setNameIcon] = useState({
    availableName: false,
    color: "#4477CE",
    icon: "arrow-left-thick",
  });
  const allowedPattern = /^[a-z0-9]*$/; // Sadece harf ve rakamlar izin veriliyor

  const handleInputChange = async (newValue) => {
    console.log(newValue)
    if (newValue == "") {
      console.log("boş")
      setUniqueName(newValue);
      setNameIcon({
        availableName: false,
        color: "#4477CE",
        icon: "arrow-left-thick",
      });
    } else {
    if (allowedPattern.test(newValue)) {
        setUniqueName(newValue);

        const userNames = collection(db, "users");
        const q = query(userNames, where("userName", "==", newValue));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.empty);
        if (querySnapshot.empty) {
          setNameIcon({
            availableName: true,
            color: "green",
            icon: "check-bold",
          });
        } else {
          setNameIcon({
            availableName: false,
            color: "red",
            icon: "close-thick",
          });
        }
      }
    }
  };

  return (
    <View>
      <SafeAreaView style={{ backgroundColor: "#282A3A", height: "100%" }}>
        <StaticTopBar text={"Profilini Oluştur"} />

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
              flexDirection: "row",
              padding: 8,
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                fontFamily: "CabinRegular",
                color: "#eeeeee",
                fontSize: 25,
              }}
            >
              @
            </Text>
            <TextInput
              style={{
                width: "80%",
                height: 40,
                borderBottomWidth: 1,
                paddingHorizontal: 5,
                color: "#eeeeee",
                fontFamily: "CabinRegular",
                fontSize: 20,
              }}
              inlineImageLeft=""
              onChangeText={handleInputChange}
              value={uniqueName}
              placeholder="Kullanıcı adı"
              placeholderTextColor={"#eeeeeeaa"}
            />
            <Avatar.Icon
              style={{ backgroundColor: "transparent" }}
              color={nameIcon.color}
              size={40}
              icon={nameIcon.icon}
            />
          </View>

          <View
            style={{
              backgroundColor: "#001C30",
              borderBottomColor: "#000000",
              minHeight: 150,
              borderRadius: 5,
            }}
          >
            <TextInput
              editable
              multiline
              placeholder="Açıklama ekleyebilirsin..."
              placeholderTextColor={"#eeeeeeaa"}
              maxLength={400}
              onChangeText={(text) => onChangeDescription(text)}
              value={description}
              style={{ padding: 10, color: "#eeeeee" }}
            />
          </View>

          <Pressable
            style={{
              marginTop: 5,
              padding: 10,
              backgroundColor: "#001C30",
              borderRadius: 5,
            }}
            onPress={() => showDatepicker()}
          >
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#eeeeee66",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {date.getDate()} / {date.getMonth() + 1} / {date.getFullYear()}
              </Text>
            </View>
          </Pressable>

          <View
            style={{
              marginTop: 5,
              backgroundColor: "#001C30",
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <Button
                rippleColor="white"
                textColor="#eeeeee66"
                onPress={() => countrysLister()}
                style={styles.regionText}
              >
                {country?.name ?? "Ülke"}
              </Button>
              <Text style={{ fontSize: 25, color: "#eeeeee66" }}>/ </Text>

              <Button
                rippleColor="white"
                textColor="#eeeeee66"
                eeeeee66
                onPress={() => statesLister()}
                style={styles.regionText}
              >
                {state?.name ?? "Şehir"}
              </Button>
              <Text style={{ fontSize: 25, color: "#eeeeee66" }}>/ </Text>

              <Button
                rippleColor="white"
                textColor="#eeeeee66"
                onPress={() => citiesLister()}
                style={styles.regionText}
              >
                {cities?.name ?? "İlçe"}
              </Button>
            </View>
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
              style={{ borderRadius: 20, backgroundColor: "#001C30" }}
              value={gender}
              onValueChange={setGender}
              buttons={[
                {
                  value: "male",
                  label: "Erkek",
                  checkedColor: "green",
                  uncheckedColor: "white",
                  icon: "face-man-shimmer",
                },
                {
                  value: "other",
                  label: "Belirtme",
                  checkedColor: "red",
                  uncheckedColor: "white",
                },
                {
                  value: "female",
                  label: "Kadın",
                  checkedColor: "purple",
                  uncheckedColor: "white",

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
              <View style={styles.modalView}>{modalContent}</View>
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
    backgroundColor: "transparent",
    maxWidth: 100,
    height: 40,
    borderRadius: 5,
  },
  container: {
    borderRadius: 5,
    width: "100%",
    height: Dimensions.get("window").width - 20,
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
    margin: 20,
    backgroundColor: "#282A3A",
    borderRadius: 5,
    padding: 35,
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
  },
  datePickerTexts: {
    textAlign: "center",
    width: 80,
    fontWeight: "bold",
    fontSize: 20,
  },
});
