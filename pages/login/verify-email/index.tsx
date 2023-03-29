import { useEffect } from "react";
import firebase from "firebase/compat/app";
import Head from "next/head";
import Layout from "../../../components/Layout";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import { useUser } from "reactfire";

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const VerifyEmail = () => {
  const { data: user } = useUser();

  useEffect(() => {
    if (user) {
      const auth = getAuth();
      const email = user.email;

      var actionCodeSettings = {
        url: "https://www.steppo.app/?email=" + email,
        handleCodeInApp: true,
      };

      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", email);
          alert("Email verificatin mail sent");

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ...
        });
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>STEPS | Verify EMail</title>
      </Head>
      <Layout />
    </>
  );
};

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <VerifyEmail {...props}></VerifyEmail>
    </FirebaseWrapper>
  </MUIWrapper>
);
