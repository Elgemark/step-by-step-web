import PageMain from "../../components/PageMain";
import { PostsResponse } from "../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import Collection from "../../classes/Collection";
import FirebaseWrapper from "../../components/FirebaseWrapper";

const collection = new Collection();
let lastDoc;

export default function IndexPage(props) {
  return (
    <FirebaseWrapper>
      <PageMain {...props} title="STEPS" enableLink={true} />
    </FirebaseWrapper>
  );
}

export async function getServerSideProps({ query }) {
  const { search, category } = query;
  let response: PostsResponse = { data: [], error: null };

  if (search || category) {
    // Search...
    response = await getPostsBySearch(search, category);
  } else {
    response = await getPostsForAnonymousUser();
  }

  lastDoc = response.lastDoc;

  const items = collection.union(response.data, [category, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}
