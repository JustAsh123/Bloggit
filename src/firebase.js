// src/firebase.js
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiFoE-lyTrfqYeP4ywFVEGyztY_Xa1jes",
  authDomain: "bloggit-475e2.firebaseapp.com",
  projectId: "bloggit-475e2",
  storageBucket: "bloggit-475e2.firebasestorage.app",
  messagingSenderId: "263173447674",
  appId: "1:263173447674:web:eb719af00842a6c00ece43",
  measurementId: "G-Y85GF6TB91"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);