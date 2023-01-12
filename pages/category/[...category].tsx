import { getPostsByQuery } from "../../utils/firebase/api/post";
import { toSanitizedArray } from "../../utils/stringUtils";
import PageMain from "../../components/PageMain";
import _ from "lodash";
import { PostsResponse } from "../../utils/firebase/interface";
import { limit, startAfter, where, orderBy } from "firebase/firestore";
import { useEffect } from "react";
import Collection from "../../classes/Collection";

const collection = new Collection();
let lastDoc;

export default function CategoryPage(props) {
  const { category } = props;
  return <PageMain {...props} title={"STEPS | " + _.capitalize(category)} enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const category = query.category[0];

  // Build query...
  let postsQuery = [limit(10)];
  // postsQuery.push(orderBy("likes", "asc")); // NOT WORKING
  if (lastDoc) {
    postsQuery.push(startAfter(lastDoc));
  }
  // search
  if (category) {
    postsQuery.push(where("category", "==", category));
  }
  if (tags.length) {
    postsQuery.push(where("tags", "array-contains-any", tags));
  }

  const response: PostsResponse = await getPostsByQuery(postsQuery);
  lastDoc = response.lastDoc;
  //
  const items = collection.union(response.data, [category, ...tags], () => {
    lastDoc = null;
  });

  return { props: { posts: items, search: tags, category } };
}
