import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

export default function ImagePick() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChooseImage = () => {
      ImagePick.showImagePicker({ title: 'Görsel Seç', maxWidth: 800, maxHeight: 600 }, (response) => {
        if (response.didCancel) {
          console.log('Kullanıcı görsel seçmeyi iptal etti');
        } else if (response.error) {
          console.log('Görsel seçerken hata oluştu:', response.error);
        } else {
          const source = { uri: response.uri };
          setSelectedImage(source);
        }
      });
    };
  
    return (
      <View style={styles.container}>
        {selectedImage && <Image source={selectedImage} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
          <Text style={styles.buttonText}>Görsel Seç</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    button: {
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });