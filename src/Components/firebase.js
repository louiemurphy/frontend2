// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"; // Import persistence functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb7nq1zTXLEUfsmIJDBB2cWRbVYzK_T14",
  authDomain: "backend-52b9c.firebaseapp.com",
  projectId: "backend-52b9c",
  storageBucket: "backend-52b9c.appspot.com",
  messagingSenderId: "910835296373",
  appId: "1:910835296373:web:d7c3ddaeff82c19ef6703c",
  measurementId: "G-F1H7KRKKLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Initialize the auth instance

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence set successfully
    console.log("Firebase Auth persistence set to local.");
  })
  .catch((error) => {
    // Handle Errors here.
    console.error("Error setting persistence:", error);
  });

export { auth };
