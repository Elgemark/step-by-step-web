import { getFirestore, doc, getDoc } from "firebase/firestore";

import { parseData } from "../../firebaseUtils";
export interface TextsResponse {
  data: object | null;
  error: any;
}

export const getTextsByPage = async (page: string) => {
  const firebase = getFirestore();
  const result: TextsResponse = { data: null, error: null };
  try {
    const docRef = doc(firebase, "config", "texts", "pages", page);
    const docSnap = await getDoc(docRef);
    result.data = docSnap.exists() ? parseData({ ...docSnap.data() }) : null;
  } catch (error) {
    result.error = error;
  }
  return result;
};
