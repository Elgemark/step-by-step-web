import { searchPosts, getPosts, deletePost, likePost } from "../utils/firebase/api";
import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const category = query.category;
  const posts = tags.length ? await searchPosts(tags, category) : await getPosts();
  return { props: { posts, search: tags } };
}
