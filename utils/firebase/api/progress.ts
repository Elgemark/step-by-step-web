import { getFirestore, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSigninCheck } from "reactfire";
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
    await setDoc(doc(firebase, "users", userId, "progress", postId), progress);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const updateProgress = async (userId: string, postId: string, updates: object) => {
  const response: ProgressResponse = { id: postId, data: null, error: null };
  const firebase = getFirestore();
  try {
    await updateDoc(doc(firebase, "users", userId, "progress", postId), updates);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useProgress = (postId: string, createIfMissing = false) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: signInCheckResult } = useSigninCheck();
  const [data, setData] = useState({ completed: false, stepsCompleted: [], completions: 0 });
  const { data: user } = useUser(null, true);

  useEffect(() => {
    if (user?.uid) {
      const firebase = getFirestore();
      const progressDoc = doc(firebase, "users", user.uid, "progress", postId);
      const unsubscribe = onSnapshot(progressDoc, (doc) => {
        if (doc.exists()) {
          setData({ ...data, ...doc.data() } as Progress);
        } else if (createIfMissing) {
          setProgress(user.uid, postId, {
            completed: false,
            id: postId,
            userId: user.uid,
            completions: 0,
            stepsCompleted: [],
          });
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
      setIsLoading(false);
    }
  };

  return { user, progress: data, isLoading, setProgress, updateProgress: _updateProgress };
};
