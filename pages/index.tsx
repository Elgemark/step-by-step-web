import { searchPosts, getPosts, deletePost, likePost } from "../utils/firebase/api";
import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";
import { PostsResponse } from "../utils/firebase/interface";

const queryOffset = 10;
let lastDoc;

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const queryLimit = query.limit || queryOffset;
  const category = query.category;
  const response: PostsResponse = tags.length
    ? await searchPosts(tags, category, lastDoc)
    : await getPosts("likes", queryLimit, lastDoc);
  lastDoc = response.lastDoc;
  return { props: { posts: response.data, search: tags, limit: queryLimit } };
}
