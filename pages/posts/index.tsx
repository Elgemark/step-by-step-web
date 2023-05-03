import { getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import Layout from "../../components/Layout";
import FilterBar from "../../components/FilterBar";
import Posts from "../../components/posts/Posts";
import { Posts as PostsType } from "../../utils/firebase/type";
import { Button, ButtonGroup, Paper, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import { useCollection } from "../../utils/collectionUtils";
import { FC, useEffect, useState } from "react";
import { useScrolledToBottom } from "../../utils/scrollUtils";
import Article from "../../components/primitives/Article";
import { getJSON } from "../../utils/ssrUtils";
import { useGetTexts } from "../../utils/localizationUtils";

const LIMIT = 5;

type FetchResponse = {
  hasMorePosts: boolean;
  posts: PostsType;
};

const StyledArticle = styled(Article)`
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  .article-content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .MuiButtonGroup-root {
    align-self: center;
    margin: ${({ theme }) => `${theme.spacing(2)} 0`};
  }
`;

const Header: FC<{ texts: object }> = ({ texts }) => {
  const theme = useTheme();
  const { texts: locTexts } = useGetTexts(texts);

  return (
    <StyledArticle avatar={"/images/steppo_avatar.png"} theme={theme}>
      <LogoResponsive></LogoResponsive>
      <Typography className="header">{locTexts.body}</Typography>
      <ButtonGroup variant="text">
        <Button href="/about">{locTexts.readMore}</Button>
      </ButtonGroup>
    </StyledArticle>
  );
};

export async function getStaticProps() {
  const jsonData = await getJSON("hosting/public/texts/pages/home.json");
  return {
    props: { texts: jsonData },
  };
}

export default ({ texts }) => {
  const isBottom = useScrolledToBottom(100);
  const [isFetching, setIsFetching] = useState(false);
  const { collection: posts, addItems: addPosts } = useCollection();
  const [lastDocByAnonymousUser, setLastDocByAnonymousUser] = useState();
  const [hasMorePostsByAnonymousUser, setHasMorePostsByAnonymousUser] = useState(true);

  const fetchPostForAnonymousUser = async () => {
    if (!hasMorePostsByAnonymousUser) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostsForAnonymousUser({}, LIMIT, lastDocByAnonymousUser);
    addPosts(response.data);
    setLastDocByAnonymousUser(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByAnonymousUser(hasMorePosts);
    console.log("fetch by anonymous user", hasMorePosts);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPosts = async () => {
    console.log("fetchPosts");
    setIsFetching(true);
    let resp: FetchResponse = { hasMorePosts: false, posts: [] };

    if (!resp.posts.length) {
      resp = await fetchPostForAnonymousUser();
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (isBottom) {
      !isFetching && fetchPosts();
    }
  }, [isBottom]);

  return (
    <MUIWrapper>
      <FirebaseWrapper>
        <SteppoHead
          title="Create and share your step by step instruction guides!"
          titleTags="DIY, Share, follow and rate creators and topics"
          description="Steppo is an app for creating and sharing step by step instructions and guides."
          image="/images/steppo_landing_page.jpg"
        />
        <Layout>
          <Header texts={texts} />
          <FilterBar enableRate={false} />
          <Posts enableLink={true} posts={posts as PostsType} />
        </Layout>
      </FirebaseWrapper>
    </MUIWrapper>
  );
};
