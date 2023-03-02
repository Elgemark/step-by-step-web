import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase } from "firebase/database"; // Firebase v9+
import { getFunctions } from "firebase/functions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp, useSigninCheck } from "reactfire";
import Loader from "../Loader";

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
  let app;
  try {
    app = getApp();
  } catch (error) {
    console.log("No app found...");
  }

  return (
    <FirebaseAppProvider firebaseApp={app} firebaseConfig={app ? undefined : firebaseConfig}>
      {children}
    </FirebaseAppProvider>
  );
};

const AuthAndDatabaseProviderWrapper = ({ children }) => {
  const app = useFirebaseApp(); // a parent component contains a `FirebaseAppProvider`
  // initialize Database and Auth with the normal Firebase SDK functions
  const database = getDatabase(app);
  const auth = getAuth(app);
  const functions = getFunctions(app, "us-central1");

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </AuthProvider>
  );
};

const Root = styled.div`
  height: ;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginCheck = ({ children, enable = true }) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const router = useRouter();

  useEffect(() => {
    if (enable && status !== "loading" && !signInCheckResult.signedIn) {
      router.replace("/login");
    }
  }, [status, enable, signInCheckResult]);

  return status === "loading" && enable ? (
    <Root>
      <Loader message="Checking login status..." />
    </Root>
  ) : (
    children
  );
};

export default function FirebaseWrapper({ children }) {
  return (
    <FirebaseAppProviderWrapper>
      <AuthAndDatabaseProviderWrapper>
        <LoginCheck>{children}</LoginCheck>
      </AuthAndDatabaseProviderWrapper>
    </FirebaseAppProviderWrapper>
  );
}
