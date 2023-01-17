import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";
import { PostsResponse } from "../utils/firebase/interface";
import { limit, orderBy, startAfter, where } from "firebase/firestore";
import { getPostsByQuery } from "../utils/firebase/api/post";
import Collection from "../classes/Collection";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useDebouncedQuery } from "../utils/queryUtils";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { getUser } from "../utils/firebase/api";

const collection = new Collection();
let lastDoc;

export default function IndexPage(props) {
  const { set: setQuery } = useDebouncedQuery();
  const [user, isLoading] = useAuthState(getAuth());

  console.log("props", props);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setQuery({ user: user.uid });
      } else {
        setQuery({ user: "none" });
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const user = query.user;
  const tags = toSanitizedArray(query.search);
  const category = query.category;

  if (!user) {
    return { props: { posts: [], search: [] } };
  }

  let userProfile;
  // Build query...
  let postsQuery: Array<any> = [limit(10)];
  // postsQuery.push(orderBy("likes", "asc")); // NOT WORKING
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }

  if (category || tags.length) {
    // search...
    if (category) {
      postsQuery.push(where("category", "==", category));
    }
    if (tags.length) {
      postsQuery.push(where("tags", "array-contains-any", tags));
    }
  } else if (user !== "none") {
    // Personal query...
    userProfile = await getUser(user);
    if (userProfile?.data?.interests) {
      postsQuery.push(where("category", "in", userProfile.data.interests));
    }
  } else {
    // Anonymous query...
  }

  //
  const response: PostsResponse = await getPostsByQuery(postsQuery);
  lastDoc = response.lastDoc;
  //
  const items = collection.union(response.data, [category, ...tags], () => {
    lastDoc = null;
  });

  return { props: { posts: items, search: tags, interests: userProfile?.data?.interests } };
}
