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
  SetOptions,
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

export const setCollectionItems = async (
  path: Array<string>,
  data: CollectionItems,
  setOptions?: SetOptions
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
    batch.set(stepsRef, listsData, setOptions);
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
  path: Array<string>,
  onHasSaveDataChange?: (hasSaveData: boolean, save: () => Promise<{ data: CollectionItems; error: any }>) => void
): {
  data: CollectionItems;
  save: () => Promise<{ data: CollectionItems; error: any }>;
  hasSaveData: boolean;
  updateItem: (itemId: string, itemUpdates: object) => void;
  deleteItem: (itemId: string) => Promise<{ error: any }>;
  addItem: (data: CollectionItem, atIndex: number) => void;
} => {
  const [data, setData] = useState<CollectionItems>([]);
  const [updates, setUpdates] = useState<CollectionItems>([]);
  const [newItems, setNewItems] = useState<CollectionItems>([]);

  const hasSaveData: boolean = updates.length > 0 || newItems.length > 0;

  const mergeAndSortCollection = () => {
    const mergedCollections = mergeCollections(data, newItems.concat(updates), "id");
    const sortedCollections = _.sortBy(mergedCollections, (item: CollectionItem) => item.index);
    return sortedCollections;
  };

  const calculatedCollection = mergeAndSortCollection();

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
        setData(_.sortBy(listItems, (item: CollectionItem) => item.index));
      });

      return () => {
        unsubscribe && unsubscribe();
      };
    }
  }, [...path]);

  useEffect(() => {
    onHasSaveDataChange && onHasSaveDataChange(hasSaveData, save);
  }, [hasSaveData]);

  const save = async () => {
    const response = await setCollectionItems(path, mergeCollections(newItems, updates, "id"), { merge: true });
    if (!response.error) {
      setUpdates([]);
      setNewItems([]);
    }
    return response;
  };

  const updateItem = (itemId: string, itemUpdates: object) => {
    const updatesCopy = [...updates];
    const indexUpdates = updates.findIndex((item) => item.id === itemId);

    debugger;
    // CHEKCK IF IN NEW ITEMS
    if (indexUpdates > -1) {
      updatesCopy[indexUpdates] = { ...updatesCopy[indexUpdates], ...itemUpdates };
    } else {
      updatesCopy.push({ ...itemUpdates, id: itemId });
    }

    setUpdates(updatesCopy);
  };

  const deleteItem = async (itemId) => {
    // If in new items
    const newItemIndex = newItems.findIndex((item) => item.id === itemId);

    if (newItemIndex > -1) {
      const itemsCopy = [...newItems];
      itemsCopy.splice(newItemIndex, 1);
      setNewItems(itemsCopy);
      return { error: null };
    }
    // Else remove from collection
    else {
      const deletePath = path.concat([itemId]);
      const response = await deleteCollectionItem(deletePath);
      return response;
    }
  };

  const addItem = (item: CollectionItem, atIndex: number) => {
    // Calc index
    const indexCurrStep = atIndex;
    const indexNextStep = atIndex + 1 < calculatedCollection.length && calculatedCollection[atIndex + 1].index;
    const newIndex = indexNextStep ? (indexCurrStep + indexNextStep) * 0.5 : indexCurrStep + 1;
    debugger;
    // Additem
    const itemsCopy = [...newItems];
    itemsCopy.push({ ...item, index: newIndex });
    setNewItems(itemsCopy);
  };

  return { data: calculatedCollection, updateItem, save, deleteItem, addItem, hasSaveData };
};
