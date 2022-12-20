import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { ListResponse } from "../interface";
import { Lists } from "../type";

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

export const getLists = async (id: string) => {
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
