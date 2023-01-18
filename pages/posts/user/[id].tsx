import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser, getPostsForUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";

const collection = new Collection();
let lastDoc;

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  let response: PostsResponse = { data: [], error: null };

  response = await getPostsForUser(id);

  //response = await getPostsForAnonymousUser();

  //
  const items = collection.union(response.data, [], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}
