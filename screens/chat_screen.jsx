import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { auth, db } from '../firebase'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRoute } from '@react-navigation/core'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { GiftedAvatar, GiftedChat } from 'react-native-gifted-chat'

export default function ChatScreen() {
  const route = useRoute();
  const chatID = route.params.chatId;
  const userID = auth.currentUser.uid;


  const [userProfileData, setUserProfileData] = useState({});
  useEffect(() => {
      const getUserProfile = async () => {
          const docRef = doc(db, "users", userID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              setUserProfileData(docSnap.data())
          } else {
              console.log("No such document!");
          }
      }
      getUserProfile();
  }, [])



  const [messages, setMessages] = useState([]);

  useEffect(() => {
        const messages = onSnapshot(doc(db, "chats", chatID), (doc) => {
        setMessages(doc.data()?.messages ?? []);
        
      });
  }, [chatID]);

  const onSend = async (m = []) => {
    const docRef = doc(db, "chats", chatID);
    await updateDoc(docRef,         
      {
      messages: GiftedChat.append(messages, m),
      },
      { merge: true }
  );

  };

  console.log(messages)

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          avatar: userProfileData.storageProfileImageURL,
        }}
      />
    </View>
  );
 
}
