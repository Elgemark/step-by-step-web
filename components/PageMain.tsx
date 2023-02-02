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
    router.push("/posts/category/" + selectedCategory);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
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
