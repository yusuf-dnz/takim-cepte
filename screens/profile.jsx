import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { logOutApp } from '../firebase';
import { Button } from 'react-native-paper';

export default function Profile({navigation}) {
    const handleLogOut = async e => {
        const user = await logOutApp();
        navigation.navigate('LogIn');
      }
    return (
    <ScrollView>

        <View style={{marginBottom:60}}>
            <View style={{
                height:1000,
            }}>

            </View>
            <Button
                style={{
                    marginTop: 0,
                    alignItems: 'flex-end',
                }}
                onPress={() => handleLogOut()}>
                Çıkış yap
            </Button>
        </View>
        </ScrollView>
    )
}