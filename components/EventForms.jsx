import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { IconButton, List, TextInput } from "react-native-paper";
import { ThemeContext, theme } from "../Theme";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { setUserData } from "../redux/authentication";

let formData = {};

const addEvent = async (title, eventId, authId, data) => {
  try {
    const ref = doc(db, "users", authId);
    await updateDoc(ref, {
      registeredEvents: arrayUnion(title),
    });
  } catch (error) {
    console.error("Hata oluştu:", error);
    console.error("Hatanın detayı:", error.stack);
  }

  try {
    await setDoc(doc(db, `events/${eventId}/participants`, authId), data);
  } catch (error) {
    console.log(" setdoc: ", error);
  }
};

export function Football_Form() {
  const positions = ["Kaleci", "Defans", "OrtaSaha", "Hücum"];
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <TextInput
          maxLength={3}
          style={{ width: "45%" }}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Kilo"
          right={<TextInput.Affix text="kg" />}
          onChangeText={(num) => {
            formData.weight = num;
          }}
          value={formData.weight}
        />
        <TextInput
          maxLength={3}
          style={{ width: "45%" }}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Boy"
          right={<TextInput.Affix text="cm" />}
          onChangeText={(num) => {
            formData.height = num;
          }}
          value={formData.height}
        />
      </View>

      <SelectDropdown
        defaultButtonText="Mevki seçebilirsin!"
        buttonStyle={{ width: "100%", marginVertical: 5, borderRadius: 5 }}
        data={positions}
        onSelect={(selectedItem, index) => {
          formData.position = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </View>
  );
}

export function Basketball_Form() {
  const positions = ["Şutör Guard", "Küçük Forvet", "Büyük Forvet", "Pivot "];
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <TextInput
          maxLength={3}
          style={{ width: "45%" }}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Kilo"
          right={<TextInput.Affix text="kg" />}
          onChangeText={(num) => {
            formData.weight = num;
          }}
          value={formData.weight}
        />
        <TextInput
          maxLength={3}
          style={{ width: "45%" }}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Boy"
          right={<TextInput.Affix text="cm" />}
          onChangeText={(num) => {
            formData.height = num;
          }}
          value={formData.height}
        />
      </View>

      <SelectDropdown
        defaultButtonText="Mevki seçebilirsin!"
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        data={positions}
        onSelect={(selectedItem, index) => {
          formData.position = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </View>
  );
}

export function Valorant_Form() {
  const agents = [
    "Brimstone",
    "Viper",
    "Omen",
    "Killjoy",
    "Cypher",
    "Sova",
    "Jett",
    "Reyna",
    "Raze",
  ];
  const positions = ["Düellocu", "Gözcü", "Kontrol Uzmanı", "Öncü"];
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Main ajanın..."
        data={agents}
        onSelect={(selectedItem, index) => {
          formData.agent = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki..."
        data={positions}
        onSelect={(selectedItem, index) => {
          formData.position = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </View>
  );
}

export function LOL_Form() {
  const positions = [
    "Üst koridor",
    "Ormancı",
    "Orta koridor",
    "Nişancı",
    "Destek",
  ];
  return (
    <>
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki seçiniz"
        data={positions}
        onSelect={(selectedItem, index) => {
          formData.position = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export function CS2_Form() {
  const positions = [
    "Game Leader (IGL)",
    "Supporter",
    "Entry",
    "Lurker",
    "Flex",
    "AWP Player",
  ];
  return (
    <>
      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki..."
        data={positions}
        onSelect={(selectedItem, index) => {
          formData.position = selectedItem;
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export default function EventForms({ modalVisible }) {
  const dispatch = useDispatch();
  let CurrentUser = useSelector((state) => state.authStatus.userData);
  const authId = useSelector((state) => state.authStatus.authId);

  const [eventForm, setEventForm] = useState(false);
  const [eventModal, showEventModal] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const forms = {
    basketball: (<Basketball_Form eventData={selectedEvent} />),
    football: <Football_Form eventData={selectedEvent} />,
    league_of_legends: (<LOL_Form eventData={selectedEvent} />),
    counter_strike_2: (<CS2_Form eventData={selectedEvent} />),
    valorant: <Valorant_Form eventData={selectedEvent} />,
  };



  useEffect(() => {
    let arr = [];
    const getEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      setAllEvents(arr);
    };

    getEvents();
  }, []);

  const Theme = useContext(ThemeContext);
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      width: "80%",
      maxHeight: "80%",

      backgroundColor: Theme.modalColor,
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
      marginTop: 10,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
  });
  return (
    <>
      <View>
        <IconButton
          icon="close-thick"
          iconColor={Theme.danger}
          onPress={() => {
            modalVisible(), setEventForm(false);
          }}
        />
        <ScrollView style={{ width: "100%" }}>
          {!eventForm ? (
            <>
              {allEvents.map((eventItem, index) => (
                <React.Fragment key={index}>
                  <Pressable
                    onPress={() => {
                      setEventForm(true),
                        setSelectedEvent(eventItem),
                        (formData = {});
                    }}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? Theme.modalPressable
                          : "transparent",
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <List.Item
                      title={eventItem.eventTitle}
                      titleStyle={{ color: Theme.color }}
                      left={() => (
                        <Image
                          source={{
                            uri: eventItem.eventIconURL,
                          }}
                          resizeMode="cover"
                          style={{
                            width: 50,
                            height: 50,
                            marginLeft: 5,
                          }}
                        />
                      )}
                    />
                  </Pressable>
                </React.Fragment>
              ))}
            </>
          ) : (
            <>{forms[selectedEvent.eventTitle]}</>
          )}
        </ScrollView>
        <IconButton
          icon="check"
          iconColor={theme.color}
          onPress={() => {
            modalVisible(),
              addEvent(
                selectedEvent.eventTitle,
                selectedEvent.eventId,
                authId,
                formData
              ),
              (CurrentUser.registeredEvents = [
                ...CurrentUser.registeredEvents,
                selectedEvent.eventTitle,
              ]);
            dispatch(setUserData(JSON.stringify(CurrentUser)));
          }}
        />
      </View>
    </>
  );
}
