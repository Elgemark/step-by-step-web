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
} from "firebase/firestore";
import { Post, PostResponse, PostsResponse } from "../interface";
import { parseData, timeToTimeStamp } from "../../firebaseUtils";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Posts } from "../type";
import { toSanitizedArray } from "../../stringUtils";
import { geBookmarksForUser } from "./bookmarks";
import { getPostIdsByProgress } from "./progress";

interface SearchFilter {
  category?: string | string[];
  rated?: number | string | string[];
  lang?: string;
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
  const resBookmarks = await geBookmarksForUser(uid);
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // Get by bookmarked posts
  postsQuery.push(where("id", "in", resBookmarks.data));
  // Get posts saved by user (if any)
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return resBookmarks.data.length ? await getPostsByQuery(postsQuery) : { data: [], error: null };
};

export const getPublishedPosts = async (uid, limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // by follows id
  postsQuery.push(where("uid", "==", uid));
  // Order by timeStamp
  postsQuery.push(orderBy("timeStamp", "desc"));
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return await getPostsByQuery(postsQuery);
};

export const getCreatedPosts = async (uid, visiblity, limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", visiblity));
  // Get by uid
  postsQuery.push(where("uid", "==", uid));
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return await getPostsByQuery(postsQuery);
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

// Can only get 10 at the time
export const getPostsByState = async (uid, completed = true, limit = 10, lastDoc = null, from = 0, to = 10) => {
  const postIdsResponse = await getPostIdsByProgress(uid, completed);

  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // Get only post for ids...
  postsQuery.push(where("id", "in", postIdsResponse.data.slice(from, to)));
  // Order by timeStamp
  postsQuery.push(orderBy("timeStamp", "desc"));
  // Indexed by visibility & id &  timeStamp!!!

  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  return (await postIdsResponse.data.length) ? getPostsByQuery(postsQuery) : { data: [], error: null };
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

export const getPostBySlug = async (slug: string) => {
  const result = { data: null, error: null };
  // Build query...
  let postsQuery: Array<any> = [];
  // Get only public posts
  postsQuery.push(where("slug", "==", slug));

  let postsResponse = await getPostsByQuery(postsQuery);
  // Compuond queries can not contain range filter on different values. Using JS filtering...
  // rated...
  if (postsResponse.data && postsResponse.data.length) {
    result.data = postsResponse.data[0];
  } else {
    result.error = "No post found!";
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

export const getPostsForAnonymousUser = async (filter: SearchFilter = {}, limit = 4, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // test
  if (filter.lang) {
    postsQuery.push(where("lang", "==", filter.lang));
  }
  // Order by timeStamp
  postsQuery.push(orderBy("timeStamp", "desc"));
  // Indexed by visibility &  timeStamp!!!
  // Limit
  postsQuery.push(fsLimit(limit));
  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  let postsResponse = await getPostsByQuery(postsQuery);
  // Compuond queries can not contain range filter on different values. Using JS filtering...
  // rated...
  if (filter?.rated > 0) {
    postsResponse.data = postsResponse.data.filter((post) => post.ratesValue >= filter.rated);
  }

  return await postsResponse;
};

export const getPostByFollows = async (follows = [], limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // by follows id
  postsQuery.push(where("uid", "in", follows));
  // Order by timeStamp
  postsQuery.push(orderBy("timeStamp", "desc"));
  // Indexed by visibility & uid & timeStamp!!!
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  return await getPostsByQuery(postsQuery);
};

export const getPostByCategories = async (categories = [], limit = 10, lastDoc = null) => {
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  // Get only public posts
  postsQuery.push(where("visibility", "==", "public"));
  // by category
  postsQuery.push(where("category", "in", categories));
  // Order by timeStamp
  postsQuery.push(orderBy("timeStamp", "desc"));
  // Indexed by visibility & uid & timeStamp!!!
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  return await getPostsByQuery(postsQuery);
};

export const getPostsBySearch = async (
  search: string | string[],
  filter: SearchFilter = {},
  limit = 10,
  lastDoc = null
) => {
  const tags = toSanitizedArray(search as string);
  console.log("tags", tags);
  // Build query...
  let postsQuery: Array<any> = [fsLimit(limit)];
  postsQuery = [];
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

  // paginate...
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  let postsResponse = await getPostsByQuery(postsQuery);

  // Compuond queries can not contain range filter on different values. Using JS filtering...
  // rated...
  if (filter?.rated > 0) {
    postsResponse.data = postsResponse.data.filter((post) => post.ratesValue >= filter.rated);
  }

  return postsResponse;
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
