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
  limit as fsLimit,
  startAfter as fsStartAfter,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { List, Post, PostsResponse } from "../interface";
import { Lists, Steps } from "../type";
import { parseData } from "../../firebaseUtils";

export const getPosts = async (orderBy = "likes", limit = 10, lastDoc) => {
  const response: PostsResponse = { data: [], error: null, lastDoc: null };
  //
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queries = [fsOrderBy(orderBy, "desc"), fsLimit(limit)];
  if (lastDoc) {
    queries.push(fsStartAfter(lastDoc));
  }
  const queryBuild = query(stepsRef, ...queries);

  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      response.data.push(parseData({ ...doc.data(), id: doc.id }) as Post);
    });
    response.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getBookmarkedPosts = async (uid, limit = 10, lastDoc = null) => {
  let error = null;
  const posts = [];
  const firebase = getFirestore();
  // get saved posts for user
  const bookmarksRef = collection(firebase, "users", uid, "bookmarks");

  const queries = [fsLimit(limit)];
  const queryBuild = query(bookmarksRef, ...queries);

  let bookmarksIds = [];
  try {
    const bookmarksSnap = await getDocs(queryBuild);
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
        posts.push(parseData({ ...doc.data(), id: doc.id }));
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
      posts.push(parseData({ ...doc.data(), id: doc.id }));
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
        posts.push(parseData({ ...doc.data(), id: doc.id }));
      });
    } catch (error) {
      error = error.toString();
    }
  }

  return { error, posts, postIds };
};

export const searchPosts = async (tags = [], category: string, limit = 10) => {
  const response: PostsResponse = { data: [], error: null };
  //
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

  try {
    const querySnapshot = await getDocs(queryBuild);

    querySnapshot.forEach((doc) => {
      response.data.push(parseData({ ...doc.data(), id: doc.id }) as Post);
    });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getPost = async (id: string) => {
  const firebase = getFirestore();
  const result = { data: null, error: null };
  try {
    const docRef = doc(firebase, "posts", id);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? parseData({ ...docSnap.data(), id }) : null;
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
