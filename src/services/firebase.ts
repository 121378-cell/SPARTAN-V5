// Implemented Firebase initialization to resolve module loading errors.
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// --- ACTION REQUIRED ---
// You must replace the placeholder values below with the configuration
// from your own Firebase project for the application to work correctly.
//
// How to get your Firebase config:
// 1. Go to your Firebase project console: https://console.firebase.google.com/
// 2. In the project overview, click the "</>" icon to add a web app or select an existing one.
// 3. Find your app's configuration details (apiKey, authDomain, etc.).
// 4. Copy those values and paste them into the firebaseConfig object below.
//
// The error "auth/api-key-not-valid" means these values have not been updated.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Check if the configuration has been updated.
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("REPLACE_WITH_");

// Initialize Firebase
// The type assertion `as any` is safe because the app's root component
// checks `isFirebaseConfigured` and will not render the rest of the app
// if the config is missing, preventing this from being used.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null as any;

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = isFirebaseConfigured ? getAuth(app) : null as any;
