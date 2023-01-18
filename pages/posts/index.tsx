import { toSanitizedArray } from "../../utils/stringUtils";
import PageMain from "../../components/PageMain";
import { PostsResponse } from "../../utils/firebase/interface";
import { limit, orderBy, startAfter, where } from "firebase/firestore";
import { getPostsByQuery, getPostsBySearch, getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import Collection from "../../classes/Collection";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useDebouncedQuery } from "../../utils/queryUtils";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { getUser } from "../../utils/firebase/api";
import { Posts } from "../../utils/firebase/type";

const collection = new Collection();
let lastDoc;

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const { search, category } = query;
  let response: PostsResponse = { data: [], error: null };

  if (search || category) {
    // Search...
    response = await getPostsBySearch(search, category);
    lastDoc = response.lastDoc;
  } else {
    response = await getPostsForAnonymousUser();
  }

  //
  const items = collection.union(response.data, [category, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}
