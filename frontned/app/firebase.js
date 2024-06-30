// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC4YAPSZk2vsvoJVAGRnmSRdzpV8-Y1zE",
  authDomain: "suilogin-6fa11.firebaseapp.com",
  projectId: "suilogin-6fa11",
  storageBucket: "suilogin-6fa11.appspot.com",
  messagingSenderId: "440188778615",
  appId: "1:440188778615:web:ab7e8df208f30221b96e72",
  measurementId: "G-73ZEVLM9RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init services
const db = getFirestore();
export { db };
