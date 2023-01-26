import { useEffect, useCallback } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
// Firebase related
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { config as uiConfig } from "../../config/firebaseAuthUI";
// CSS
import "firebaseui/dist/firebaseui.css";
import { useUser } from "reactfire";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";

const StyledContainer = styled.div`
  height: calc(100vh - 50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogInPage = () => {
  const { status } = useUser();

  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import("firebaseui");
    const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth());
    firebaseUi.start(".firebaseui-auth-container", uiConfig(firebase));
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      loadFirebaseui();
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>STEPS | LogIn</title>
      </Head>
      <Layout>
        <StyledContainer>
          {status === "loading" ? <CircularProgress /> : null}
          <div className="firebaseui-auth-container" />
        </StyledContainer>
      </Layout>
    </>
  );
};

export default () => (
  <MUIWrapper>
    <FirebaseWrapper>
      <LogInPage></LogInPage>
    </FirebaseWrapper>
  </MUIWrapper>
);
