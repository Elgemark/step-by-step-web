import { PostsResponse } from "../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import Collection from "../../classes/Collection";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { getCategories } from "../../utils/firebase/api";
import Layout from "../../components/Layout";
import FilterBar from "../../components/FilterBar";
import Posts from "../../components/posts/Posts";
import { Posts as PostsType } from "../../utils/firebase/type";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";
import Accordion from "../../components/primitives/Accordion";
import { useTheme } from "@emotion/react";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import SteppoHead from "../../components/SteppoHead";
import { useCollection } from "../../utils/collectionUtils";
import { useEffect, useState } from "react";
import { useScrolledToBottom } from "../../utils/scrollUtils";

const LIMIT = 5;

type FetchResponse = {
  hasMorePosts: boolean;
  posts: PostsType;
};

const HeadingRoot = styled(Paper)`
  ${backgroundBlurMixin}
  padding: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  @media (min-width: 600px) {
    margin-top: ${({ theme }) => theme.spacing(12)};
  }

  .header-container {
    width: 100%;
    position: relative;
  }
  .header {
    width: 90%;
  }

  .ingresse {
    margin-bottom: 32px;
  }
`;

const Heading = () => {
  const theme = useTheme();

  return (
    <HeadingRoot theme={theme}>
      <Accordion
        summary={
          <div className="header-container">
            <Typography className="header" variant="h6">
              Welcome to Steppo! The step-by-step instructions app where you can easily create and share your DIY
              projects and tutorials!
            </Typography>
          </div>
        }
        elevation={0}
      >
        {
          <Typography variant="body2">
            Creating Guides: Start by signing up and creating a profile. Click on "Create Guide" and begin adding your
            steps. You can include text and images to make it easy for others to follow. Add a list of prerequisites for
            completing the steps. This will help other users know what they need before starting the project. Once your
            guide is complete, hit "Publish" and it will be available for other users to view and use.
          </Typography>
        }
      </Accordion>
    </HeadingRoot>
  );
};
export default () => {
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
          <LogoResponsive />
          <FilterBar enableRate={false} />
          <Heading></Heading>
          <Posts enableLink={true} posts={posts as PostsType} />
        </Layout>
      </FirebaseWrapper>
    </MUIWrapper>
  );
};
