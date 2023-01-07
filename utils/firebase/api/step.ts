import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { Step, StepsResponse, StepResponse } from "../interface";
import { Steps } from "../type";

export const setStep = async (postId, id, step: Step) => {
  const response: StepResponse = { data: step, error: null };
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, "posts", postId, "steps", id), step);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getSteps = async (postId: string) => {
  const response: StepsResponse = { data: [], error: null };
  const firebase = getFirestore();

  try {
    const collRef = collection(firebase, "posts", postId, "steps");
    const docsSnap = await getDocs(collRef);
    docsSnap.forEach((doc) => {
      response.data.push({ ...doc.data(), id: doc.id } as Step);
    });
  } catch (error) {
    response.error = error;
  }
  return response;
};
