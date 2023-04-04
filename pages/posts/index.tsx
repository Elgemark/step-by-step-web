import { PostsResponse } from "../../utils/firebase/interface";
import { getPostsBySearch, getPostsForAnonymousUser } from "../../utils/firebase/api/post";
import Collection from "../../classes/Collection";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { getCategories } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import FilterBar from "../../components/FilterBar";
import Posts from "../../components/posts/Posts";
import { Posts as PostsType } from "../../utils/firebase/type";
import SteppoLogo from "../../components/primitives/SteppoLogo";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";
import Accordion from "../../components/primitives/Accordion";
import Loader from "../../components/Loader";

const Heading = styled(Paper)`
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  padding: 16px;
  margin-bottom: 16px;

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
  .logo {
    margin: 0 32px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 16px 0;
`;

const collection = new Collection();
let lastDoc;

export async function getServerSideProps({ query }) {
  const { search, category, rated } = query;
  let response: PostsResponse = { data: [], error: null };

  const categories = await getCategories();

  if (search || category) {
    // Search...
    response = await getPostsBySearch(search, category);
  } else {
    response = await getPostsForAnonymousUser({ rated });
  }

  lastDoc = response.lastDoc;

  const items = collection
    .union(response.data, [category, search], () => {
      lastDoc = null;
    })
    // Filter by rated
    .filter((item) => (rated && item.ratesValue ? item.ratesValue >= rated : true));

  return { props: { posts: items, categories: categories.data } };
}

export default ({ posts }) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>STEPS</title>
      </Head>

      <Layout>
        <FilterBar></FilterBar>
        <Heading>
          <LogoContainer>
            <SteppoLogo className="logo" />
          </LogoContainer>
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
                Creating Guides: Start by signing up and creating a profile. Click on "Create Guide" and begin adding
                your steps. You can include text and images to make it easy for others to follow. Add a list of
                prerequisites for completing the steps. This will help other users know what they need before starting
                the project. Once your guide is complete, hit "Publish" and it will be available for other users to view
                and use.
              </Typography>
            }
          </Accordion>
        </Heading>
        <Posts enableLink={true} posts={posts as PostsType} />
      </Layout>
    </FirebaseWrapper>
  </MUIWrapper>
);
