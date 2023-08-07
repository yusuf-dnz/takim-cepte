import { View, Text, Dimensions, StyleSheet, Image, ScrollView, TextInput, Button, Alert, Modal, Pressable, } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react'
import StaticTopBar from '../components/StaticTopBar';
import DatePicker from '@dietime/react-native-date-picker';
import { auth, db, storage } from '../firebase';
import { Timestamp, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


export const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response)
        }
        xhr.onerror = function () {
            reject(new Error('uriToBlob failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)

        xhr.send(null)
    })
}



export default function CreateProfile({ navigation }) {

    const [description, onChangeDescription] = React.useState('');

    const [image, setImage] = useState(null);

    const [storageImageURL, setStorageImageURL] = useState('');

    const [bornDate, setBornDate] = useState(new Date('2000-01-01T12:00:00.000'))

    console.log(bornDate)

    const [modalVisible, setModalVisible] = useState(false);


    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const addProfileDetails = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            userDescription: description,
            bornDate: Timestamp.fromDate(bornDate),
            storageProfileImageURL: storageImageURL,

        });

        navigation.navigate('HomeScreen');


    }

    // const addProfilePicture = async () => {

    // }

    console.log(auth.currentUser.uid)
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);

            const storageRef = ref(storage, `UserAvatars/${auth.currentUser.uid}/pp.jpg`)
            const blobFile = await uriToBlob(result.assets[0].uri)
            await uploadBytes(storageRef, blobFile).then(async (snapshot) => {

                const url = await getDownloadURL(storageRef)
                setStorageImageURL(url)
                console.log(storageImageURL)


            })
            console.log(image)
            console.log(result.assets[0].uri)

        }
    };

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>

            <StaticTopBar text={"Create Profile"} />

            <ScrollView>
                <View style={styles.container}>

                    {storageImageURL && <Image source={{ uri: storageImageURL }} style={styles.image} />}

                </View>

                <View>
                    <Button style={{ width: 500 }} title="Pick image" onPress={pickImage} />
                </View>


                <View
                    style={{
                        backgroundColor: 'fff',
                        borderBottomColor: '#000000',
                        borderBottomWidth: 1,
                    }}>
                    <TextInput
                        editable
                        multiline
                        placeholder='Kendini açıkla :)'
                        maxLength={400}
                        onChangeText={text => onChangeDescription(text)}
                        value={description}
                        style={{ padding: 10 }}
                    />
                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', backgroundColor: 'green' }}>

                    <Pressable
                        style={{}}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text>Born Date : {bornDate.getDate()} / {bornDate.getMonth() + 1} / {bornDate.getFullYear()} </Text>
                    </Pressable>
                </View>

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <View style={{
                                    width: 280,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: 0,
                                }}>
                                    <Text style={styles.datePickerTexts}>Day</Text>
                                    <Text style={styles.datePickerTexts}>Month</Text>
                                    <Text style={styles.datePickerTexts}>Year</Text>

                                </View>
                                <DatePicker
                                    width={300}
                                    value={bornDate}
                                    onChange={(value) => setBornDate(value)}
                                    format="dd-mm-yyyy"
                                    startYear={1950}
                                />


                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Accept</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>


                </View>


            </ScrollView>

            <Button title='Devam' onPress={addProfileDetails} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width, // Eğer dörtgen bir avatar isteniyorsa bu kısmı özelleştirebilirsiniz.
        overflow: 'hidden',
        backgroundColor: '#00000095',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: 400,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: 'gray',
    },
    buttonClose: {
        backgroundColor: 'gray',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    datePickerTexts: {
        textAlign: 'center',
        width: 80,
        fontWeight: 'bold',
        fontSize: 20

    }
});