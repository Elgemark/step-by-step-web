import { getFirestore, getDoc, collection, getDocs, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

export type Category = {
  value: string | number;
  text: string;
};

export type CategoryObject = {
  id: string;
  meta: object;
  descr: object;
  texts: object;
};

export type Categories = Array<Category>;

type CategoriesResponse = {
  data: Categories;
  error: any;
};

type CategoryResponse = {
  data: CategoryObject;
  error: any;
};

export const getCategories = async (language = "en-global") => {
  const response: CategoriesResponse = { data: [], error: null };

  const firebase = getFirestore();
  try {
    const collRef = collection(firebase, "config", "categories", "list");
    const docsSnap = await getDocs(collRef);
    docsSnap.forEach((doc) => {
      response.data.push({ text: doc.data().texts[language], value: doc.id } as Category);
    });
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const getCategory = async (category: string) => {
  const firebase = getFirestore();
  const result: CategoryResponse = { data: { id: category, meta: {}, texts: {} }, error: null };
  try {
    const docRef = doc(firebase, "config", "categories", "list", category);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? ({ ...docSnap.data(), id: category } as CategoryObject) : null;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const useCategories = (language = "en-global"): { categories: Categories; isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getCategories(language).then((resp) => {
      setCategories(resp.data);
      setIsLoading(false);
    });
  }, [language]);

  return { categories, isLoading };
};
