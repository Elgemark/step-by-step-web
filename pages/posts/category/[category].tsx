import { getPostsBySearch } from "../../../utils/firebase/api/post";
import _ from "lodash";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import Layout from "../../../components/Layout";
import FilterBar from "../../../components/FilterBar";
import Posts from "../../../components/posts/Posts";
import { Posts as PostsType } from "../../../utils/firebase/type";
import SteppoHead from "../../../components/SteppoHead";
import { getCategory } from "../../../utils/firebase/api/categories";

export async function getServerSideProps({ query }) {
  const { category, search, rated } = query;

  const response = await getPostsBySearch(search, { category, rated });
  const items = response.data || [];

  const categoryResp = await getCategory(category);
  // extract meta
  const metaTags = categoryResp.data?.meta ? categoryResp.data?.meta["en-global"] : "";
  // extract descr
  const descr = categoryResp.data?.descr ? categoryResp.data?.descr["en-global"] : "";

  return {
    props: { posts: items, category, search: search || null, descr, metaTags },
  };
}

export default ({ posts, descr, metaTags }) => {
  return (
    <MUIWrapper>
      <FirebaseWrapper>
        <SteppoHead titleTags={metaTags} description={descr} />
        <Layout>
          <FilterBar></FilterBar>
          <Posts enableLink={true} posts={posts as PostsType} />
        </Layout>
      </FirebaseWrapper>
    </MUIWrapper>
  );
};
