import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";

const collection = new Collection();
let lastDoc;

export default function SearchPage(props) {
  console.log("categories", props.categories);
  return <PageMain {...props} title="STEPS" enableLink={true} />;
}

export async function getServerSideProps({ query }) {
  const { search, categories } = query;
  let response: PostsResponse = { data: [], error: null };

  if (search || categories) {
    // Search...
    response = await getPostsBySearch(search, { categories });
  } else {
    response = await getPostsForAnonymousUser();
  }

  lastDoc = response.lastDoc;

  const items = collection.union(response.data, [categories, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items, categories: JSON.stringify(categories || null) } };
}
