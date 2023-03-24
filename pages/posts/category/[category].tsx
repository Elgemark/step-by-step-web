import { getPostsBySearch } from "../../../utils/firebase/api/post";
import _ from "lodash";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import Head from "next/head";
import Layout from "../../../components/Layout";
import FilterBar from "../../../components/FilterBar";
import Posts from "../../../components/posts/Posts";
import { Posts as PostsType } from "../../../utils/firebase/type";

export async function getServerSideProps({ query }) {
  const { category, search, rated } = query;

  const response = await getPostsBySearch(search, { category, rated });
  const items = response.data || [];

  return {
    props: { posts: items, category, search: search || null },
  };
}

export default ({ category, posts }) => {
  return (
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
};
