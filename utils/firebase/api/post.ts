import {
  getFirestore,
  writeBatch,
  collection,
  where,
  query,
  doc,
  getDoc,
  getDocs,
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
  limit as fsLimit,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { List, Post } from "../interface";
import { Lists, Steps } from "../type";

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

export const searchPosts = async (tags = [], category: string, limit = 10) => {
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

export const setPostAndSteps = async (id: string, post: Post, steps: Steps, lists: Lists = []) => {
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
  // Set the value of 'lists'
  lists.forEach((list: List) => {
    const listsRef = doc(firebase, "posts", id, "lists", list.id);
    const listsData = { ...list, userId };
    batch.set(listsRef, listsData);
  });
  //
  let resp = { response: null, stepsData: null, error: null, postData: null };
  try {
    resp.response = await batch.commit();
    resp.stepsData = stepsData;
    resp.postData = postData;
  } catch (error) {
    resp.error = error;
  }
  return resp;
};

export const getPost = async (id: string) => {
  const firebase = getFirestore();
  const result = { data: null, error: null };
  try {
    const docRef = doc(firebase, "posts", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? { ...docSnap.data(), id } : null;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const deletePost = async (id: string) => {
  const firebase = getFirestore();
  const batch = writeBatch(firebase);
  batch.delete(doc(firebase, "posts", id));
  batch.delete(doc(firebase, "posts", id, "steps", id));
  return await batch.commit();
};
