import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase } from "firebase/database"; // Firebase v9+
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getFirestore } from "firebase/firestore";

import {
  FirebaseAppProvider,
  FirestoreProvider,
  DatabaseProvider,
  AuthProvider,
  useFirebaseApp,
  useSigninCheck,
} from "reactfire";
import Script from "next/script";

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
  const [app, setApp] = useState(null);

  useEffect(() => {
    try {
      const _app = getApp();
      setApp(_app);
    } catch (error) {
      setApp(undefined);
    }
  }, []);

  if (app === null) {
    return <>Loading...</>;
  }

  return (
    <FirebaseAppProvider firebaseApp={app} firebaseConfig={app ? undefined : firebaseConfig}>
      {children}
    </FirebaseAppProvider>
  );
};

const App = ({ children }) => {
  const firestoreInstance = getFirestore(useFirebaseApp());
  return <FirestoreProvider sdk={firestoreInstance}>{children}</FirestoreProvider>;
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
