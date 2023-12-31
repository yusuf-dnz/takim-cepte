import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  TextInput,
  Avatar,
  Button,
  IconButton,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { auth, authState } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { ThemeContext } from "../Theme";
import { useContext } from "react";
import Toast from "react-native-toast-message";

export default function LogIn({ navigation, route }) {
  const Theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState("eye");

  const showToast = (text1, text2) => {
    Toast.show({
      position: "bottom",
      type: "error",
      text1: text1,
      text2: text2,
      visibilityTime: 3000,
    });
  };

  const togglePasswordVisibility = () => {
    if (!showPassword) setPasswordIcon("eye-off");
    else setPasswordIcon("eye");
    setShowPassword(!showPassword);
  };

  const handleLogIn = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      switch (errorCode) {
        case "auth/wrong-password":
          showToast("Giriş hatası", "Email ve şifre kontrol edin");
          break;

        case "auth/user-not-found":
          showToast(
            "Kullanıcı bulunamadı!",
            "Yeni hesap oluşturmayı deneyebilirsin."
          );
          break;

        case "auth/invalid-email":
          showToast(
            "Email Hatası!",
            "Email adresiniz geçerli formatda olmalı."
          );
          break;
        case "auth/too-many-requests":
          showToast(
            "Çok fazla yanlış deneme yapıldı!",
            "5 dakika sonra tekrar deneyin."
          );
        break;
        default:
          console.error(errorMessage);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.backgroundColor,
      paddingHorizontal: 20,
    },

    view: {
      marginTop: "70%",
    },

    input: {
      backgroundColor: "transparent",
      marginVertical: 10,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            label={<Text style={{ color: Theme.color }}>Email</Text>}
            value={email}
            textColor="#eeeeee"
            underlineColor="white"
            activeUnderlineColor="white"
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            textColor="#eeeeee"
            activeUnderlineColor="white"
            underlineColor="white"
            label={<Text style={{ color: Theme.color }}>Password</Text>}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
            right={
              <TextInput.Icon
                id="password-icon"
                icon={passwordIcon}
                color={Theme.color}
                onPress={togglePasswordVisibility}
              />
            }
          />

          <Button
            style={{
              marginTop: 20,
              backgroundColor: Theme.buttonPrimary,
              borderRadius: 5,
            }}
            mode="contained-tonal"
            onPress={() => {
              handleLogIn(email, password);
            }}
          >
            <Text style={{ color: Theme.color }}>Giriş Yap</Text>
          </Button>

          <Button
            rippleColor={Theme.component}
            style={{ marginTop: 10, alignItems: "flex-end" }}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={{ color: Theme.color }}>Kayıt Ol</Text>
          </Button>
        </View>
      </SafeAreaProvider>
    </View>
  );
}
