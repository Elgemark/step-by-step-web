import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";
import { PostsResponse } from "../utils/firebase/interface";
import { limit, orderBy, startAfter, where } from "firebase/firestore";
import { getPostsByQuery } from "../utils/firebase/api/post";

let lastDoc;

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const category = query.category;

  // Build query...
  let postsQuery = [orderBy("likes", "desc"), limit(10)];
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

  //
  const response: PostsResponse = await getPostsByQuery(postsQuery);
  lastDoc = response.lastDoc;
  return { props: { posts: response.data, search: tags } };
}
