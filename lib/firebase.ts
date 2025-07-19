// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdB_FoFFpvUs12uqiqdPti-fN5muQ41xQ",
  authDomain: "adaptive-quiz-engine-c891f.firebaseapp.com",
  projectId: "adaptive-quiz-engine-c891f",
  storageBucket: "adaptive-quiz-engine-c891f.firebasestorage.app",
  messagingSenderId: "427711261623",
  appId: "1:427711261623:web:de1c4dc6e5eeabf3459632",
  measurementId: "G-MX6Z4H0V4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);