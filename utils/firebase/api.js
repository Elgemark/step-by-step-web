import { database, collection, query } from "@lib/firebase";

export const getPostsByTags = async (tags = []) => {
  const stepsRef = collection(database, "posts");

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
