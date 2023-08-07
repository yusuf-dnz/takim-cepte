import { View, Text, ScrollView, ImageBackground, Dimensions, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, IconButton, List } from 'react-native-paper';
import { auth, db, eventLister } from '../firebase';
import StaticTopBar from '../components/StaticTopBar';
import { getFirestore, doc, setDoc, getDocs, collection, getDoc, addDoc } from "firebase/firestore";



export default function Search() {


  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    var eventArray = [];
    const eventLister = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        eventArray.push(
          doc.id
        );
      });
      setEvents(eventArray)
    }


    eventLister();
  }, []);

  useEffect(() => {
    var userArray = [];
    const userLister = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        userArray.push(doc.data())
        // console.log(doc.data())

      });
      setUsers([...userArray]);
    }

    userLister();
    console.log(users)
  }, []);

  const createChat = async (targetID) => {
    const docRef = await addDoc(collection(db, "chats"), {
      participants: [auth.currentUser.uid, targetID],
    });

  }

  return (
    <View >
      <StaticTopBar text={"TOPLULUK"} />
      <ScrollView>
        <View style={{ flex: 1,marginBottom:100}}>

          <View>
            {events.map((event, index) => (

              <Card.Title
                key={index}
                style={{ margin: 10, borderRadius: 10, backgroundColor: 'rgba(64, 108, 175, 0.4)', }}
                title={event}
                titleStyle={{ color: 'white', fontWeight: 'bold', fontSize: 22, }}
                left={(props) => <Avatar.Icon {...props} icon="earth" />}
              />
            ))}

          </View>

          <View>
            {users.map((user,index) => (
              <React.Fragment
                  key={index}>
                    
                <List.Item
                  key={index}
                  title={user.userId}
                  description="hi"
                  left={() => (
                    <Avatar.Text
                      label="UN"
                      size={56}
                    />
                  )}
                  right={() => (
                    <Button title='+' onPress={() => createChat(user.userId)} />
                  )}
                />
            </React.Fragment>

            ))}

          </View>

        </View>
      </ScrollView>

    </View>
  )
}