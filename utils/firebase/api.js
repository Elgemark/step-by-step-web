import {
  getFirestore,
  collection,
  where,
  query,
  doc,
  getDocs,
  setDoc,
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const getPosts = async (orderBy = "likes", startAt = 0, endAt = 10) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, fsOrderBy(orderBy), fsStartAt(startAt), fsEndAt(endAt));
  let data = [];
  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const getPostsByTags = async (tags = []) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, where("tags", "array-contains-any", tags));

  let data = [];
  try {
    const querySnapshot = await getDocs(queryBuild);
    console.count("query");
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const setPost = async (data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const id = uuidv4();
    result.response = await setDoc(doc(firebase, "posts", id), data);
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const setSteps = async (data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const id = uuidv4();
    result.response = await setDoc(doc(firebase, "steps", id), data);
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useUploadImage = () => {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(0);

  const upload = async (uri) => {
    setComplete(false);
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        resolve(xhr.response);
        setProgress(e.loaded / e.total);
      };
      xhr.onerror = function (e) {
        setError(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), uuidv4());
    const _result = await uploadBytes(fileRef, blob);
    setResult(_result);

    // We're done with the blob, close and release it
    blob.close();

    const url = await getDownloadURL(fileRef);

    setComplete(true);
    setDownloadURL(url);

    return { downloadURL: url };
  };

  return { progress, complete, error, result, downloadURL, upload };
};

export const useUploadFileAsBlob = () => {
  const [result, setResult] = useState();
  const [downloadURL, setDownloadURL] = useState(0);

  const upload = async (blob) => {
    const fileRef = ref(getStorage(), uuidv4());
    const _result = await uploadBytes(fileRef, blob);
    const url = await getDownloadURL(fileRef);
    setResult(_result);
    setDownloadURL(url);
    return { url, downloadURL };
  };

  return { upload, result, downloadURL };
};
