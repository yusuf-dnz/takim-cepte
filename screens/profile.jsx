import { View, Text } from 'react-native'
import React from 'react'
import { logOutApp } from '../firebase';
import { Button } from 'react-native-paper';

export default function Profile({navigation}) {
    const handleLogOut = async e => {
        const user = await logOutApp();
        navigation.navigate('LogIn');
      }
    return (
        <View>

            <Button
                style={{
                    marginTop: 10,
                    alignItems: 'flex-end',
                }}
                onPress={() => handleLogOut()}>
                Çıkış yap
            </Button>
        </View>
    )
}