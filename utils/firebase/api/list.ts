import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { List, ListResponse } from "../interface";
import { Lists } from "../type";

export const setList = async (postId: string, id: string, data: List) => {
  const response: ListResponse = { id, data, error: null };
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, "posts", postId, "lists", id), data);
  } catch (error) {
    response.error = error;
  }
  return response;
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

export const getList = async (postId, listId: string) => {
  const firebase = getFirestore();
  const result: ListResponse = { data: [], id: listId, error: null };
  try {
    const docRef = doc(firebase, "posts", postId, "lists", listId);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? (docSnap.data() as Lists) : [];
  } catch (error) {
    result.error = error;
    result.data = [];
  }
  return result;
};

export const deleteList = async (postId, listId: string) => {
  const firebase = getFirestore();
  const result = { success: false, listId, error: null };
  try {
    const docRef = doc(firebase, "posts", postId, "lists", listId);
    await deleteDoc(docRef);
    result.success = true;
  } catch (error) {
    result.error = error;
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

export const useLists = (postId: string): Lists => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const firebase = getFirestore();
    // const listsQuery = query(collection(firebase, "posts", postId, "lists"), orderBy("index", "asc"));
    const listCollection = collection(firebase, "posts", postId, "lists");
    const unsubscribe = onSnapshot(listCollection, (querySnapshot) => {
      const lists: Lists = [];
      querySnapshot.forEach((doc) => {
        lists.push(doc.data() as List);
      });
      setData(lists);
      return () => {
        unsubscribe();
      };
    });
  }, []);

  return data;
};
