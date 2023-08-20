import { useState ,useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TextInput, Avatar, Button } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// import { NativeBaseProvider, Box } from "native-base";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState("eye");

  const togglePasswordVisibility = () => {
    if (!showPassword) setPasswordIcon("eye-off");
    else setPasswordIcon("eye");
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    if (password != rePassword) {
      console.log("şifre eşleşmedi kontrol et"); //toast message ekle
      setPasswordMatch(false);
    } else {
      console.log("şifre eşleşti"); //toast message ekle

      setPasswordMatch(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        password: password,
        displayName: displayName,
        userId: user.uid,
        profileDetailsCreated: false
        // createdDate: Timestamp.fromDate(new Date()),
      });
      console.log(JSON.stringify(user.createdAt, null, 2))

        onAuthStateChanged(auth, (user) => {
          console.log("auth state");
          if (user) {
            // setUserID(user.uid)
            console.log("user var");
  
            navigation.navigate("CreateProfile");
  
            console.log("giriş yapılmış");
          } else {
            console.log("user kayıt sorunu");
          }
        });
      
    }
    return;
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            textColor="#eeeeee"
            activeUnderlineColor="white"
            underlineColor="white"
            label={<Text style={{ color: "#eeeeee" }}>Display Name</Text>}
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
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
          />

          <TextInput
            style={styles.input}
            textColor="#eeeeee"
            activeUnderlineColor="white"
            underlineColor="white"
            label={
              <Text style={{ color: "#eeeeee" }}>Repeat the password</Text>
            }
            value={rePassword}
            onChangeText={(text) => setRepeatPassword(text)}
            secureTextEntry={!showPassword}
            error={!passwordMatch}
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
            style={{
              marginTop: 20,
              backgroundColor: "#0000ff44",
              borderRadius: 5,
            }}
            mode="contained-tonal"
            onPress={() => {
              handleSignUp();
            }}
          >
            <Text style={{ color: "white" }}>Kayıt Ol</Text>
          </Button>

          <Button
            rippleColor="#0000ff44"
            style={{
              marginTop: 10,
              alignItems: "flex-end",
            }}
            onPress={() => navigation.navigate("LogIn")}
          >
            <Text style={{ color: "white" }}>Giriş Yap</Text>
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
    marginTop: '50%',
  },

  input: {
    backgroundColor: "transparent",
    marginVertical:10,
  },
});
