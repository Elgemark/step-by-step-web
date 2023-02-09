import { getAuth, Unsubscribe } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import _ from "lodash";

export type CollectionItem = {
  id: string;
  [key: string]: any;
};

export type CollectionItems = Array<CollectionItem>;

const mergeCollections = (a: Array<object>, b: Array<object>, key: string) => {
  const merged = _.merge(_.keyBy(a, key), _.keyBy(b, key));
  return _.values(merged);
};

export const addCollectionItem = async (path: Array<string>, data: CollectionItem) => {
  const response = { data, error: null };
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, path.join("/")), data);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const updateCollectionItems = async (
  path: Array<string>,
  data: CollectionItems
): Promise<{ data: CollectionItems; error: any }> => {
  const response = { data: data, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  data.forEach((listItem) => {
    const stepsRef = doc(firebase, path.join("/"));
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

export const deleteCollectionItem = async (docPath: Array<string>) => {
  const firebase = getFirestore();
  const response = { error: null };
  try {
    const docRef = doc(firebase, docPath.join("/"));
    await deleteDoc(docRef);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useCollection = (
  path: Array<string>
): {
  data: CollectionItems;
  save: () => Promise<{ data: CollectionItems; error: any }>;
  updateItem: (itemId: string, itemUpdates: object) => void;
  deleteItem: (itemId: string) => Promise<{ error: any }>;
  addItem: (data: CollectionItem) => Promise<{ id: string; data: object; error: null }>;
} => {
  const [data, setData] = useState<CollectionItems>([]);
  const [updates, setUpdates] = useState<CollectionItems>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (path) {
      const firebase = getFirestore();
      const listCollection = collection(firebase, path.join("/"));
      unsubscribe = onSnapshot(listCollection, (querySnapshot) => {
        const listItems: CollectionItems = [];
        querySnapshot.forEach((doc) => {
          listItems.push({ ...(doc.data() as CollectionItem), id: doc.id });
        });
        setData(listItems.reverse());
      });

      return () => {
        unsubscribe && unsubscribe();
      };
    }
  }, [path]);

  const save = async () => {
    const response = await updateCollectionItems(path, updates);
    if (!response.error) {
      setUpdates([]);
    }
    return response;
  };

  const updateItem = (itemId: string, itemUpdates: object) => {
    const updateCopy = [...updates];
    const index: number = updateCopy.findIndex((item) => item.id === itemId);
    const updatedItem = { ...updateCopy[index], ...itemUpdates };
    updateCopy[index] = updatedItem;
    setUpdates(updateCopy);
  };

  const deleteItem = async (itemId) => {
    const deletePath = path.concat([itemId]);
    return deleteCollectionItem(deletePath);
  };

  const addItem = (item: CollectionItem) => {
    const docPath = [...path];
    docPath.push(item.id);
    return addCollectionItem(docPath, item);
  };

  const concatenatedData = mergeCollections(data, updates, "id");

  return { data: concatenatedData, updateItem, save, deleteItem, addItem };
};
