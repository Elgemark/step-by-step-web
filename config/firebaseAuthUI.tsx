import { setUser } from "../utils/firebase/api";

export const config = (firebase) => {
  return {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    signInOptions: [
      { provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, requireDisplayName: false },
      // {
      //   provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //   scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
      //   customParameters: {
      //     // Forces account selection even when one account
      //     // is available.
      //     prompt: "select_account",
      //   },
      // },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        const { user } = authResult;
        setUser(user).then((res) => {
          if (res.wasCreated) {
            window.location.assign(`/profile/${res.uid}`);
          } else {
            window.location.assign(`/`);
          }
        });

        return false;
      },
    },
  };
};
