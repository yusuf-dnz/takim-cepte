import { View, Text, ScrollView, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, Divider, IconButton, List } from 'react-native-paper';
import StaticTopBar from '../components/StaticTopBar';
import { useNavigation } from '@react-navigation/native';
import ChatScreen from './chat_screen';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ChatList({ navigation }) {

  const [chatList, setChatList] = useState([]);

  useEffect(() => {

    const ChatLister = async () => {
     
      const q = query(collection(db, "chats"), where("participants", "array-contains-any", [auth.currentUser.uid ]));
      const array = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const id = doc.id; 
        const dataWithId = { id, ...doc.data() };
        array.push(dataWithId)
      });
      setChatList(array);
    }

    ChatLister();
  }, [])


  return (
    <View style={{}}>

      <StaticTopBar text={"CHATS"} />

      <ScrollView>

        <View style={{ flex: 1, marginHorizontal: 10 }}>
          {chatList.map((chat, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={chat.participants[1]}
                description={chat.id}
                left={() => (
                  <Avatar.Text
                    label="UN"
                    size={56}
                  />
                )}
                onPress={() => navigation.navigate("ChatScreen", {chatId: chat.id })}
              />
              <Divider />
            </React.Fragment>

          ))}

        </View>
      </ScrollView>


    </View >

  )
}