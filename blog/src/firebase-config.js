// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtPgrH_D65vl3qkr4GjhvKYWYyozHBSTg",
  authDomain: "blog-app-d836f.firebaseapp.com",
  projectId: "blog-app-d836f",
  storageBucket: "blog-app-d836f.appspot.com",
  messagingSenderId: "645929654429",
  appId: "1:645929654429:web:21b53821a716043edf1c74",
  measurementId: "G-D4TFMN208T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db= getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();