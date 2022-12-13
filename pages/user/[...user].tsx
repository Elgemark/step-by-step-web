import { getCreatedPosts, getFollows, useFollow } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
import UserCard from "../../components/UserCard";
import { FC, SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from "styled-components";
import { Divider, useTheme } from "@mui/material";
import ResponsiveGrid from "../../components/primitives/ResponsiveGrid";

const Users: FC<{ userIds: Array<string> }> = ({ userIds = [] }) => {
  if (!userIds.length) {
    return null;
  }

  <ResponsiveGrid>
    {userIds.map((userId) => (
      <UserCard key={`user-${userId}`} userId={userId} />
    ))}
  </ResponsiveGrid>;
};

const StyledLayout = styled(Layout)`
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .button-follow {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
  .tabs {
    margin: ${({ theme }) => theme.spacing(4)} 0;
  }
  .divider {
    width: 100%;
  }
`;

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Index = ({ posts, userIds, uid, tabValue }) => {
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
        <UserCard userId={uid} />
        {isFollowing ? (
          <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
            Unfollow
          </LoadingButton>
        ) : (
          <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
            Follow
          </LoadingButton>
        )}
        <Divider className="divider" />
        <Tabs className="tabs" value={tabValue} onChange={onTabChangehandle} aria-label="post tabs">
          <Tab label="Created" icon={<CreateIcon />} {...tabProps(1)} value="created" />
          <Tab label="Saved" icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
          <Tab label="Follows" icon={<AssistantDirectionIcon />} {...tabProps(2)} value="follows" />
        </Tabs>
        <Posts posts={posts} enableLink />
        <Users userIds={userIds} />
      </StyledLayout>
    </>
  );
};

export async function getServerSideProps(props) {
  const { query } = props;
  const uid = query.user[0];
  const tabValue = query.user[1] || "created";
  let posts = [];
  let userIds = [];
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
      userIds = follows.map((user) => user.id);
      posts = [];
      break;
  }
  //
  return {
    props: {
      uid,
      posts,
      userIds,
      tabValue,
    },
  };
}

export default Index;
