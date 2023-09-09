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
  BackHandler,
} from "react-native";
import {
  Avatar,
  Badge,
  IconButton,
  List,
  MD3Colors,
  useTheme,
} from "react-native-paper";
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
import { ThemeContext } from "../Theme";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/authentication";
import { useFocusEffect } from "@react-navigation/core";
import { useCallback } from "react";
import { COUNTRY_STATE_CITY_API_KEY } from "@env";
import { Toast } from "react-native-toast-message/lib/src/Toast";
// import Toast from 'react-native-toast-message';

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
  const Theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  theme.colors.secondaryContainer = Theme.secondaryContainer;

  const [countrysData, setCountrysData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [cities, setCities] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [description, onChangeDescription] = React.useState("");
  const [storageImageURL, setStorageImageURL] = useState("");
  const [date, setDate] = useState(new Date(1110000000000));
  const [gender, setGender] = React.useState("other");

  const [page, setPage] = useState(false);

  const userId = auth.currentUser.uid;
  const userEmail = auth.currentUser.email;
  const createdAt = auth.currentUser.metadata.creationTime;

  const changeScreen = () => {
    if (country) {
      setPage(true);
    } else {
      Toast.show({
        position: "bottom",
        type: "error",
        text1: "Ülke seçimi zorunlu alan!",
      });
    }
  };

  const backAction = () => {
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

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
  useEffect(() => {
    const getCountryList = async () => {
      var config = {
        method: "get",
        url: "https://api.countrystatecity.in/v1/countries/",
        headers: {
          "X-CSCAPI-KEY": COUNTRY_STATE_CITY_API_KEY,
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
    };
    getCountryList();
  }, []);

  const countrysLister = () => {
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

    setModalVisible(true);
  };

  const statesLister = async () => {
    if (country == null) {
      Toast.show({
        type: "error",
        text1: "Bir saniye!",
        text2: "Ülke seçmelisin 😊 ",
      });
    } else {
      const stateUrl = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/`;

      var config = {
        method: "get",
        url: stateUrl,
        headers: {
          "X-CSCAPI-KEY": COUNTRY_STATE_CITY_API_KEY,
        },
      };

      axios(config)
        .then(function (response) {
          function sortNames(a, b) {
            return a.name - b.name;
          }

          setCities(null);
          response.data.sort((a, b) => a.name.localeCompare(b.name));

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
      Toast.show({
        type: "error",
        text1: "Bir saniye!",
        text2: "Şehir seçmelisin 😊",
      });
    } else {
      const citiesUrl = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities/`;

      var config = {
        method: "get",
        url: citiesUrl,
        headers: {
          "X-CSCAPI-KEY": COUNTRY_STATE_CITY_API_KEY,
        },
      };

      axios(config)
        .then(function (response) {
          setCitiesData(response.data.sort());
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
      !storageImageURL ||
      nameIcon.availableName == false
    ) {
      Toast.show({
        position: "bottom",
        type: "error",
        text1: "Gerekli alanlar doldurulmadı !",
        visibilityTime: 2000,
      });
      return;
    }

    let ProfileDoc = {
      // displayName: displayName,
      email: userEmail,
      userId: userId,
      createdDate: Timestamp.fromDate(new Date(createdAt)),
      registeredEvents: [],
      country: country.name,
      state: state?.name ?? null,
      cities: cities?.name ?? null,
      userGender: gender,
      userDescription: description,
      bornDate: Timestamp.fromDate(date),
      storageProfileImageURL: storageImageURL,
      userName: uniqueName,
      disabled: false,
      emailVerified: false,

    };

    try {
      navigation.navigate("HomeScreen");
      await setDoc(doc(db, "users", userId), ProfileDoc);
      dispatch(setUserData(JSON.stringify(ProfileDoc)));
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      // setImage(result.assets[0].uri);

      const storageRef = ref(storage, `UserAvatars/${userId}/pp.jpg`);
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

  const handleInputChange = (newValue) => {
    if (newValue == "") {
      setUniqueName(newValue);
      setNameIcon({
        availableName: false,
        color: "#4477CE",
        icon: "arrow-left-thick",
      });
    } else {
      if (allowedPattern.test(newValue)) {
        setUniqueName(newValue);

        setTimeout(async function () {
          const userNames = collection(db, "users");
          const q = query(userNames, where("userName", "==", newValue));
          const querySnapshot = await getDocs(q);
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
        }, 1000);
      }
    }
  };

  const styles = StyleSheet.create({
    fieldDescription: {
      textAlign: "center",
      color: Theme.color,
      marginTop: "10%",
    },
    genderButtonText: {
      color: Theme.softColor,
      fontSize: 18,
      padding: 5,
    },

    regionText: {
      backgroundColor: "transparent",
      maxWidth: 100,
      height: 40,
      borderRadius: 5,
    },
    pictureArea: {
      marginVertical: 10,
      width: 202,
      height: 202,
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Theme.secondaryContainer,
    },
    image: {
      marginLeft: "auto",
      marginRight: "auto",
      flex: 1,
      width: 200,
      height: 200,
      borderRadius: 10,
      backgroundColor: "#01000550",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      marginTop: "20%",
      maxHeight: "80%",
      margin: 20,
      backgroundColor: Theme.modalColor,
      borderRadius: 5,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 2,
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
      color: Theme.color,
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

  return (
    <View>
      {!page ? (
        <>
          <SafeAreaView
            style={{
              backgroundColor: Theme.backgroundColor,
              height: "100%",
            }}
          >
            <ScrollView style={{ padding: 10 }}>
              <View style={{ marginTop: "30%" }}>
                <View>
                  <Text style={styles.fieldDescription}> Konum</Text>
                  <Text
                    style={{
                      color: Theme.danger,
                      fontSize: 10,
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    * Ülke seçimi zorunlu
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 5,
                    backgroundColor: Theme.backgroundColor,
                    borderRadius: 5,
                    paddingHorizontal: 10,
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
                      rippleColor={Theme.secondaryContainer}
                      textColor={Theme.softColor}
                      onPress={() => countrysLister()}
                      style={styles.regionText}
                    >
                      {country?.name ?? "Ülke"}
                    </Button>
                    <Text style={{ fontSize: 25, color: Theme.softColor }}>
                      /{" "}
                    </Text>

                    <Button
                      rippleColor={Theme.secondaryContainer}
                      textColor={Theme.softColor}
                      onPress={() => statesLister()}
                      style={styles.regionText}
                    >
                      {state?.name ?? "Şehir"}
                    </Button>
                    <Text style={{ fontSize: 25, color: Theme.softColor }}>
                      /{" "}
                    </Text>

                    <Button
                      rippleColor={Theme.secondaryContainer}
                      textColor={Theme.softColor}
                      onPress={() => citiesLister()}
                      style={styles.regionText}
                    >
                      {cities?.name ?? "İlçe"}
                    </Button>
                  </View>
                </View>

                <Text style={styles.fieldDescription}>
                  Doğum Tarihi Seçiniz
                  <Text style={{ color: Theme.danger }}> *</Text>
                </Text>
                <Pressable
                  style={{
                    marginTop: 5,
                    padding: 10,
                    backgroundColor: Theme.component,
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
                        color: Theme.softColor,
                        fontSize: 20,
                        textAlign: "center",
                      }}
                    >
                      {date.getDate()} / {date.getMonth() + 1} /{" "}
                      {date.getFullYear()}
                    </Text>
                  </View>
                </Pressable>

                <Text style={styles.fieldDescription}>
                  {" "}
                  Cinsiyet
                  <Text style={{ color: Theme.danger }}> *</Text>
                </Text>

                <View
                  style={{
                    alignItems: "center",
                    marginTop: 5,
                    padding: 5,
                    height: 80,
                  }}
                >
                  <SegmentedButtons
                    style={{
                      borderRadius: 20,
                      backgroundColor: Theme.component,
                    }}
                    value={gender}
                    onValueChange={setGender}
                    buttons={[
                      {
                        value: "male",
                        label: "Erkek",
                        checkedColor: "#54BAB9",
                        uncheckedColor: Theme.color,
                        icon: "face-man-shimmer",
                      },
                      {
                        value: "other",
                        label: "Belirtmek İstemiyorum",
                        checkedColor: "#344e41",
                        uncheckedColor: Theme.color,
                      },
                      {
                        value: "female",
                        label: "Kadın",
                        checkedColor: "#C23373",
                        uncheckedColor: Theme.color,

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
                    onRequestClose={() => setModalVisible(!modalVisible)}
                  >
                    <View style={styles.modalView}>{modalContent}</View>
                  </Modal>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                borderTopColor: "rgba(0,0,255,0.2)",
                borderTopWidth: 2,
              }}
            >
              <IconButton
                icon="check-bold"
                iconColor={"white"}
                animated={true}
                size={20}
                onPress={changeScreen}
              />
            </View>
          </SafeAreaView>
        </>
      ) : (
        <>
          <SafeAreaView
            style={{
              backgroundColor: Theme.backgroundColor,
              height: "100%",
            }}
          >
            <IconButton
              style={{}}
              icon="arrow-left-bold"
              iconColor={Theme.color}
              onPress={()=>setPage(false)}
            />
            <ScrollView style={{ padding: 10 }}>
              <View style={{ marginTop: "30%" }}>
                <View style={styles.pictureArea}>
                  {storageImageURL && (
                    <Image
                      source={{ uri: storageImageURL }}
                      style={styles.image}
                    />
                  )}

                  <View
                    style={{
                      zIndex: 1,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "transparent",
                    }}
                  >
                    <IconButton
                      style={{}}
                      icon="camera"
                      iconColor={"white"}
                      animated={true}
                      size={20}
                      onPress={pickImage}
                    />
                  </View>
                </View>

                <View style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <View
                    style={{
                      width: "80%",
                      flexDirection: "row",
                      padding: 5,
                    }}
                  >
                    <TextInput
                      style={{
                        width: "80%",
                        height: 40,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.softColor,
                        paddingHorizontal: 5,
                        color: Theme.color,
                        fontFamily: "CabinRegular",
                        fontSize: 20,
                      }}
                      onChangeText={handleInputChange}
                      value={uniqueName}
                      placeholder="Kullanıcı adı"
                      placeholderTextColor={Theme.softColor}
                    />
                    <View>
                      <Avatar.Icon
                        style={{
                          backgroundColor: "white",
                          position: "absolute",
                          bottom: 5,
                          left: -30,
                        }}
                        color={nameIcon.color}
                        size={25}
                        icon={nameIcon.icon}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                borderTopColor: "rgba(0,0,255,0.2)",
                borderTopWidth: 2,
              }}
            >
              <IconButton
                icon="check-bold"
                iconColor={"white"}
                animated={true}
                size={20}
                onPress={addProfileDetails}
              />
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}
