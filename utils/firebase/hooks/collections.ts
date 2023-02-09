import { getAuth, Unsubscribe } from "firebase/auth";
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
import _ from "lodash";
import { v4 as uuid } from "uuid";

export type CollectionItem = {
  id: string;
  [key: string]: any;
};

export type CollectionItems = Array<CollectionItem>;

const mergeCollections = (a: Array<object>, b: Array<object>, key: string) => {
  const merged = _.merge(_.keyBy(a, key), _.keyBy(b, key));
  return _.values(merged);
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
  update: (itemId: string, itemUpdates: object) => void;
  delete: (itemId: string) => Promise<{ error: any }>;
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

  const update = (itemId: string, itemUpdates: object) => {
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

  const concatenatedData = mergeCollections(data, updates, "id");

  return { data: concatenatedData, update, save, delete: deleteItem };
};
