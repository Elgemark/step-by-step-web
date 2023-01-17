import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useStateObject } from "../../object";
import * as dataModels from "../models";
import { useAuthState } from "react-firebase-hooks/auth";

interface User {
  alias?: string;
  avatar?: string;
  background?: string;
  biography?: string;
  interests: Array<string>;
  roles: Array<string>;
  theme: Array<string>;
  uid: string;
}

interface UserResponse {
  error: any;
  data: User | null;
}

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
  const response: UserResponse = { data: null, error: null };
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);

  try {
    const doc = await getDoc(userRef);
    response.data = doc.exists() ? (doc.data() as User) : null;
  } catch (error) {
    response.error = error;
  }

  return response;
};

export const useCurrentUser = (realtime = false) => {
  const [user] = useAuthState(getAuth());
  const { object: data, update: updateData } = useStateObject();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUser(user.uid)
        .then((res) => {
          updateData({ ...res.data, uid: user.uid });
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [user]);

  // Add realtime listener
  useEffect(() => {
    if (user && realtime) {
      const { uid } = user;
      const firebase = getFirestore();
      const docRef = doc(firebase, "users", uid);
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          updateData(snapshot.data());
        }
      });
    }
  }, [user, realtime]);

  const save = async (update = {}) => {
    updateData(update);
    return await updateUser(data.uid, { ...data, ...update });
  };

  return {
    data,
    isLoading,
    save,
    update: updateData,
  };
};

export const useUser = (uid, realtime = false) => {
  const { object: data, setValue: update, replace, update: updateObject } = useStateObject();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  //
  const auth = getAuth();
  const { uid: currentUserId } = auth.currentUser || {};

  const getUserFunc = uid ? getUser : getCurrentUser;

  useEffect(() => {
    setIsLoading(true);
    getUserFunc(uid)
      .then((res) => {
        replace(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  // Add realtime listener
  useEffect(() => {
    if (uid && realtime) {
      const firebase = getFirestore();
      const docRef = doc(firebase, "users", uid);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          replace({ ...data, ...snapshot.data() });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [uid, realtime]);

  const save = async (update = {}) => {
    updateObject(update);
    return await updateUser(data.uid, { ...data, ...update });
  };

  return { data, isLoading, isCurrentUser: currentUserId === data?.uid, error, update, save };
};
