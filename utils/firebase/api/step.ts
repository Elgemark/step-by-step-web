import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  orderBy,
  query,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Step, StepsResponse, StepResponse } from "../interface";
import { Steps } from "../type";

export const setStep = async (postId: string, id: string, step: Step) => {
  const response: StepResponse = { data: step, error: null };
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, "posts", postId, "steps", id), { ...step, uid });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const setSteps = async (postId: string, steps: Steps) => {
  const response: StepsResponse = { data: steps, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  steps.forEach((step) => {
    const stepsRef = doc(firebase, "posts", postId, "steps", step.id);
    const stepsData = { ...step, userId, uid: userId };
    batch.set(stepsRef, stepsData);
  });

  try {
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const updateStep = async (postId, id, updates: object) => {
  const response: StepResponse = { data: null, error: null };
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const firebase = getFirestore();
  try {
    await updateDoc(doc(firebase, "posts", postId, "steps", id), { ...updates, uid });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const deleteStep = async (postId, stepId) => {
  const response: StepResponse = { data: null, error: null };
  const firebase = getFirestore();
  const docRef = doc(firebase, "posts", postId, "steps", stepId);
  try {
    await deleteDoc(docRef);
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
    const stepsQuery = query(collRef, orderBy("index", "asc"));
    const docsSnap = await getDocs(stepsQuery);
    docsSnap.forEach((doc) => {
      response.data.push({ ...doc.data(), id: doc.id } as Step);
    });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useSteps = (postId: string): Steps => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const firebase = getFirestore();
    const stepsQuery = query(collection(firebase, "posts", postId, "steps"), orderBy("index", "asc"));
    const unsubscribe = onSnapshot(stepsQuery, (querySnapshot) => {
      const steps: Steps = [];
      querySnapshot.forEach((doc) => {
        steps.push(doc.data() as Step);
      });
      setData(steps);
      return () => {
        unsubscribe();
      };
    });
  }, [postId]);

  return data;
};
