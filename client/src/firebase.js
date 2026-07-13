// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "",
  authDomain: "templayreact.firebaseapp.com",
  projectId: "templayreact",
  storageBucket: "templayreact.firebasestorage.app",
  messagingSenderId: "67829947671",
  appId: "1:67829947671:web:a67a3418530d6f0716ab52",
  measurementId: "G-VWDPK8RPQM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
