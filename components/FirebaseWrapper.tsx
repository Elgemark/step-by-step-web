import React from "react";

import { getFirestore } from "firebase/firestore";
import { FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyCu6npVk3xMGmViQ3AWSD_RHLLkEoDkyKk",
  authDomain: "step-by-step-37f76.firebaseapp.com",
  projectId: "step-by-step-37f76",
  storageBucket: "step-by-step-37f76.appspot.com",
  messagingSenderId: "287035538812",
  appId: "1:287035538812:web:d7fd06045136234ee538f9",
  measurementId: "G-HVTSGKF4F6",
};

export function FirebaseWrapper({ children }) {
  const firestoreInstance = getFirestore(useFirebaseApp());
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirestoreProvider sdk={firestoreInstance}>{children}</FirestoreProvider>
    </FirebaseAppProvider>
  );
}
