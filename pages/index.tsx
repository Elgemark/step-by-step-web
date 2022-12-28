import { searchPosts, getPosts, deletePost, likePost } from "../utils/firebase/api";
import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";

const queryOffset = 3;

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const queryLimit = query.limit || queryOffset;
  const category = query.category;
  const posts = tags.length
    ? await searchPosts(tags, category)
    : await getPosts("likes", queryLimit - queryOffset, queryLimit);
  return { props: { posts, search: tags, limit: queryLimit } };
}
