import { View, Text, ScrollView, ImageBackground, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase';
import { Avatar, Divider } from 'react-native-paper';
import StaticTopBar from '../components/StaticTopBar';
import { StyleSheet, Button } from 'react-native';
import { getFirestore, doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({ navigation }) {
    const userID = auth.currentUser.uid;
  

    const handleLogOut = async e => {
        await signOut(auth)
        console.log("çıkış yapıldı")
        navigation.navigate('LogIn');
    }

    const [userProfileData, setUserProfileData] = useState({});
    useEffect(() => {

        const getUserProfile = async () => {

            const docRef = doc(db, "users", userID);
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

    // console.log(userProfileData)

    return (
        <SafeAreaView>

        <View>
            
            <StaticTopBar text={"PROFILE"} />

            <ScrollView
                style={{ marginBottom: 50 }}
            >
                {/* <Avatar.Image size={Dimensions.get('window').width} style={{borderRadius:0,backgroundColor:'transparent'}} source={require('../assets/ism.png') } /> */}
                <View style={styles.container}>
                    <Image source={{ uri: userProfileData.storageProfileImageURL }} style={styles.image} resizeMode="cover" />
                </View>

                {/* Açıklama alanı */}
                <Divider style={{ height: 5 }} />
                <View style={{ marginTop: 10, padding: 10, backgroundColor: 'transparent', minHeight: 150, }}>
                    <Text style={{ color: 'black' }}>{userProfileData.userDescription}</Text>
                </View>

                
                <Button
                    onPress={handleLogOut}
                    title="Log Out"
                    color="blue"
                    touchSoundDisabled={true}

                />

            </ScrollView>

        </View>
        </SafeAreaView>
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