import { getCreatedPosts, getFollows, useFollow } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
import UserCard from "../../components/UserCard";
import { SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from "styled-components";
import { useTheme } from "@mui/material";

const StyledLayout = styled(Layout)`
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tabs {
    margin: ${({ theme }) => theme.spacing(4)};
  }
`;

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Index = ({ posts, uid, tabValue }) => {
  const router = useRouter();
  const theme = useTheme();
  const { isFollowing, toggle, isLoading } = useFollow(uid);

  const onTabChangehandle = (event: SyntheticEvent, newValue: string) => {
    router.push("/user/" + uid + "/" + newValue);
  };

  const onFollowHandler = () => {
    toggle(uid);
  };

  return (
    <>
      <Head>
        <title>STEPS | User</title>
      </Head>
      <StyledLayout theme={theme}>
        <UserCard
          userId={uid}
          onFollow={onFollowHandler}
          onUnfollow={onFollowHandler}
          isFollowing={isFollowing}
          loadingFollower={isLoading}
        />
        {isFollowing ? (
          <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
            Unfollow
          </LoadingButton>
        ) : (
          <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
            Follow
          </LoadingButton>
        )}
        <Tabs className="tabs" value={tabValue} onChange={onTabChangehandle} aria-label="post tabs">
          <Tab label="Created" icon={<CreateIcon />} {...tabProps(1)} value="created" />
          <Tab label="Saved" icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
          <Tab label="Follows" icon={<AssistantDirectionIcon />} {...tabProps(2)} value="follows" />
        </Tabs>
        <Posts posts={posts} enableLink />
      </StyledLayout>
    </>
  );
};

export async function getServerSideProps(props) {
  const { query } = props;
  const uid = query.user[0];
  const tabValue = query.user[1] || "created";
  let posts = [];
  let users = [];
  switch (tabValue) {
    case "created":
      const { posts: createdPosts } = await getCreatedPosts(uid);
      posts = createdPosts;
      break;
    case "saved":
      posts = [];
      break;
    case "follows":
      const { data: follows } = await getFollows(uid);
      users = follows;
      posts = [];
      break;
  }
  //
  return {
    props: {
      uid,
      posts,
      tabValue,
    },
  };
}

export default Index;
