import { View, Text } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-paper'

export default function StaticTopBar({text}) {
    return (
        <View style={{ height: 25, backgroundColor: '#ffffff30', alignItems: 'center', }}>
            <Text style={{color:'black',paddingTop:0,fontSize:18,}}>{text}</Text>
      

        </View>
        
    )
}