import { View, Text } from 'react-native'
import React from 'react'
import { Avatar, Card, IconButton } from 'react-native-paper';

export default function Chat() {
  return (
    <View>
      {/* <Text>chat</Text> */}

      <View style = {{ width:'100%', height:100,}} >


      </View>
      <Card.Title
    title="Muhammed Güzel "
    subtitle="tmm"
    left={(props) => <Avatar.Icon {...props} icon="folder" />}
    right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
  />
    </View>
  )
}