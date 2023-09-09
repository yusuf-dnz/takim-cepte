import { View, Text, ScrollView, StyleSheet, BackHandler } from "react-native";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { Avatar, IconButton, List } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { ThemeContext } from "../Theme";
import { useContext } from "react";

export default function ParticipantsPage(props) {
  const navigation = useNavigation();

  const Theme = useContext(ThemeContext);

  const backAction = () => {
    props.clearEvent();
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

  const [users, setUsers] = useState([]);
  useEffect(() => {
    var userArray = [];
    const userLister = async () => {
      const q = query(
        collection(db, "users"),
        where("registeredEvents", "array-contains", props.selectedEvent)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userArray.push(doc.data());
      });

      setUsers([...userArray]);
    };

    userLister();
  }, []);

  return (
    <View>
      <View style={{flexDirection:'row'}}>
      <IconButton
      onPress={backAction}
      style={{height:25}}
      icon="arrow-left"
      iconColor={Theme.softColor}
      
      />
      <Text style={{fontSize:15,padding:8,color:Theme.softColor}}>Etkinliklere dön</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View>
          {users.map((user, index) => (
            <React.Fragment key={index}>
              <List.Item
                style={{
                  paddingHorizontal: 5,
                  margin: 5,
                  borderRadius: 5,
                  backgroundColor: Theme.component,
                }}
                title={user.displayName}
                titleStyle={{ color: Theme.color }}
                description={user.userDescription}
                descriptionStyle={{ color: Theme.color }}
                left={() => (
                  <Avatar.Image
                    size={64}
                    style={{}}
                    source={{
                      uri:
                        user.storageProfileImageURL ??
                        "https://firebasestorage.googleapis.com/v0/b/takimcepte.appspot.com/o/UserAvatars%2Fdefault.jpg?alt=media&token=30eeda7b-2ffc-472c-a5be-4ede8b28cf0b",
                    }}
                  />
                )}
                onPress={() => {
                  navigation.navigate("VisitProfile", {
                    targetUserData: user,
                  });
                }}
              />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
});
