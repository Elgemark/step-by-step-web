import { getFirestore, writeBatch, doc, getDoc, increment, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface RateResponse {
  error: string | null;
  data: object | null;
}

export const ratePost = async (postId: string, userId: string, value: number): Promise<RateResponse> => {
  const response: RateResponse = { error: null, data: null };
  const firebase = getFirestore();
  // setup batch write
  const batch = writeBatch(firebase);
  // get  old value...
  let prevValue = 0;
  const rateRef = doc(firebase, "users", userId, "rates", postId);
  const rateSnap = await getDoc(rateRef);
  if (rateSnap.exists()) {
    prevValue = rateSnap.data().value;
  }
  // Diff value
  const diffValue = value - prevValue;
  // Update user rate value
  await batch.set(rateRef, { value, uid: userId });
  // update total Rates on post...
  const incrementRatesTotal = increment(diffValue);
  const incrementRatesNum = increment(rateSnap.exists() ? 0 : 1);
  const postRef = doc(firebase, "posts", postId);
  await batch.update(postRef, { ratesTotal: incrementRatesTotal, ratesNum: incrementRatesNum, uid: userId });

  try {
    // commit batch
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useRatesForPostAndUser = (postId: string, userId: string) => {
  const [isRated, setIsRated] = useState(false);
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postId && userId) {
      const firebase = getFirestore();
      const docRef = doc(firebase, "users", userId, "rates", postId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          setValue(snapshot.data().value);
          setIsLoading(false);
          setIsRated(true);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [postId, userId]);

  return { isRated, value, isLoading };
};

export const useRatesforPost = (postId: string) => {
  const [isRated, setIsRated] = useState(false);
  // Total stars given
  const [total, setTotal] = useState(0);
  // Total number of users given starts
  const [num, setNum] = useState(0);
  // Avarage star value
  const [value, setValue] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      const firebase = getFirestore();
      const docRef = doc(firebase, "posts", postId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          setTotal(snapshot.data().ratesTotal);
          setNum(snapshot.data().ratesNum);
          setValue(snapshot.data().ratesTotal / snapshot.data().ratesNum);
          setIsLoading(false);
          setIsRated(true);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [postId]);

  return { isRated, value, num, total, isLoading };
};
