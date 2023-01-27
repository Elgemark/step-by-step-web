import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase v9+
import { getDatabase } from "firebase/database"; // Firebase v9+
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { FirebaseAppProvider, DatabaseProvider, AuthProvider, useFirebaseApp, useSigninCheck } from "reactfire";
import Loader from "../Loader";

const FirebaseAppProviderWrapper = ({ children }) => {
  return <FirebaseAppProvider firebaseApp={getApp()}>{children}</FirebaseAppProvider>;
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
      <AuthAndDatabaseProviderWrapper>{children}</AuthAndDatabaseProviderWrapper>
    </FirebaseAppProviderWrapper>
  );
}
