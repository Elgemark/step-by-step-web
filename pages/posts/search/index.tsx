import { getPostsBySearch } from "../../../utils/firebase/api/post";
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
import { useScrolledToBottom } from "../../../utils/scrollUtils";
import SteppoHead from "../../../components/SteppoHead";

export default () => {
  const router = useRouter();
  const { collection: posts, addItems: addPosts, replaceItems: replacePosts } = useCollection();
  const [lastDoc, setLastDoc] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const isBottom = useScrolledToBottom(100);

  useEffect(() => {
    fetchBySearch(true);
  }, [router.query]);

  useEffect(() => {
    fetchBySearch(false);
  }, [isBottom]);

  const fetchBySearch = async (replace = false) => {
    setIsFetching(true);
    const { search, category, rated } = router.query;
    const response = await getPostsBySearch(search, { category, rated }, 10, lastDoc);
    if (replace) {
      replacePosts(response.data);
    } else {
      addPosts(response.data);
    }

    setLastDoc(response.lastDoc);

    setIsFetching(false);
  };

  return (
    <MUIWrapper>
      <FirebaseWrapper>
        <SteppoHead
          title="Explore"
          description={"Steppo search page. Search step by step instruction or guides by category or rating."}
        />
        <Layout>
          <FilterBar></FilterBar>
          <Posts enableLink={true} posts={posts as PostsType} />
        </Layout>
      </FirebaseWrapper>
    </MUIWrapper>
  );
};
