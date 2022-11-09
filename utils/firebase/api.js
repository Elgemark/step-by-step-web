import { getFirestore, collection, where, query, getDocs } from "firebase/firestore";

export const getPostsByTags = async (tags = []) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, where("tags", "array-contains-any", tags));

  let data = [];
  try {
    const querySnapshot = await getDocs(queryBuild);
    console.count("query");
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.log("error", error);
  }
  return data;
};
