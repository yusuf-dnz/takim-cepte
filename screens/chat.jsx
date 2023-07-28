import { View, Text, ScrollView, ImageBackground, Dimensions } from 'react-native'
import React from 'react'
import { Avatar, Card, Divider, IconButton } from 'react-native-paper';
import StaticTopBar from '../components/StaticTopBar';


export default function Chat() {
  return (

    <View style={{}}>
      <ImageBackground
        style={{ height: Dimensions.get('window').height }}
        source={require('../assets/bg.jpg')}
      >

      <StaticTopBar text={"CHAT"} />


      <ScrollView>

        <View>
          <Card.Title
            style={{ margin: 20, borderRadius: 10, backgroundColor: 'rgba(64, 108, 175, 0)' }}
            title="Muhammed Güzel "
            titleStyle={{ marginHorizontal: 20, color: 'white', fontSize: 17 }}
            subtitle="tmm"
            subtitleStyle={{ marginHorizontal: 20, color: 'white', fontSize: 14 }}
            left={(props) => <Avatar.Icon {...props} icon="account" size={60} />}
          // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
          />
          <Divider/>
        </View>
      </ScrollView>
    </ImageBackground>

    </View >

  )
}