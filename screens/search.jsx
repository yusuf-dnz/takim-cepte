import { View, Text, ScrollView, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, IconButton } from 'react-native-paper';
import { db, eventLister } from '../firebase';
import StaticTopBar from '../components/StaticTopBar';
import { getFirestore, doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";



export default function Search() {


  const [events, setEvents] = useState([]);


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



  return (
    <View>

      <ImageBackground
        style={{ height: Dimensions.get('window').height }}
        source={require('../assets/bg.jpg')}
      >
        <StaticTopBar text={"TOPLULUK"} />

        <ScrollView>

          <View style={{ flex: 1 }}>

            <View>
              {events.map((event, index) => (

                <Card.Title
                  key={index}
                  style={{ margin: 10, borderRadius: 10, backgroundColor: 'rgba(64, 108, 175, 0.4)', }}
                  title={event}
                  titleStyle={{ color: 'white', fontWeight: 'bold', fontSize: 22, }}
                  // subtitle="tmm"
                  left={(props) => <Avatar.Icon {...props} icon="earth" />}
                // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                />
              ))}

            </View>


          </View>
        </ScrollView>
      </ImageBackground>

    </View>
  )
}