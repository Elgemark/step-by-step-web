import { getPostsBySearch } from "../../../utils/firebase/api/post";
import _ from "lodash";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { getCategories } from "../../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../../components/Layout";
import FilterBar from "../../../components/FilterBar";
import Posts from "../../../components/posts/Posts";

export async function getServerSideProps({ query }) {
  const { category, search } = query;

  const categories = await getCategories();

  const response = await getPostsBySearch(search, { category });

  const items = response.data || [];

  return {
    props: { posts: items, category, categories: categories.data.map((item) => item.value), search: search || null },
  };
}

export default ({ category, posts }) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>{"STEPS | " + _.capitalize(category)}</title>
      </Head>
      <Layout>
        <FilterBar></FilterBar>
        <Posts enableLink={true} posts={posts as PostsType} />
      </Layout>
    </FirebaseWrapper>
  </MUIWrapper>
);
