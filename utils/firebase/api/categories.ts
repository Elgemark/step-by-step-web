import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CategoriesResponse } from "../interface";

export const getCategories = async () => {
  const response: CategoriesResponse = { data: null, error: null };
  const firebase = getFirestore();
  try {
    const docRef = doc(firebase, "config", "categories");
    const docSnap = await getDoc(docRef);
    response.data = docSnap.exists() ? docSnap.data().list : [];
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useCategories = () => {
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
