import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useStateObject } from "../../object";
import * as dataModels from "../models";

export const setUser = async (currentUser) => {
  const { uid } = currentUser;
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  const userProfile = await getDoc(userRef);

  if (userProfile.exists()) {
    return { ...userProfile.data(), uid, wasCreated: false };
  } else {
    await setDoc(userRef, dataModels.userProfile);
    return { ...dataModels.userProfile, uid, wasCreated: true };
  }
};

export const updateUser = async (uid, data) => {
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  return await updateDoc(userRef, data);
};

export const getCurrentUser = async () => {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  return await getUser(uid);
};

export const getUser = async (uid) => {
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  const userProfile = await getDoc(userRef);
  if (userProfile.exists()) {
    return { ...userProfile.data(), uid };
  } else {
    return { error: { message: "User not found!" }, uid };
  }
};

export const useUser = (uid, realtime = false) => {
  const { object: data, setValue: update, replace } = useStateObject();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //
  const auth = getAuth();
  const { uid: currentUserId } = auth.currentUser || {};

  const getUserFunc = uid ? getUser : getCurrentUser;

  useEffect(() => {
    setIsLoading(true);
    getUserFunc(uid)
      .then((res) => {
        replace(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  // Add realtime listener
  useEffect(() => {
    const { uid } = data;
    if (uid && realtime) {
      const firebase = getFirestore();
      const docRef = doc(firebase, "users", uid);
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          replace({ ...data, ...snapshot.data() });
        }
      });
    }
  }, [data.uid, realtime]);

  const save = async () => {
    return await updateUser(data.uid, data);
  };

  return { data, isLoading, isCurrentUser: currentUserId === data?.uid, error, update, save };
};
