import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsBySearch } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { Posts as PostsType } from "../../../utils/firebase/type";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Posts from "../../../components/posts/Posts";
import FilterBar from "../../../components/FilterBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCollection } from "../../../utils/collectionUtils";

export default () => {
  const router = useRouter();
  const { collection: posts, addItems: addPosts, replaceItems: replacePosts } = useCollection();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    console.log("query", router.query);
    fetchBySearch(true);
  }, [router.query]);

  const fetchBySearch = async (replace = false) => {
    setIsFetching(true);
    const { search, category, rated } = router.query;
    const response = await getPostsBySearch(search, { category, rated });
    if (replace) {
      replacePosts(response.data);
    } else {
      addPosts(response.data);
    }

    setIsFetching(false);
  };

  return (
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
};
