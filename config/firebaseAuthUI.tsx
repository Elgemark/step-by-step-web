import { setUser } from "../utils/firebase/api";

export const config = (firebase) => {
  return {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    signInOptions: [{ provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, requireDisplayName: false }],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        const { user } = authResult;
        setUser(user).then((res) => {
          if (res.wasCreated) {
            window.location.assign(`/user`);
          } else {
            window.location.assign(`/`);
          }
        });

        return false;
      },
    },
  };
};
