import { View, Text, Dimensions, StyleSheet, Image, ScrollView, TextInput, Button } from 'react-native'

import React from 'react'
import StaticTopBar from '../components/StaticTopBar';
// import { Button } from 'react-native-paper';
import { List } from 'react-native-paper';
import EventListAccordion from '../components/EventListAccordion';
import ImagePick from '../components/ImagePick';

export default function CreateProfile() {
    const [value, onChangeText] = React.useState('Useless Multiline Placeholder');
    return (
        <View style={{
            backgroundColor: 'rgb(172, 172, 172)',
            height: '100%'

        }}>
            <ScrollView>
                <StaticTopBar text={"Create Profile"} />

                <View style={styles.container}>
                    <Image
                        source={require('../assets/defaultAcc.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <Button
                    // onPress={onPressLearnMore}
                    title="Görsel Ekle"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />

                {/* <ImagePick /> */}

                <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={400}
                    onChangeText={text => onChangeText(text)}
                    value={value}
                    style={{ padding: 10, backgroundColor: 'white' }}
                ></TextInput>



            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width, // Eğer dörtgen bir avatar isteniyorsa bu kısmı özelleştirebilirsiniz.
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
});