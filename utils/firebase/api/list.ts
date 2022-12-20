import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { List, ListResponse } from "../interface";
import { Lists } from "../type";

export const setList = async (id: string, data: List) => {
  const firebase = getFirestore();
  const result = { data, id, response: null, error: null };
  try {
    result.response = await setDoc(doc(firebase, "posts", id, "lists", id), data);
    result.data = { ...data, id };
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const setLists = async (id: string, data: Lists) => {
  const firebase = getFirestore();
  const result = { data, id, response: null, error: null };
  try {
    result.response = await setDoc(doc(firebase, "posts", id, "lists", id), data);
    result.data = { ...data, id };
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getList = async (id: string) => {
  const firebase = getFirestore();
  const result: ListResponse = { data: [], id, error: null };
  try {
    const docRef = doc(firebase, "posts", id, "lists", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? (docSnap.data() as Lists) : [];
  } catch (error) {
    result.error = error;
    result.data = [];
  }
  return result;
};

export const getLists = async (id: string) => {
  const firebase = getFirestore();
  const result: ListResponse = { data: [], id, error: null };
  try {
    const collRef = collection(firebase, "posts", id, "lists");
    const docsSnap = await getDocs(collRef);
    docsSnap.forEach((doc) => {
      result.data.push({ ...doc.data(), id: doc.id });
    });
  } catch (error) {
    result.error = error;
    result.data = [];
  }
  return result;
};
