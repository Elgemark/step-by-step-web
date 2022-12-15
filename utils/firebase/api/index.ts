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
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useStateObject } from "../../object";
import * as dataModels from "../models";
//
import * as userApi from "./user";
import * as followApi from "./follow";
import * as storageApi from "./storage";
// User
// Follow
export const follow = followApi.follow;
export const getFollowers = followApi.getFollowers;
export const getFollows = followApi.getFollows;
export const getLeaderForFollower = followApi.getLeaderForFollower;
export const useFollow = followApi.useFollow;
// :::Storage
export const useUploadImage = storageApi.useUploadImage
export const useUploadFileAsBlob = storageApi.useUploadFileAsBlob
/// :::USERS
export const setUser = userApi.setUser;
export const updateUser = userApi.updateUser;
export const getCurrentUser = userApi.getCurrentUser;
export const getUser = userApi.getUser;
export const useUser = userApi.useUser;
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

export const getSavedPosts = async (uid, startAt = 0, endAt = 10) => {
  let error = null;
  const posts = [];
  const firebase = getFirestore();
  // get saved posts for user
  const bookmarksRef = collection(firebase, "users", uid, "bookmarks");
  const bookmarksQuery = query(bookmarksRef, where("value", "==", 1));
  let bookmarksIds = [];
  try {
    const bookmarksSnap = await getDocs(bookmarksQuery);
    bookmarksSnap.forEach((doc) => {
      bookmarksIds.push(doc.id);
    });
  } catch (error) {
    error = error.toString();
  }
  // Get posts saved by user (if any)
  if (bookmarksIds.length) {
    const postsRef = collection(firebase, "posts");
    const queryBuild = query(postsRef, where("id", "in", bookmarksIds));

    try {
      const querySnapshot = await getDocs(queryBuild);
      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
    } catch (error) {
      error = error.toString();
    }
  }

  return { error, posts, bookmarksIds };
};

export const getCreatedPosts = async (uid) => {
  let error = null;
  const posts = [];
  //
  const firebase = getFirestore();
  const postsRef = collection(firebase, "posts");
  const queryBuild = query(postsRef, where("userId", "==", uid));

  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });
  } catch (error) {
    error = error.toString();
  }
  return { error, posts };
};

export const getPostsByState = async (uid, state) => {
  let error = null;
  const posts = [];
  const firebase = getFirestore();
  // get completed posts for user
  const progressRef = collection(firebase, "users", uid, "progress");
  const progressQuery = query(progressRef, where("completed", "==", state === "completed"));
  let postIds = [];
  try {
    const docsSnap = await getDocs(progressQuery);
    docsSnap.forEach((doc) => {
      postIds.push(doc.id);
    });
  } catch (error) {
    error = error.toString();
  }
  // Get posts saved by user (if any)
  if (postIds.length) {
    const postsRef = collection(firebase, "posts");
    const queryBuild = query(postsRef, where("id", "in", postIds));
    try {
      const querySnapshot = await getDocs(queryBuild);
      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
    } catch (error) {
      error = error.toString();
    }
  }

  return { error, posts, postIds };
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
    setStep: async (index, completed = false) => {
      setValue("step", index);
      return await setUserStepsProgress(uid, id, {
        ...data,
        completed,
        step: index,
      });
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

export const useLikes = (postId) => {
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

// BOOKMARKS
export const bookmarkPost = async (postId) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  // setup batch write
  const batch = writeBatch(firebase);
  // See if post was bookmarked
  const bookmarkRef = doc(firebase, "users", userId, "bookmarks", postId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  // get new bookmark value...
  const userNewBookmarkValue = bookmarkSnap.exists() && bookmarkSnap.data().value === 1 ? 0 : 1;
  // update user bookmark value
  await batch.set(bookmarkRef, { value: userNewBookmarkValue });
  // update total bookmark on post...
  const incrementBookmarks = increment(bookmarkSnap.exists() && userNewBookmarkValue === 0 ? -1 : 1);
  const postRef = doc(firebase, "posts", postId);
  await batch.update(postRef, { bookmarks: incrementBookmarks });
  let resp = {};
  try {
    // commit batch
    resp.response = await batch.commit();
  } catch (error) {
    resp.error = error;
  }
  return resp;
};

export const isPostBookmarkedByUser = async (postId) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const bookmarkRef = doc(firebase, "users", userId, "bookmarks", postId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  const isBookmarked = bookmarkSnap.exists() && bookmarkSnap.data().value > 0;
  return { isBookmarked };
};

export const useBookmarks = (postId) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    isPostBookmarkedByUser(postId)
      .then((resp) => {
        setIsBookmarked(resp.isBookmarked);
      })
      .catch((error) => {});
  }, [postId]);

  const toggle = () => {
    setIsBookmarked(!isBookmarked);
    return !isBookmarked;
  };
  return { isBookmarked, toggle };
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

