
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
if (!getApps().length) {
  if (Object.values(firebaseConfig).some(value => !value)) {
    console.error("Firebase config is missing or incomplete. Check your .env file.");
    app = null;
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

let appCheck: AppCheck | null = null;
if (app && typeof window !== 'undefined') {
  // This code only runs on the client
  if (process.env.NODE_ENV !== 'production') {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LfyzOArAAAAAHpJtBW4ANaLw9VaU8HFSw59AjnK"),// recaprtcha v3 - recaptcha admin site
    isTokenAutoRefreshEnabled: true
  });
}


const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export { app, appCheck, auth, db, storage };
