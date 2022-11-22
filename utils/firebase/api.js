import {
  getFirestore,
  writeBatch,
  collection,
  where,
  query,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
  increment,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStateObject } from "../object";
import * as dataModels from "./models";

// ::: POSTS
export const getPosts = async (orderBy = "likes", startAt = 0, endAt = 10) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, fsOrderBy(orderBy), fsStartAt(startAt), fsEndAt(endAt));
  let data = [];
  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
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
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
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
    const id = data.id || uuidv4();
    result.response = await setDoc(doc(firebase, "posts", id), data);
    result.data = { ...data, id };
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const setPostAndSteps = async (post, steps) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Set the value of 'steps'
  const stepsId = steps.id || uuidv4();
  const stepsRef = doc(firebase, "steps", stepsId);
  const stepsData = { ...steps, id: stepsId, userId };
  batch.set(stepsRef, stepsData);
  // Set the value of 'posts'
  const postId = post.id || uuidv4();
  const postsRef = doc(firebase, "posts", postId);
  const postData = { ...post, id: postId, stepsId, userId };
  batch.set(postsRef, postData);
  //
  let resp = {};
  try {
    resp.response = await batch.commit();
    resp.stepsData = stepsData;
    resp.postData = postData;
  } catch (error) {
    resp.error = error;
  }
  return resp;
};

export const getPost = async (id) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "posts", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), id } : null;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const deletePost = async (id) => {
  const firebase = getFirestore();
  await deleteDoc(doc(firebase, "posts", id));
};

// ::: STEPS
export const setSteps = async (data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const id = data.id || uuidv4();
    result.response = await setDoc(doc(firebase, "steps", id), data);
    result.data = { ...data, id };
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getSteps = async (id) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "steps", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), id } : dataModels.steps;
  } catch (error) {
    result.error = error;
  }
  return result;
};

// ::: USER DATA

export const setUserStepsProgress = async (uid, stepsId, data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    result.response = await setDoc(doc(firebase, "user-data", uid, "progress", stepsId), data);
    result.data = { ...data, uid };
    result.id = uid;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getUserStepsProgress = async (uid, stepsId) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "user-data", uid, "progress", stepsId);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists()
      ? { ...docSnap.data(), uid }
      : { ...dataModels.userDataStepsProgress, userId: uid, stepsId };
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useUserStepsProgress = (uid, stepsId) => {
  const [isLoading, setIsLoading] = useState();
  const { object: data, setValue, replace: setData } = useStateObject();
  const [error, setError] = useState();

  useEffect(() => {
    if (uid && stepsId) {
      setIsLoading(true);
      getUserStepsProgress(uid, stepsId)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [uid, stepsId]);

  return {
    ...data,
    isLoading,
    error,
    setStep: async (index) => {
      setValue("step", index);
      return await setUserStepsProgress(uid, stepsId, { ...data, step: index });
    },
  };
};

// ::: LIKES POST

export const likePost = async (postId) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  // setup batch write
  const batch = writeBatch(firebase);
  // See if post was liked
  const likeRef = doc(firebase, "user-data", userId, "likes", postId);
  const likeSnap = await getDoc(likeRef);
  // get new like value...
  const userNewLikeValue = likeSnap.exists() && likeSnap.data().value === 1 ? 0 : 1;
  // update user like value
  await batch.set(likeRef, { value: userNewLikeValue });
  // update total likes on post...
  const incrementLikes = increment(likeSnap.exists() && userNewLikeValue === 0 ? -1 : 1);
  const postRef = doc(firebase, "posts", postId);
  await batch.update(postRef, { likes: incrementLikes });
  let resp = {};
  try {
    // commit batch
    resp.response = await batch.commit();
  } catch (error) {
    resp.error = error;
  }
  return resp;
};

export const isPostLikedByUser = async (postId) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const likeRef = doc(firebase, "user-data", userId, "likes", postId);
  const likeSnap = await getDoc(likeRef);
  const isLiked = likeSnap.exists() && likeSnap.data().value > 0;
  return { isLiked };
};

export const useIsPostLikedByUser = (postId) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    isPostLikedByUser(postId)
      .then((resp) => {
        setIsLiked(resp.isLiked);
      })
      .catch((error) => {});
  }, [postId]);
  return isLiked;
};

// ::: MISC

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
