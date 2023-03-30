import { PostsResponse } from "../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import Collection from "../../classes/Collection";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { getCategories } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import FilterBar from "../../components/FilterBar";
import Posts from "../../components/posts/Posts";
import { Posts as PostsType } from "../../utils/firebase/type";

const collection = new Collection();
let lastDoc;

export async function getServerSideProps({ query }) {
  const { search, category, rated } = query;
  let response: PostsResponse = { data: [], error: null };

  const categories = await getCategories();

  if (search || category) {
    // Search...
    response = await getPostsBySearch(search, category);
  } else {
    response = await getPostsForAnonymousUser({ rated });
  }

  lastDoc = response.lastDoc;

  const items = collection
    .union(response.data, [category, search], () => {
      lastDoc = null;
    })
    // Filter by rated
    .filter((item) => (rated && item.ratesValue ? item.ratesValue >= rated : true));

  return { props: { posts: items, categories: categories.data } };
}

export default ({ posts }) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>STEPS</title>
      </Head>
      <Layout>
        <FilterBar></FilterBar>
        <Posts enableLink={true} posts={posts as PostsType} />
      </Layout>
    </FirebaseWrapper>
  </MUIWrapper>
);
