import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase } from "firebase/database"; // Firebase v9+

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp } from "reactfire";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const FirebaseAppProviderWrapper = ({ children }) => {
  // Check if app already initialized...
  const app = getApp();
  return (
    <FirebaseAppProvider firebaseApp={app || undefined} firebaseConfig={app ? undefined : firebaseConfig}>
      {children}
    </FirebaseAppProvider>
  );
};

const AuthAndDatabaseProviderWrapper = ({ children }) => {
  const app = useFirebaseApp(); // a parent component contains a `FirebaseAppProvider`
  // initialize Database and Auth with the normal Firebase SDK functions
  const database = getDatabase(app);
  const auth = getAuth(app);

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </AuthProvider>
  );
};

export default function FirebaseWrapper({ children }) {
  return (
    <FirebaseAppProviderWrapper>
      <AuthAndDatabaseProviderWrapper>{children}</AuthAndDatabaseProviderWrapper>
    </FirebaseAppProviderWrapper>
  );
}
