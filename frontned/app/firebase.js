// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFirestore, collection, getDocs
  } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRpFj0f-nKVrIymFrj9qC4doIBej0e4E0",
  authDomain: "sui-zklogin-427407.firebaseapp.com",
  projectId: "sui-zklogin-427407",
  storageBucket: "sui-zklogin-427407.appspot.com",
  messagingSenderId: "712569695626",
  appId: "1:712569695626:web:1e5bc37f057430a8f4ac73",
  measurementId: "G-66VTRG4N2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init services
const db = getFirestore()
export { db };
