import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD38TqyJCFHpJkKPLnNvmKGfJDqGkATDjQ",
    authDomain: "chamados-3cb48.firebaseapp.com",
    projectId: "chamados-3cb48",
    storageBucket: "chamados-3cb48.appspot.com",
    messagingSenderId: "398552265363",
    appId: "1:398552265363:web:556dad2084b8554f7ed366",
    measurementId: "G-XS0WPTV2BR"
  };

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export{auth,db,storage};