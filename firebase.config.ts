// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCemzVs6ZFsh6URkhknSQJVKV9trICBsc0",
  authDomain: "hotel-app-9478f.firebaseapp.com",
  projectId: "hotel-app-9478f",
  storageBucket: "hotel-app-9478f.firebasestorage.app",
  messagingSenderId: "871034194331",
  appId: "1:871034194331:web:34f9d5bb8bbc7ba891793e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
