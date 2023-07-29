import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";
import { useState } from "react";
import { getStorage } from "firebase/storage";



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
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
