// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdB_FoFFpvUs12uqiqdPti-fN5muQ41xQ",
  authDomain: "adaptive-quiz-engine-c891f.firebaseapp.com",
  projectId: "adaptive-quiz-engine-c891f",
  storageBucket: "adaptive-quiz-engine-c891f.appspot.com", // note .app**spot**.com!
  messagingSenderId: "427711261623",
  appId: "1:427711261623:web:de1c4dc6e5eeabf3459632",
  measurementId: "G-MX6Z4H0V4J"
};

// Only initialize ONCE!
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
