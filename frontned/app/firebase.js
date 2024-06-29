// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ2Ruw-wGkLjW-ET-Dczy6x6rWCVNAt1A",
  authDomain: "suilogin-427911.firebaseapp.com",
  projectId: "suilogin-427911",
  storageBucket: "suilogin-427911.appspot.com",
  messagingSenderId: "507161399660",
  appId: "1:507161399660:web:00a34c5cf6d3cd01cae349",
  measurementId: "G-R28B22XMFV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init services
const db = getFirestore();
export { db };
