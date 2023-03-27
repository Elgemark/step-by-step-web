import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useId, useState } from "react";
import { useStateObject } from "../../object";
import * as dataModels from "../models";
import { useUser as rfUseUser } from "reactfire";

interface User {
  alias?: string;
  avatar?: string;
  background?: string;
  biography?: string;
  categories: Array<string>;
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
  const response: UserResponse = { data, error: null };
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    response.error = error;
  }
  // create user if error
  /*
  if (response.error) {
    try {
      const currentUser = getCurrentUser();
      await setUser({ ...currentUser, ...data });
    } catch (error) {
      response.error = error;
    }
  }
  */

  return response;
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

export const getFollowsCount = async (uid) => {
  const response = { count: 0, error: null };
  const firebase = getFirestore();
  const collRef = collection(firebase, "users", uid, "follows");

  try {
    const snapshot = await getCountFromServer(collRef);
    response.count = snapshot.data().count;
  } catch (error) {
    response.error = error;
  }

  return response;
};

export const getFollowersCount = async (uid) => {
  const response = { count: 0, error: null };
  const firebase = getFirestore();
  const collRef = collection(firebase, "users", uid, "followers");

  try {
    const snapshot = await getCountFromServer(collRef);
    response.count = snapshot.data().count;
  } catch (error) {
    response.error = error;
  }

  return response;
};

export const useUserStats = (uid = null) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followsCount, setFollowsCount] = useState(0);

  useEffect(() => {
    if (uid) {
      getFollowersCount(uid).then((res) => {
        setFollowersCount(res.count);
      });
      getFollowsCount(uid).then((res) => {
        setFollowsCount(res.count);
      });
    }
  }, [uid]);

  return { followersCount, followsCount };
};

export const useUser = (uid = null, realtime = false) => {
  const { object: data, setValue: update, replace, update: updateObject } = useStateObject({ uid, roles: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { status: statusCurrentUser, data: currentUser } = rfUseUser();

  useEffect(() => {
    if ((statusCurrentUser !== "loading" && currentUser !== null) || uid) {
      getUser(uid || currentUser.uid)
        .then((res) => {
          replace({ ...currentUser, ...data, ...res.data });
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [statusCurrentUser, currentUser, uid]);

  // Add realtime listener
  useEffect(() => {
    if (data.uid && realtime) {
      const firebase = getFirestore();
      const docRef = doc(firebase, "users", data.uid);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          replace({ ...currentUser, ...data, ...snapshot.data() });
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [data.uid, realtime]);

  const save = async (update = {}) => {
    updateObject(update);
    return await updateUser(data.uid, update);
  };

  return { data, isLoading, isCurrentUser: currentUser?.uid === data?.uid, error, update, save };
};
