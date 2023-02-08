import {
  getFirestore,
  writeBatch,
  collection,
  where,
  query,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit as fsLimit,
  startAfter,
  serverTimestamp,
  setDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { FollowersResponse, Post, PostResponse, PostsResponse } from "../interface";
import { parseData, timeToTimeStamp } from "../../firebaseUtils";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Posts } from "../type";
import { getUser } from "./user";
import { toSanitizedArray } from "../../stringUtils";
import { getFollows } from "./follow";

interface SearchFilter {
  category?: string;
  orderBy?: "likes" | "latest" | "completions";
}

export const setPost = async (id, post: Post) => {
  const response: PostResponse = { data: post, error: null };
  const auth = getAuth();
  // never change owner
  const uid = post.uid || auth.currentUser.uid;
  const firebase = getFirestore();
  try {
    await setDoc(doc(firebase, "posts", id), { ...post, uid, timeStamp: serverTimestamp() });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const updatePost = async (id, data: any = {}) => {
  const response: any = { data: { id, ...data }, error: null };
  const auth = getAuth();
  // never change owner
  const uid = data.uid || auth.currentUser.uid;

  const firebase = getFirestore();
  try {
    await updateDoc(doc(firebase, "posts", id), { ...data, uid, timeStamp: serverTimestamp() });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getPostsByQuery = async (queries: Array<any>) => {
  const response: PostsResponse = { data: [], error: null, lastDoc: null };
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, ...queries);
  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      response.data.push(parseData({ ...doc.data(), id: doc.id }) as Post);
    });
    response.lastDoc = querySnapshot.docs.length && querySnapshot.docs[querySnapshot.docs.length - 1];
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getBookmarkedPosts = async (uid, limit = 10, lastDoc = null) => {
  let error = null;
  const posts = [];
  const firebase = getFirestore();
  // get saved posts for user as list of id:s
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
    const queryBuild = query(postsRef, where("id", "in", bookmarksIds), where("visibility", "==", "public"));
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

export const getPublishedPosts = async (uid) => {
  let error = null;
  const posts = [];
  //
  const firebase = getFirestore();
  const postsRef = collection(firebase, "posts");
  const queryBuild = query(postsRef, where("uid", "==", uid), where("visibility", "==", "public"));

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

export const getDraftedPosts = async (uid) => {
  let error = null;
  const posts = [];
  //
  const firebase = getFirestore();
  const postsRef = collection(firebase, "posts");
  const queryBuild = query(postsRef, where("uid", "==", uid), where("visibility", "==", "draft"));

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

export const getReviewPosts = async (uid) => {
  let error = null;
  const posts = [];
  //
  const firebase = getFirestore();
  const postsRef = collection(firebase, "posts");
  const queryBuild = query(postsRef, where("uid", "==", uid), where("visibility", "==", "review"));

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

export const useGetPost = (id: string) => {
  const [data, setData] = useState<Post>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const firebase = getFirestore();
    const docRef = doc(firebase, "posts", id);

    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData(parseData({ ...doc.data(), id }) as Post);
      } else {
        setError({ message: "no data!" });
      }
      setIsLoading(false);
    });

    return () => {
      unsub();
    };
  }, [id]);

  return { data, isLoading, error };
};

export const useGetPostsByQuery = () => {
  const [posts, setPosts] = useState<Posts>([]);

  const _getPostsByQuery = (queries) => {
    getPostsByQuery(queries).then((response) => {
      setPosts(response.data);
    });
  };

  return { posts, getPostsByQuery: _getPostsByQuery };
};

// ::: Custom query functions...

type PostsForAnonymousUserOptions = {
  excludeIds?: Array<string>;
};

export const getPostsForAnonymousUser = async (
  limit = 10,
  lastDoc = null,
  options: PostsForAnonymousUserOptions = {}
) => {
  // Build query...
  let postsQuery: Array<any> = [];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));

  //
  if (options.excludeIds) {
    postsQuery.push(where("id", "not-in", options.excludeIds));
  }
  // Order by likes // Not working!
  // postsQuery.push(orderBy("likes", "desc"));
  // Limit
  postsQuery.push(fsLimit(limit));
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return await getPostsByQuery(postsQuery);
};

export const getPostByFollows = async (follows = [], fromTimeStamp = null, limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // From timestamp !!! Funkar inte i kombo
  if (fromTimeStamp) {
    // postsQuery.push(where("timeStamp", ">", timeToTimeStamp(fromTimeStamp)));
  }
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  //
  postsQuery.push(where("uid", "in", follows));
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  return await getPostsByQuery(postsQuery);
};

export const getPostByInterests = async (interests = [], fromTimeStamp = null, limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // From timestamp
  if (fromTimeStamp) {
    postsQuery.push(where("timeStamp", ">", timeToTimeStamp(fromTimeStamp)));
  }
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  //
  postsQuery.push(where("category", "in", interests));
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  return await getPostsByQuery(postsQuery);
};

export const getPostByExclude = async (exclude = [], limit = 10, lastDoc = null) => {
  console.log("exclude", exclude);
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  //
  if (exclude.length) {
    postsQuery.push(where("id", "not-in", exclude));
  }
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  return await getPostsByQuery(postsQuery);
};

export const getPostsBySearch = async (search: string, filter: SearchFilter = {}, limit = 10, lastDoc = null) => {
  const tags = toSanitizedArray(search);
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // category...
  if (filter.category) {
    postsQuery.push(where("category", "==", filter.category));
  }
  // search by tags...
  if (tags && tags.length) {
    postsQuery.push(where("tags", "array-contains-any", tags));
  }
  // order by
  if (filter.orderBy) {
    postsQuery.push(orderBy(filter.orderBy, "desc"));
  }
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return await getPostsByQuery(postsQuery);
};

export const getPostsByCategory = async (category = null, limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // category...
  postsQuery.push(where("category", "==", category));
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return await getPostsByQuery(postsQuery);
};
