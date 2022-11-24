import Head from "next/head";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { config as uiConfig } from "../../config/firebaseAuthUI";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const StyledContainer = styled.div`
  height: calc(100vh - 50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogIn = ({ res }) => {
  const [user, loading, error] = useAuthState(getAuth());

  if (loading) {
  }

  return (
    <>
      <Head>
        <title>STEPS | LogIn</title>
      </Head>
      <Layout>
        <StyledContainer>
          {loading && <CircularProgress />}
          {!loading && <StyledFirebaseAuth uiConfig={uiConfig(firebase)} firebaseAuth={getAuth()} />}
        </StyledContainer>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  return { props: { res: query } };
}

export default LogIn;
