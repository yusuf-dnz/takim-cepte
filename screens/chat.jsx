import { View, Text ,ScrollView} from 'react-native'
import React from 'react'
import { Avatar, Card, Divider, IconButton } from 'react-native-paper';

export default function Chat() {
  return (
    <ScrollView>
      <View>
        {/* <Text>chat</Text> */}

        {/* <View style = {{ width:'100%', height:100,}} ></View> */}
        <Card.Title
          style={{ margin: 20, borderRadius: 10, backgroundColor: 'rgba(64, 108, 175, 0)', }}
          title="Muhammed Güzel "
          subtitle="tmm"
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
        />
        <Divider inset/>
      </View>
    </ScrollView>
  )
}