import { View, Text } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-paper'

export default function StaticTopBar({text}) {
    return (
        <View style={{ height: 50, backgroundColor: 'transparent', alignItems: 'center', }}>
            <Text style={{color:'white',paddingTop:20,fontSize:18,}}>{text}</Text>
      

        </View>
        
    )
}