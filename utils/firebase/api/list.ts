import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { List, ListResponse, ListsResponse } from "../interface";
import { Lists } from "../type";
import _ from "lodash";
import { v4 as uuid } from "uuid";

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

export const useLists = (
  postId: string
): {
  data: Lists;
  update: (listUpdates: List) => void;
  save: (postId: string) => Promise<{ error: any; data: Lists }>;
  addList: () => void;
} => {
  const [data, setData] = useState<Lists>([]);
  const [updates, setUpdates] = useState<Lists>([]);

  useEffect(() => {
    const firebase = getFirestore();
    // const listsQuery = query(collection(firebase, "posts", postId, "lists"));
    const listCollection = collection(firebase, "posts", postId, "lists");
    const unsubscribe = onSnapshot(listCollection, (querySnapshot) => {
      const lists: Lists = [];
      querySnapshot.forEach((doc) => {
        lists.push(doc.data() as List);
      });
      setData(lists.reverse());
      return () => {
        unsubscribe();
      };
    });
  }, [postId]);

  const concatenatedData: Lists = updates.length
    ? data.map((list: List) => {
        const listUpdate = updates.find((updateList) => updateList.id === list.id);
        const result = _.merge(listUpdate, list);
        return result;
      })
    : data;

  const updateListItem = (listId: string, index: number, itemUpdates: object) => {
    const listUpdatesCopy: Lists = [...concatenatedData];
    const listToUpdate: List = listUpdatesCopy.find((updateList) => updateList.id === listId);
    listToUpdate[index] = { ...listToUpdate[index], itemUpdates };
    setUpdates(listUpdatesCopy);
  };

  const update = (listUpdates: List) => {
    const listUpdatesCopy: Lists = [...concatenatedData];
    const listToUpdateIndex: number = listUpdatesCopy.findIndex((updateList) => updateList.id === listUpdates.id);
    listUpdatesCopy[listToUpdateIndex] = listUpdates;
    setUpdates(listUpdatesCopy);
  };

  const addList = () => {
    const listId = uuid();
    const list: List = { id: listId, title: "", items: [] };
    const listUpdatesCopy: Lists = [...concatenatedData];
    listUpdatesCopy.push(list);
    setUpdates(listUpdatesCopy);
  };

  const save = async (postId: string) => {
    if (updates.length) {
      const resp = await updateLists(postId, concatenatedData);
      if (!resp.error) {
        setData(concatenatedData);
        setUpdates([]);
      }
    } else {
      return { error: null, data };
    }
  };

  return { data: concatenatedData, update, save, addList };
};
