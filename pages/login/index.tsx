import { useEffect, FC, useCallback } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { config as uiConfig } from "../../config/firebaseAuthUI";
// CSS
import "firebaseui/dist/firebaseui.css";

const StyledContainer = styled.div`
  height: calc(100vh - 50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  firebaseClient: typeof firebase;
  config: firebaseui.auth.Config;
}

const LogIn: FC<Props> = ({ firebaseClient, config }) => {
  const [loading] = useAuthState(getAuth());

  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import("firebaseui");
    const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth());
    firebaseUi.start(".firebaseui-auth-container", uiConfig(firebase));
  }, [firebaseClient, config]);

  useEffect(() => {
    if (!loading) {
      loadFirebaseui();
    }
  }, [loading]);

  return (
    <>
      <Head>
        <title>STEPS | LogIn</title>
      </Head>
      <Layout>
        <StyledContainer>
          {loading && <CircularProgress />}
          <div className="firebaseui-auth-container" />
        </StyledContainer>
      </Layout>
    </>
  );
};

export default LogIn;
