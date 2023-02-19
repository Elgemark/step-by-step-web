import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore";
import _ from "lodash";

export type ListItem = {
  id: string;
  text: string;
  value: string;
  index?: number;
  step?: number;
  [key: string]: any;
};

export type List = {
  id: string;
  title?: string;
  [key: string]: any;
};

export type Lists = Array<List>;

export type ListItems = Array<ListItem>;

export type ListResponse = {
  id: string;
  data: List | [];
  error: any;
};

export type ListsResponse = {
  id: string;
  data: Lists | null;
  error: any;
};

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

export const updateLists = async (postId: string, data: Lists) => {
  const response = { error: null, data };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  data.forEach((list) => {
    const stepsRef = doc(firebase, "posts", postId, "lists", list.id);
    const listsData = { ...list, userId, uid: userId };
    batch.update(stepsRef, listsData);
  });

  try {
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const setLists = async (postId: string, data: Lists) => {
  const response: ListsResponse = { data: data, id: postId, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  data.forEach((list) => {
    const stepsRef = doc(firebase, "posts", postId, "lists", list.id);
    const listsData = { ...list, userId };
    batch.set(stepsRef, listsData);
  });

  try {
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
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
  const result: ListsResponse = { data: [], id, error: null };
  try {
    const collRef = collection(firebase, "posts", id, "lists");
    const docsSnap = await getDocs(collRef);
    docsSnap.forEach((doc) => {
      result.data.push({ ...doc.data(), id: doc.id } as List);
    });
    result.data = result.data.reverse();
  } catch (error) {
    result.error = error;
    result.data = [];
  }
  return result;
};

export const getListItems = async (postId: string, listId: string) => {
  const firebase = getFirestore();
  const result = { data: [], error: null };
  try {
    const collRef = collection(firebase, "posts", postId, "lists", listId, "items");
    const docsSnap = await getDocs(collRef);
    docsSnap.forEach((doc) => {
      result.data.push({ ...doc.data(), id: doc.id } as ListItem);
    });
    result.data = result.data.reverse();
  } catch (error) {
    result.error = error;
    result.data = [];
  }
  return result;
};

export const updateListItems = async (
  postId: string,
  listId: string,
  data: ListItems
): Promise<{ data: ListItems; error: any }> => {
  const response = { data: data, id: postId, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  data.forEach((listItem) => {
    const stepsRef = doc(firebase, "posts", postId, "lists", listId, "items", listItem.id);
    const listsData = { ...listItem, uid: userId };
    batch.set(stepsRef, listsData);
  });

  try {
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};
