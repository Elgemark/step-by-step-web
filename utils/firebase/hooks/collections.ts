import { getAuth, Unsubscribe } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot,
  writeBatch,
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
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, path.join("/")), { ...data, uid });
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
  const uid = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Batch set
  data.forEach((listItem) => {
    const docRef = doc(firebase, path.join("/") + "/" + listItem.id);
    const listsData = { ...listItem, uid };
    batch.set(docRef, listsData, setOptions);
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
  path: Array<string>;
  data: CollectionItems;
  save: () => Promise<{ data: CollectionItems; error: any }>;
  hasSaveData: boolean;
  updateItem: (itemId: string, itemUpdates: object) => CollectionItems;
  deleteItem: (itemId: string) => Promise<{ error: any }>;
  addItem: (data: CollectionItem, atIndex: number) => void;
  updateAndSave: (itemId: string, itemUpdates: object) => Promise<any>;
} => {
  const [data, setData] = useState<CollectionItems>([]);
  const [updates, setUpdates] = useState<CollectionItems>([]);

  const hasSaveData: boolean = updates.length > 0;

  const mergeAndSortCollection = () => {
    const mergedCollections = mergeCollections(data, updates, "id");
    const sortedCollections = _.sortBy(mergedCollections, (item: CollectionItem) => item.index);
    return sortedCollections;
  };

  const calculatedCollection = mergeAndSortCollection();

  useEffect(() => {
    const _save = async () => {
      return save(updates);
    };

    window.addEventListener("save", _save);
    return () => {
      window.removeEventListener("save", _save);
    };
  }, [...updates]);

  // Subscribe to collection
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

  // "dispatch" callback onHasSaveDataChange
  useEffect(() => {
    onHasSaveDataChange && onHasSaveDataChange(hasSaveData, () => save(updates));
  }, [hasSaveData]);

  // Save function
  const save = async (saveData: CollectionItems) => {
    const response = await setCollectionItems(path, saveData, { merge: true });
    if (!response.error) {
      setUpdates([]);
    }
    return response;
  };

  // Update function
  const updateItem = (itemId: string, itemUpdates: object) => {
    const updatesCopy = [...updates];
    const indexUpdates = updates.findIndex((item) => item.id === itemId);
    if (indexUpdates > -1) {
      updatesCopy[indexUpdates] = { ...updatesCopy[indexUpdates], ...itemUpdates };
    } else {
      updatesCopy.push({ ...itemUpdates, id: itemId });
    }
    setUpdates(updatesCopy);
    return updatesCopy;
  };

  const updateAndSave = async (itemId: string, itemUpdates: object) => {
    return new Promise((resolve, reject) => {
      const updates = updateItem(itemId, itemUpdates);
      setCollectionItems(path, updates, { merge: true })
        .then((res) => {
          setUpdates([]);
          resolve({ updates, error: null });
        })
        .catch((error) => reject(error));
    });
  };

  const deleteItem = async (itemId) => {
    // Find in updates...
    const updateIndex = updates.findIndex((item) => item.id === itemId);
    if (updateIndex > -1) {
      const updatesCopy = [...updates];
      updatesCopy.splice(updateIndex, 1);
      setUpdates(updatesCopy);
      return { error: null };
    }
    // Find in data...
    if (data.find((item) => item.id === itemId)) {
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
    // Additem
    const updatesCopy = [...updates];
    updatesCopy.push({ ...item, index: newIndex });
    setUpdates(updatesCopy);
  };

  return {
    data: calculatedCollection,
    updateAndSave,
    updateItem,
    save: async () => {
      if (!hasSaveData) {
        return { data: [], error: null };
      }
      return save(updates);
    },
    deleteItem,
    addItem,
    hasSaveData,
    path,
  };
};

export const saveAll = () => {
  window.dispatchEvent(new CustomEvent("save"));
};
