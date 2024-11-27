// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"; 

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAb7nq1zTXLEUfsmIJDBB2cWRbVYzK_T14",
  authDomain: "backend-52b9c.firebaseapp.com",
  projectId: "backend-52b9c",
  storageBucket: "backend-52b9c.appspot.com",
  messagingSenderId: "910835296373",
  appId: "1:910835296373:web:d7c3ddaeff82c19ef6703c",
  measurementId: "G-F1H7KRKKLF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { auth };
