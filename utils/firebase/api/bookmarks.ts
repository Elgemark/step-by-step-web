import { getFirestore, writeBatch, doc, getDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BookmarkResponse } from "../interface";
//
export const addBookmark = async (postId) => {
  const response: BookmarkResponse = { data: { postId }, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  // setup batch write
  const batch = writeBatch(getFirestore());
  // See if post was bookmarked
  const bookmarkRef = doc(getFirestore(), "users", userId, "bookmarks", postId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  // Set new bookmark
  await batch.set(bookmarkRef, { postId, userId });
  // update total bookmark on post if new bookmark...
  if (!bookmarkSnap.exists()) {
    const postRef = doc(getFirestore(), "posts", postId);
    await batch.update(postRef, { bookmarks: increment(1) });
  }
  // commit batch
  try {
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const deleteBookmark = async (postId) => {
  const response: BookmarkResponse = { data: { postId }, error: null };
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  // setup batch write
  const batch = writeBatch(firebase);
  const bookmarkRef = doc(firebase, "users", userId, "bookmarks", postId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  // Decrement total
  if (bookmarkSnap.exists()) {
    const postRef = doc(firebase, "posts", postId);
    await batch.update(postRef, { bookmarks: increment(-1) });
    // delete bookmark
    await batch.delete(bookmarkRef);
  }

  let resp = {};
  try {
    // commit batch
    await batch.commit();
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const isBookmarkedByUser = async (postId) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const firebase = getFirestore();
  const bookmarkRef = doc(firebase, "users", userId, "bookmarks", postId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  const isBookmarked = bookmarkSnap.exists();
  return { isBookmarked };
};

export const useBookmarks = (postId) => {
  const [user] = useAuthState(getAuth());
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    if (postId && user) {
      isBookmarkedByUser(postId)
        .then((resp) => {
          setIsBookmarked(resp.isBookmarked);
        })
        .catch((e) => {
          debugger;
        })
        .catch((error) => {});
    }
  }, [postId, user]);

  const toggle = (postId) => {
    if (isBookmarked) {
      deleteBookmark(postId);
      setIsBookmarked(false);
    } else {
      setIsBookmarked(true);
      addBookmark(postId);
    }
    return !isBookmarked;
  };
  return { isBookmarked, toggle };
};
