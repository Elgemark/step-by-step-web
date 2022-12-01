import { setUser } from "../utils/firebase/api";

export const config = (firebase) => {
  return {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",

    signInOptions: [
      { provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, requireDisplayName: false, shouldDisplayName: false },
    ],
    callbacks: {
      signInSuccess: (currentUser, credential, redirectUrl) => {
        setUser(currentUser).then((res) => {
          if (res.wasCreated) {
            window.location.assign(`/profile`);
          } else {
            window.location.assign(`/`);
          }
        });

        return false;
      },
    },
  };
};
