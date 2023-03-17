import Layout from "../components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import Posts from "./posts/Posts";
import { FC, useEffect } from "react";
import { Posts as PostsType } from "../utils/firebase/type";
import { useScrolledToBottom } from "../utils/scrollUtils";
import SelectChips from "./primitives/SelectChips";
import styled from "styled-components";
import { Divider } from "@mui/material";
import { getQuery } from "../utils/queryUtils";

const StyledDivider = styled(Divider)`
  margin-bottom: 2rem;
`;

const PageMain: FC<{
  search: string;
  posts: PostsType;
  category: string;
  categories: Array<any>;
  title: string;
  enableLink: boolean;
}> = ({ posts = [], title, categories, category, enableLink = false }) => {
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

  const onSelectCategoryHandler = (selectedCategory) => {
    router.push({ pathname: "/posts/category/" + selectedCategory, query: getQuery() });
  };

  return (
    <>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>{title}</title>
      </Head>
      <Layout>
        {categories ? (
          <>
            <nav>
              <SelectChips
                items={categories}
                selectedItems={[category]}
                onSelect={onSelectCategoryHandler}
                justifyContent="center"
              />
            </nav>
            <StyledDivider />
          </>
        ) : null}
        <Posts enableLink={enableLink} posts={posts as PostsType} />
      </Layout>
    </>
  );
};

export default PageMain;
