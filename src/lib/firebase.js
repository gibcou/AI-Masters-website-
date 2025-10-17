// Centralized Firebase initialization for client-side usage in Next.js
// IMPORTANT: Do not commit secrets beyond what Firebase config requires.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyzE73pxCbywcvIAyv-ofwZikq2qW1B5Q",
  authDomain: "ai-masters-23235.firebaseapp.com",
  projectId: "ai-masters-23235",
  storageBucket: "ai-masters-23235.firebasestorage.app",
  messagingSenderId: "348259957283",
  appId: "1:348259957283:web:f625ca27b4a61ad53d4f96",
  measurementId: "G-58ENJ9WY2V",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

let analytics = null;
// Analytics only works in the browser and on supported environments
if (typeof window !== "undefined") {
  analyticsIsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // ignore analytics errors
    });
}

export { app, analytics, auth, db };