import { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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

export default function LogIn({ navigation }) {
  // const theme = useTheme();
  // theme.colors.secondaryContainer = "blue";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState("eye");

  const togglePasswordVisibility = () => {
    if (!showPassword) setPasswordIcon("eye-off");
    else setPasswordIcon("eye");

    setShowPassword(!showPassword);
  };

  const handleLogIn = async () => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    // console.log(JSON.stringify(user, null, 2))
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("auth state");
      if (user) {
        // setUserID(user.uid)
        console.log("user var");

        navigation.navigate("HomeScreen");

        console.log("giriş yapılmış");
      } else {
        console.log("user yok");
        // navigation.navigate('LogIn')
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            label={<Text style={{ color: "#eeeeee" }}>Email</Text>}
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
            label={<Text style={{ color: "#eeeeee" }}>Password</Text>}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
            right={
              <TextInput.Icon
                id="password-icon"
                icon={passwordIcon}
                color="white"
                onPress={togglePasswordVisibility}
              />
            }
          />

          <Button
            style={{ marginTop: 20, backgroundColor: "#0000ff44",borderRadius:5 }}
            mode="contained-tonal"
            
            onPress={() => {
              handleLogIn(email, password);
            }}
          >
            <Text style={{color:'white'}}>Giriş Yap</Text>
          </Button>

          <Button
            rippleColor="#0000ff44"
            style={{ marginTop: 10, alignItems: "flex-end" }}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={{ color: "#eeeeee" }}>Kayıt Ol</Text>
          </Button>
        </View>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282A3A",
    paddingHorizontal: 20,
  },

  view: {
    marginTop: '70%',
  },

  input: {
    backgroundColor: "transparent",
    marginVertical:10,
  },
});
