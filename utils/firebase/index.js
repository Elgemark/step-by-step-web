import React, { useState, useEffect } from "react";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, updateDoc, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { query, collection, doc, getDocs, setDoc, addDoc, deleteDoc } from "firebase/firestore";

import _ from "lodash";

const firebaseConfig = {
  apiKey: "AIzaSyCu6npVk3xMGmViQ3AWSD_RHLLkEoDkyKk",
  authDomain: "step-by-step-37f76.firebaseapp.com",
  projectId: "step-by-step-37f76",
  storageBucket: "step-by-step-37f76.appspot.com",
  messagingSenderId: "287035538812",
  appId: "1:287035538812:web:d7fd06045136234ee538f9",
  measurementId: "G-HVTSGKF4F6",
};

let _app, _analytics, _db;

export const init = () => {
  _app = firebase.initializeApp(firebaseConfig);
  _analytics = getAnalytics(_app);
  _db = getFirestore(_app);

  getAuth(_app);

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    // signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/admin",
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        disableSignUp: {
          status: true,
        },
      },
    ],
  };

  return { app: _app, analytics: _analytics, db: _db, uiConfig };
};

export const useInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [resp, setResp] = useState({});
  useEffect(() => {
    const initResp = init();
    setResp(initResp);
    setIsInitialized(true);
  }, []);
  return { isInitialized, ...resp };
};

// export const getDocs = async ({ collection, query = [] }) => {
//   const _query = fbQuery(fbCollection(_db, collection), ...query);
//   const querySnapshot = await fbGetDocs(_query);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// export const setDoc = async ({ collection, path, data }) => {
//   return await fbSetDoc(fbDoc(_db, collection, path), data);
// };

// export const addDoc = async ({ collection, data }) => {
//   return await fbAddDoc(fbCollection(_db, collection), data);
// };

// export const deleteDoc = async ({ collection, path }) => {
//   return await fbDeleteDoc(fbDoc(_db, collection, path));
// };

export const getDb = () => {
  return _db;
};

export const useGetUser = ({ skip = false } = {}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!skip) {
      const auth = getAuth();
      onAuthStateChanged(auth, (_user) => {
        if (_user) {
          setUser(_user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
    }
  }, [skip]);

  return { user, isLoading };
};

export const setPost = async (data) => {
  const result = {};
  try {
    id = uuidv4();
    result.response = await setDoc(doc(_db, "posts", id), data);
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const setSteps = async (data) => {
  const result = {};
  try {
    id = uuidv4();
    result.response = await setDoc(doc(_db, "steps", id), data);
    result.id = id;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const getPostsByTags = async (tags = []) => {
  const stepsRef = collection(_db, "posts");

  const queryBuild = query(stepsRef, where("tags", "array-contains-any", tags));
  let data = [];
  try {
    const querySnapshot = await getDocs(queryBuild);
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const useGetPostsByString = (string = "", minChar = 2, debounceWait = 500) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState();
  const [steps, setSteps] = React.useState([]);

  //
  const debouncedGetPostsByTags = _.debounce(async (str) => {
    const tags = str.split(" ");
    setIsLoading(true);
    const resp = await getPostsByTags(tags);
    setSteps(resp);
    setIsLoading(false);
  }, debounceWait);
  //
  React.useEffect(() => {
    if (string.length >= minChar) {
      debouncedGetPostsByTags(string);
    }
  }, [string]);

  return { steps, isLoading, error, getPostsByTags, debouncedGetPostsByTags };
};

export const getPostsByString = async (string = "", minChar = 2, debounceWait = 500) => {
  let result = null;
  const debouncedGetPostsByTags = _.debounce(async (str) => {
    const tags = str.split(" ");
    result = await getPostsByTags(tags);
    return result;
  }, debounceWait);

  return await debouncedGetPostsByTags(string);
};
