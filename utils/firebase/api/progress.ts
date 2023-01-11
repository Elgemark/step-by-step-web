import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Progress } from "../interface";

export const useProgress = (postId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({ completed: false, step: 0 });
  const [user] = useAuthState(getAuth());

  useEffect(() => {
    if (user?.uid) {
      const firebase = getFirestore();
      const progressDoc = doc(firebase, "users", user.uid, "progress", postId);
      const unsubscribe = onSnapshot(progressDoc, (doc) => {
        if (doc.exists()) {
          setData(doc.data() as Progress);
        }
      });
      setIsLoading(false);
      return () => {
        unsubscribe();
      };
    }
  }, [user?.uid]);

  return { user, progress: data, isLoading };
};
