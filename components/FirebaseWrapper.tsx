import { getAuth, connectAuthEmulator } from "firebase/auth"; // Firebase v9+
import { getDatabase, connectDatabaseEmulator } from "firebase/database"; // Firebase v9+

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

const FirebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const FirebaseAppProviderWrapper = ({ children }) => {
  return <FirebaseAppProvider firebaseConfig={firebaseConfig}>{children}</FirebaseAppProvider>;
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
