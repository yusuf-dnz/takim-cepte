import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, IconButton } from 'react-native-paper';
import { collection, doc, setDoc } from "firebase/firestore";
import { eventLister } from '../firebase';
import StaticTopBar from '../components/statictopbar';


export default function Search() {


  const [events, setEvent] = useState([]);

  const list = async e => {

    const eventList = await eventLister();
    setEvent(eventList);
    // console.log(events);

  }

  useEffect(() => {
    list();
  }, []);

  return (
    <View>
        <StaticTopBar text={"TOPLULUK"}/>

      <ImageBackground
        style={{ minHeight: '100%' }}
        source={require('../assets/backgroundimg.jpg')}
      >

        <ScrollView>

          <View style={{ flex: 1 }}>

            <View>
              {events.map((event, index) => (

                <Card.Title
                  key={index}
                  style={{ margin: 10, borderRadius: 10, backgroundColor: 'rgba(64, 108, 175, 0.4)',  }}
                  title={event}
                  titleStyle={{color:'white',fontWeight:'bold',fontSize:22,}}
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