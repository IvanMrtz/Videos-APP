import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvgstfBMJaiuSnBBD7-1zVM5l8nzBMEkY",
  authDomain: "react-app-413c0.firebaseapp.com",
  projectId: "react-app-413c0",
  storageBucket: "react-app-413c0.appspot.com",
  messagingSenderId: "619403784352",
  appId: "1:619403784352:web:a87f6e535ec55a819b59c5",
  measurementId: "G-V05HGCGLQ6",
};

// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const firestore = fb.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { firestore, auth, storage };
