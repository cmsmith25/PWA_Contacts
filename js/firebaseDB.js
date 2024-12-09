
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";





// My App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZpd3XKCYnJHkNLLAIoUv7YRO5z3rfj64",
  authDomain: "contactkeeper-e0d3e.firebaseapp.com",
  projectId: "contactkeeper-e0d3e",
  storageBucket: "contactkeeper-e0d3e.firebasestorage.app",
  messagingSenderId: "751073691110",
  appId: "1:751073691110:web:1acb78ad2ea704dd1e0227"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);