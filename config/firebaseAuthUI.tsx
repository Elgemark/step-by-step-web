export const config = (firebase) => {
  return {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    requireDisplayName: false,
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  };
};
