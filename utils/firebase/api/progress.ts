import {
  getFirestore,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSigninCheck } from "reactfire";
import { useLocalStorage } from "../../../hooks/storage";
import { useUser } from "./user";

export interface Progress {
  completed: boolean;
  completions: number;
  stepsCompleted: Array<string>;
  id: string;
  userId: string;
}

export interface ProgressResponse {
  id: string;
  data: Progress;
  error: any;
}

export const setProgress = async (userId: string, postId: string, progress: Progress) => {
  const response: ProgressResponse = { id: postId, data: progress, error: null };
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, "users", userId, "progress", postId), { ...progress, uid: userId });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const updateProgress = async (userId: string, postId: string, updates: object) => {
  const response: ProgressResponse = { id: postId, data: null, error: null };
  const firebase = getFirestore();
  try {
    await updateDoc(doc(firebase, "users", userId, "progress", postId), { ...updates, uid: userId });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getPostIdsByProgress = async (uid, completed = true) => {
  const response = { data: [], error: null };

  const firebase = getFirestore();
  // get completed posts for user
  const progressRef = collection(firebase, "users", uid, "progress");
  const progressQuery = query(progressRef, where("completed", "==", completed));

  try {
    const docsSnap = await getDocs(progressQuery);
    docsSnap.forEach((doc) => {
      response.data.push(doc.id);
    });
  } catch (error) {
    response.error = error.toString();
  }

  return response;
};

export const useProgress = (postId: string, createIfMissing = false) => {
  const { save: saveLocalData, restore: restoreLocalData } = useLocalStorage(postId, "progress", true);
  const [dataCreated, setDataCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: signInCheckResult } = useSigninCheck();
  const [data, setData] = useState({ completed: false, stepsCompleted: [], completions: 0 });
  const { data: user } = useUser(null, true);

  // limb mode
  useEffect(() => {
    if (signInCheckResult && !signInCheckResult.signedIn) {
      setData({ ...data, ...restoreLocalData() });
      setIsLoading(false);
    }
  }, [postId, signInCheckResult]);

  useEffect(() => {
    if (user?.uid) {
      const firebase = getFirestore();
      const progressDoc = doc(firebase, "users", user.uid, "progress", postId);
      const unsubscribe = onSnapshot(progressDoc, (doc) => {
        if (doc.exists()) {
          setData({ ...data, ...doc.data() } as Progress);
        } else if (createIfMissing && !dataCreated) {
          setProgress(user.uid, postId, {
            completed: false,
            id: postId,
            userId: user.uid,
            completions: 0,
            stepsCompleted: [],
          });
          // Force one try
          setDataCreated(true);
        }
      });
      setIsLoading(false);
      return () => {
        unsubscribe();
      };
    }
  }, [user?.uid]);

  const _updateProgress = (userId: string, postId: string, updates: object) => {
    if (signInCheckResult.signedIn) {
      return updateProgress(userId, postId, updates);
    } else {
      setData(updates as Progress);
      saveLocalData(updates);
      setIsLoading(false);
    }
  };

  return { user, progress: data, isLoading, setProgress, updateProgress: _updateProgress };
};
