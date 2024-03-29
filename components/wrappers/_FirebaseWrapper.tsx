import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase } from "firebase/database"; // Firebase v9+
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp, useSigninCheck } from "reactfire";
import Loader from "../Loader";
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
  const [isLoading, setIsLoading] = useState(true);
  // Check if app already initialized...
  let app;

  useEffect(() => {
    try {
      app = getApp();
      setIsLoading(false);
    } catch (error) {
      console.log("No app found...");
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <>Loading...</>;
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

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </AuthProvider>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginCheck = ({ children, enable = false }) => {
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
        <Script
          id="Adsense-id"
          data-ad-client="ca-pub-4233698082965305"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
        {children}
      </AuthAndDatabaseProviderWrapper>
    </FirebaseAppProviderWrapper>
  );
}
