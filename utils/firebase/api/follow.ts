import { getFirestore, writeBatch, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { FollowResponse, FollowersResponse } from "../interface";
import { useUser } from "reactfire";

export const follow = async (userId: string, follow = true) => {
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const firebase = getFirestore();
  let resp: FollowResponse = { error: null, data: null };

  if (!userId || !currentUserId) {
    resp.error = "No userId or currentUserId found!";
    return resp;
  }

  // setup batch write
  const batch = writeBatch(firebase);
  //::: Update current user follow data...
  // See if user was followed
  const followRef = doc(firebase, "users", currentUserId, "follows", userId);
  const followSnap = await getDoc(followRef);
  // Delete follow if exists & follow = false
  if (followSnap.exists() && !follow) {
    await batch.delete(followRef);
  }
  // Set follow if exists = false & follow = true
  else if (!followSnap.exists() && follow) {
    await batch.set(followRef, { uid: userId, follow });
  }
  //::: Update the followed user followers...
  const userFollowerRef = doc(firebase, "users", userId, "followers", currentUserId);
  const userFollowerSnap = await getDoc(userFollowerRef);
  // Delete follower if exists & follow = false
  if (userFollowerSnap.exists() && !follow) {
    await batch.delete(userFollowerRef);
  }
  // Set follower if exists = false & follow = true
  else if (!userFollowerSnap.exists() && follow) {
    await batch.set(userFollowerRef, { follow });
  }
  // ::: Commit...
  try {
    await batch.commit();
    resp.data = { uid: userId, follow };
  } catch (error) {
    resp.error = error;
  }
  return resp;
};

export const getFollows = async (userId) => {
  const firebase = getFirestore();
  const response: FollowersResponse = { error: null, data: [] };
  try {
    const followsRef = collection(firebase, "users", userId, "follows");
    const followsSnap = await getDocs(followsRef);
    const data: Array<object> = [];
    followsSnap.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    response.data = data;
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getFollowers = async (userId) => {
  const firebase = getFirestore();
  const response: FollowersResponse = { error: null, data: [] };
  try {
    const followersRef = collection(firebase, "users", userId, "followers");
    const followersSnap = await getDocs(followersRef);
    const data: Array<object> = [];
    followersSnap.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    response.data = data;
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getLeaderForFollower = async (leaderUserId, followerUserId) => {
  const firebase = getFirestore();
  const docRef = doc(firebase, "users", followerUserId, "follows", leaderUserId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const useFollow = (leaderUserId) => {
  const { data: currentUser, status } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (status !== "loading" && currentUser.uid) {
      setIsLoading(true);
      const followeUserId = currentUser.uid;
      // Get leader
      getLeaderForFollower(leaderUserId, followeUserId).then((res) => {
        setIsFollowing(res ? true : false);
        setIsLoading(false);
      });
    }
  }, [currentUser, status]);

  return {
    isFollowing,
    toggle: (userId) => {
      setIsFollowing(!isFollowing);
      follow(userId, !isFollowing);
    },
    isLoading,
  };
};
