import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { userActive } from "./screens/login";

const firebaseConfig = {
  apiKey: "AIzaSyDyPEJx27qG7mt9-RjnV6q-5x_aWraJHN8",
  authDomain: "takimcepte.firebaseapp.com",
  projectId: "takimcepte",
  storageBucket: "takimcepte.appspot.com",
  messagingSenderId: "936682876365",
  appId: "1:936682876365:web:af7b170301c99086fda884",
  measurementId: "G-KX2ZN4792K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const register = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  return user
}

export const loginApp = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password)

  return user

}

export const logOutApp = async () => {
  await signOut(auth)
  console.log("çıkış yapıldı")

}





//const analytics = getAnalytics(app);

