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
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
  increment,
  limit as fsLimit,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStateObject } from "../object";
import * as dataModels from "./models";

/// :::USERS

export const setUser = async (currentUser) => {
  const { uid } = currentUser;
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  const userProfile = await getDoc(userRef);

  if (userProfile.exists()) {
    return { ...userProfile.data(), uid, wasCreated: false };
  } else {
    await setDoc(userRef, dataModels.userProfile);
    return { ...dataModels.userProfile, uid, wasCreated: true };
  }
};

export const updateUser = async (uid, data) => {
  const firebase = getFirestore();
  const userRef = doc(firebase, "users", uid);
  return await updateDoc(userRef, data);
};

export const getUser = async () => {
  const firebase = getFirestore();
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const userRef = doc(firebase, "users", uid);
  const userProfile = await getDoc(userRef);
  if (userProfile.exists()) {
    return { ...userProfile.data(), uid };
  } else {
    return { error: { message: "User not found!" }, uid };
  }
};

export const useUser = () => {
  const { object: user, setValue: update, replace } = useStateObject();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    getUser()
      .then((res) => {
        replace(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const save = async () => {
    return await updateUser(user.id, user);
  };

  return { user, isLoading, error, update, save };
};

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

export const searchPosts = async (tags = [], category, limit = 10) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const tagsQuery = where("tags", "array-contains-any", tags);
  const categoryQuery = where("category", "==", category);
  // push queries
  const queries = [];
  tags.length && queries.push(tagsQuery);
  category && queries.push(categoryQuery);
  // build query
  const queryBuild = query(stepsRef, ...queries, fsLimit(limit));
  //
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

export const setPostAndSteps = async (id, post, steps) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  // Set the value of 'posts'
  const postsRef = doc(firebase, "posts", id);
  const postData = { ...post, id, userId };
  batch.set(postsRef, postData);
  // Set the value of 'steps'
  const stepsRef = doc(firebase, "posts", id, "steps", id);
  const stepsData = { ...steps, id, userId };
  batch.set(stepsRef, stepsData);
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
  const batch = writeBatch(firebase);
  batch.delete(doc(firebase, "posts", id));
  batch.delete(doc(firebase, "posts", id, "steps", id));
  return await batch.commit();
};

// ::: STEPS
export const setSteps = async (id, data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    result.response = await setDoc(doc(firebase, "posts", id, "steps", id), data);
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
    const docRef = doc(firebase, "posts", id, "steps", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), id } : dataModels.steps;
  } catch (error) {
    result.error = error;
  }
  return result;
};

// ::: USER DATA

export const setUserStepsProgress = async (uid, id, data) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "users", uid, "progress", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      result.response = await updateDoc(docRef, data);
    } else {
      result.response = await setDoc(docRef, data);
    }

    result.data = { ...data, uid };
    result.id = uid;
  } catch (error) {
    result.error = error;
    debugger;
  }
  return result;
};

export const getUserStepsProgress = async (uid, id) => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "users", uid, "progress", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), uid } : { ...dataModels.userStepsProgress, userId: uid, id };
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useUserStepsProgress = (uid, id) => {
  const [isLoading, setIsLoading] = useState();
  const { object: data, setValue, replace: setData } = useStateObject();
  const [error, setError] = useState();

  useEffect(() => {
    if (uid && id) {
      setIsLoading(true);
      getUserStepsProgress(uid, id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [uid, id]);

  return {
    ...data,
    isLoading,
    error,
    setStep: async (index) => {
      setValue("step", index);
      return await setUserStepsProgress(uid, id, { ...data, step: index });
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
  const likeRef = doc(firebase, "users", userId, "likes", postId);
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
  const likeRef = doc(firebase, "users", userId, "likes", postId);
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

  const toggle = () => {
    setIsLiked(!isLiked);
    return !isLiked;
  };
  return { isLiked, toggle };
};

// ::: CATEGORIES

export const getCategories = async () => {
  const firebase = getFirestore();
  const result = {};
  try {
    const docRef = doc(firebase, "config", "categories");
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? docSnap.data().list : [];
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useGetCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getCategories().then((resp) => {
      setCategories(resp.data);
      setIsLoading(false);
    });
  }, []);

  return { categories, isLoading };
};

// ::: MISC

export const useUploadImage = (locationPath = []) => {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(0);
  //
  const auth = getAuth();
  const userId = auth.currentUser.uid;

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

    const fileRef = ref(getStorage(), "users", userId, ...locationPath, uuidv4());
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

export const useUploadFileAsBlob = (locationPath = [], imageSize = "1024x1024") => {
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState();
  const [downloadURL, setDownloadURL] = useState(0);

  const upload = async (blob) => {
    setIsLoading(true);
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const pathArr = ["users", userId, ...locationPath].join("/");
    const fileRef = ref(getStorage(), pathArr);
    const _result = await uploadBytes(fileRef, blob);
    const receivedURL = await getDownloadURL(fileRef);
    const url = imageSize ? receivedURL.replace("?", `_${imageSize}?`) : receivedURL;
    // set results
    setResult(_result);
    setDownloadURL(url);
    setIsLoading(false);
    return { url: url, downloadURL: url };
  };

  return { upload, result, isLoading, downloadURL };
};
