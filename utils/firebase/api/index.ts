import {
  getFirestore,
  writeBatch,
  doc,
  getDoc,
  setDoc,
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
  increment,
  limit as fsLimit,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useStateObject } from "../../object";
import * as dataModels from "../models";
//
import * as userApi from "./user";
import * as followApi from "./follow";
import * as storageApi from "./storage";
import * as postApi from "./post";
import * as listApi from "./list";
import * as bookmarksApi from "./bookmarks";
// User
// Follow
export const follow = followApi.follow;
export const getFollowers = followApi.getFollowers;
export const getFollows = followApi.getFollows;
export const getLeaderForFollower = followApi.getLeaderForFollower;
export const useFollow = followApi.useFollow;
// :::Storage
export const useUploadImage = storageApi.useUploadImage;
export const useUploadFileAsBlob = storageApi.useUploadFileAsBlob;
/// :::USERS
export const setUser = userApi.setUser;
export const updateUser = userApi.updateUser;
export const getCurrentUser = userApi.getCurrentUser;
export const getUser = userApi.getUser;
export const useUser = userApi.useUser;
///
export const setUserStepsProgress = userApi.setUserStepsProgress;
export const getUserStepsProgress = userApi.getUserStepsProgress;
export const useUserStepsProgress = userApi.useUserStepsProgress;
// ::: POSTS
export const getPosts = postApi.getPosts;
export const getBookmarkedPosts = postApi.getBookmarkedPosts;
export const getCreatedPosts = postApi.getCreatedPosts;
export const getPostsByState = postApi.getPostsByState;
export const searchPosts = postApi.searchPosts;
export const setPostAndSteps = postApi.setPostAndSteps;
export const getPost = postApi.getPost;
export const deletePost = postApi.deletePost;
// BOOKMARKS
export const addBookmark = bookmarksApi.addBookmark;
export const deleteBookmark = bookmarksApi.deleteBookmark;
export const useBookmarks = bookmarksApi.useBookmarks;
export const isBookmarkedByUser = bookmarksApi.isBookmarkedByUser;
// ::: LISTS
export const getLists = listApi.getLists;
export const getList = listApi.getList;
export const setLists = listApi.setLists;
export const setList = listApi.setList;
export const deleteList = listApi.deleteList;
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
