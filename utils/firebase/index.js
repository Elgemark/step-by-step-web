import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { config as firebaseConfig } from "../../config/firebaseAuthUI";

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export const auth = firebase.auth();
export { firebase.app };
