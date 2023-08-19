import { View, Text } from 'react-native'
import React from 'react'

export default function Places() {

    const jsonData = require('../countries+states+cities.json');

    console.log('Veri:');
    
    // Veri üzerinde işlem yapabilirsiniz
    for (let person of jsonData) {
      console.log('İsim:', person.name);
      console.log('Yaş:', person.age);
      console.log('E-posta:', person.email);
    }





  return (
    <View>
      <Text>Places</Text>
    </View>
  )
}

