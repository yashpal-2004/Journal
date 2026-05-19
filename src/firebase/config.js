import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhJo3x5MStMKQFvsETfGL3v4rY5ksRTfY",
  authDomain: "focus-habit-tracker-19622.firebaseapp.com",
  databaseURL: "https://focus-habit-tracker-19622-default-rtdb.firebaseio.com",
  projectId: "focus-habit-tracker-19622",
  storageBucket: "focus-habit-tracker-19622.firebasestorage.app",
  messagingSenderId: "217602524082",
  appId: "1:217602524082:web:b0625c8e21e6e14449daab",
  measurementId: "G-H789CBVGNT"
};

let db;
let auth;
let googleProvider;

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Anonymous fallback will be handled in useStore.js inside onAuthStateChanged
  
  const analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db, auth, googleProvider };
