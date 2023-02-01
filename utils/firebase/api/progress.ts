import { getFirestore, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Progress, ProgressResponse } from "../interface";
import { useUser } from "./user";

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
  const [data, setData] = useState({ completed: false, step: -1, completions: 0 });
  const { data: user } = useUser(null, true);

  useEffect(() => {
    if (user?.uid) {
      const firebase = getFirestore();
      const progressDoc = doc(firebase, "users", user.uid, "progress", postId);
      const unsubscribe = onSnapshot(progressDoc, (doc) => {
        if (doc.exists()) {
          setData(doc.data() as Progress);
        } else if (createIfMissing) {
          setProgress(user.uid, postId, { completed: false, id: postId, step: -1, userId: user.uid, completions: 0 });
        }
      });
      setIsLoading(false);
      return () => {
        unsubscribe();
      };
    }
  }, [user?.uid]);

  return { user, progress: data, isLoading, setProgress, updateProgress };
};
