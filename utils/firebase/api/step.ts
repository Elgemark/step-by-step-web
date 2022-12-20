import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

import * as dataModels from "../models";

import { Steps } from "../type";

export const setSteps = async (id: string, data: Steps) => {
  const firebase = getFirestore();
  const result = { data, id, response: null, error: null };
  try {
    result.response = await setDoc(doc(firebase, "posts", id, "steps", id), data);
    result.data = { ...data, id };
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getSteps = async (id: string) => {
  const firebase = getFirestore();
  const result = { data: null, id, response: null, error: null };
  try {
    const docRef = doc(firebase, "posts", id, "steps", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), id } : dataModels.steps;
  } catch (error) {
    result.error = error;
  }
  return result;
};
