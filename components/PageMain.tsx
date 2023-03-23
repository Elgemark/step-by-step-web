import Layout from "../components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import Posts from "./posts/Posts";
import { FC, useEffect } from "react";
import { Posts as PostsType } from "../utils/firebase/type";
import { useScrolledToBottom } from "../utils/scrollUtils";

import FilterBar from "./FilterBar";

const PageMain: FC<{
  search: string;
  posts: PostsType;
  category: string;
  categories: Array<any>;
  title: string;
  enableLink: boolean;
}> = ({ posts = [], title, enableLink = false }) => {
  const isBottom = useScrolledToBottom(100);
  const router = useRouter();

  useEffect(() => {
    if (isBottom) {
      refreshData();
    }
  }, [isBottom]);

  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  return (
    <>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>{title}</title>
      </Head>
      <Layout>
        <FilterBar></FilterBar>
        <Posts enableLink={enableLink} posts={posts as PostsType} />
      </Layout>
    </>
  );
};

export default PageMain;
