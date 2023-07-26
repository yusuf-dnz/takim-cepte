import { View, Text } from 'react-native'
import React from 'react'

export default function StaticTopBar({text}) {
    return (
        <View style={{ height: 50, backgroundColor: 'rgba(64, 108, 175, 0.4)', alignItems: 'center', }}>
            <Text style={{color:'white',paddingTop:20,fontSize:18,}}>{text}</Text>
        </View>
    )
}