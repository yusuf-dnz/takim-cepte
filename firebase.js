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
import { getFirestore, doc, setDoc,getDocs,collection } from "firebase/firestore";
import { useState } from "react";



const firebaseConfig = {
  apiKey: "AIzaSyDyPEJx27qG7mt9-RjnV6q-5x_aWraJHN8",
  authDomain: "takimcepte.firebaseapp.com",
  projectId: "takimcepte",
  storageBucket: "takimcepte.appspot.com",
  messagingSenderId: "936682876365",
  appId: "1:936682876365:web:af7b170301c99086fda884",
  measurementId: "G-KX2ZN4792K"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const db = getFirestore(app);


export const register = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, "users", user.uid), {
    email: email,
    password: password,
  });
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


export const eventLister = async () => {
  var events=[];
  const querySnapshot = await getDocs(collection(db, "events"));
  querySnapshot.forEach((doc) => {
    events.push(
  doc.id

);


  });
  // console.log(events)
return events
  
}




//const analytics = getAnalytics(app);

