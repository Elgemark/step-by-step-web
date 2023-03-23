import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { Posts as PostsType } from "../../../utils/firebase/type";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Posts from "../../../components/posts/Posts";
import FilterBar from "../../../components/FilterBar";

const collection = new Collection();
let lastDoc;

export async function getServerSideProps({ query }) {
  const { search, category } = query;
  let response: PostsResponse = { data: [], error: null };

  if (search || category) {
    // Search...
    response = await getPostsBySearch(search, { category });
  } else {
    response = await getPostsForAnonymousUser();
  }

  lastDoc = response.lastDoc;

  const items = collection.union(response.data, [category, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}

export default ({ posts }) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>{"STEPS | Search"}</title>
      </Head>
      <Layout>
        <FilterBar></FilterBar>
        <Posts enableLink={true} posts={posts as PostsType} />
      </Layout>
    </FirebaseWrapper>
  </MUIWrapper>
);
