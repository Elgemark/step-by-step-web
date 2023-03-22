import { getFirestore, getDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type Category = {
  value: string | number;
  text: string;
};

type Categories = Array<Category>;

type CategoriesResponse = {
  data: Categories;
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
