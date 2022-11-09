import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  orderBy as fsOrderBy,
  startAt as fsStartAt,
  endAt as fsEndAt,
} from "firebase/firestore";

export const getPosts = async (orderBy = "likes", startAt = 0, endAt = 10) => {
  const firebase = getFirestore();
  const stepsRef = collection(firebase, "posts");
  const queryBuild = query(stepsRef, fsOrderBy(orderBy), fsStartAt(startAt), fsEndAt(endAt));
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
