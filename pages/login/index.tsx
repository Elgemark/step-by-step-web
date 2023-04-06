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
import { useRouter } from "next/router";
import SteppoLogo from "../../components/primitives/SteppoLogo";
import { useTheme } from "@emotion/react";

const Root = styled.div`
  .login-container {
    position: absolute;
    top: 72px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
      max-width: 260px;
      margin: ${({ theme }) => theme.spacing(5)};
      @media (min-width: 600px) {
        max-width: 320px;
      }
    }
  }
  .firebaseui-auth-container {
    opacity: ${({ status }) => (status === "success" ? 1 : 0)};
    transition: 0.6s opacity;
  }
`;

const LogInPage = () => {
  const { status, data: user } = useUser();
  const router = useRouter();
  const theme = useTheme();

  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import("firebaseui");
    const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth());
    firebaseUi.start(".firebaseui-auth-container", uiConfig(firebase));
    firebaseUi.disableAutoSignIn();
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      loadFirebaseui();
    }
    if (status === "success" && user !== null) {
      router.replace("/profile/" + user.uid);
    }
  }, [status, user]);

  return (
    <Root status={status} theme={theme}>
      <Head>
        <title>STEPS | LogIn</title>
      </Head>
      <Layout />
      <div className="login-container">
        <SteppoLogo className="logo"></SteppoLogo>
        {/* Buttons not showing when in Layout */}
        <div className="firebaseui-auth-container" />
      </div>
    </Root>
  );
};

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <LogInPage {...props}></LogInPage>
    </FirebaseWrapper>
  </MUIWrapper>
);
