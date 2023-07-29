import { View, Text, ScrollView, ImageBackground, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { Avatar, Button } from 'react-native-paper';
import StaticTopBar from '../components/StaticTopBar';
import { StyleSheet } from 'react-native';
import { getFirestore, doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';


export default function Profile({ navigation }) {

    const handleLogOut = async e => {
        await signOut(auth)
        console.log("çıkış yapıldı")
        navigation.navigate('LogIn');
    }

    const [userProfileData, setUserProfileData] = useState({});
    useEffect(() => {

        const getUserProfile = async () => {

            const docRef = doc(db, "users", "w3Vz5AiqWiReHHum2a9YImBL3qw1");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                setUserProfileData(docSnap.data())
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }

        getUserProfile();

    }, [])

    console.log(userProfileData)

    return (
        <View>
            <ImageBackground
                style={{ height: Dimensions.get('window').height }}
                source={require('../assets/bg.jpg')}
            >
                <StaticTopBar text={"PROFİL"} /> 

                <ScrollView>
                    {/* <Avatar.Image size={Dimensions.get('window').width} style={{borderRadius:0,backgroundColor:'transparent'}} source={require('../assets/ism.png') } /> */}
                    <View style={styles.container}>
                        <Image source={require('../assets/ism.png')} style={styles.image} resizeMode="cover" />
                    </View>

                    {/* Açıklama alanı */}

                    <View style={{marginTop:10,padding:10,backgroundColor:'rgba(0, 0, 0, 0.2)',minHeight:150, }}>
                        <Text style={{color:'white'}}>{userProfileData.userDescription}</Text>
                    </View>


                    <Button
                        style={{
                            marginTop: 10,
                            alignItems: 'flex-end',
                        }}
                        onPress={() => handleLogOut()}>
                        Çıkış yap
                    </Button>

                </ScrollView>
            </ImageBackground>
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