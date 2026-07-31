// src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzPpRvtBHw0KWkIVyrLyRXF0ZshzKHHck",
  authDomain: "mellowcafe-de5dd.firebaseapp.com",
  projectId: "mellowcafe-de5dd",
  storageBucket: "mellowcafe-de5dd.firebasestorage.app",
  messagingSenderId: "553509918496",
  appId: "1:553509918496:web:d9a8a2197bbbff3a4ca945"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google Provider
export const provider = new GoogleAuthProvider();

/* ----------------------------------------------------
   FIXED: RECAPTCHA INITIALIZER
---------------------------------------------------- */
export const initRecaptcha = (containerId) => {
  try {
    // Make sure the container exists
    const element = document.getElementById(containerId);
    if (!element) {
      console.error(`⛔ Recaptcha container #${containerId} NOT found`);
      return null;
    }

    // Prevent recreating multiple instances
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        containerId,
        { size: "normal" },
        auth   // important: auth must be passed here
      );

      window.recaptchaVerifier.render();
    }

    return window.recaptchaVerifier;

  } catch (err) {
    console.error("Recaptcha init error:", err);
    return null;
  }
};

export { signInWithPhoneNumber };
