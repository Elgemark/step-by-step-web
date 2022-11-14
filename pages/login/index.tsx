import Head from "next/head";
import { useRouter } from "next/router";

// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
//import { auth, firebase } from "../../utils/firebase";
import {config as uiConfig} from "../../config/firebaseAuthUI"

import Layout from "../../components/Layout";

const LogIn = ({ res }) => {
  const [user, loading, error] = useAuthState(getAuth());
  console.log("user", user);

  return (
    <>
      <Head>
        <title>STEPS | LogIn</title>
      </Head>
      <Layout><StyledFirebaseAuth uiConfig={uiConfig(firebase)} firebaseAuth={getAuth()} /></Layout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  return { props: { res: query } };
}

export default LogIn;
