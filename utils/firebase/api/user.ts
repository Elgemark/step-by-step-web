import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
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
  const { object: data, setValue: update, replace, update: updateObject } = useStateObject();
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

  const save = async (update = {}) => {
    updateObject(update);
    return await updateUser(data.uid, { ...data, ...update });
  };

  return { data, isLoading, isCurrentUser: currentUserId === data?.uid, error, update, save };
};

// ::: USER DATA

export const setUserStepsProgress = async (uid, id, data) => {
  const firebase = getFirestore();
  const result = { response: null, data: null, id: null, error: null };
  try {
    const docRef = doc(firebase, "users", uid, "progress", id);
    result.response = await setDoc(docRef, { ...data, userId: uid });
    result.data = { ...data, uid };
    result.id = uid;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getUserStepsProgress = async (uid, id) => {
  const firebase = getFirestore();
  const result = { data: null, error: null };
  try {
    const docRef = doc(firebase, "users", uid, "progress", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), uid } : { ...dataModels.userStepsProgress, userId: uid, id };
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useUserStepsProgress = (uid, id) => {
  const [isLoading, setIsLoading] = useState(false);
  const { object: data, setValue, replace: setData } = useStateObject();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (uid && id) {
      setIsLoading(true);
      getUserStepsProgress(uid, id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [uid, id]);

  return {
    ...data,
    isLoading,
    error,
    setStep: async (index, completed = false) => {
      setValue("step", index);
      return await setUserStepsProgress(uid, id, {
        ...data,
        completed,
        step: index,
      });
    },
  };
};
