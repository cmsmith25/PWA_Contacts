import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// Firebase configuration
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  console.log(logoutBtn);
  // Check if user is authenticated
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      console.log("User ID: ", user.uid);
      console.log("Email: ", user.email);
      logoutBtn.style.display = "block";
    } else {
      // No user signed in.
      console.log("No user is currently signed in.");
      // If user is not signed in, redirect to auth page
      window.location.href = "/pages/auth.html";
    }
  });
  // Handle logout functionality
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      M.toast({ html: "Logout successful!" });
      logoutBtn.style.display = "none";
      window.location.href = "/pages/auth.html";
    } catch (error) {
      M.toast({ html: error.message });
    }
  });
});