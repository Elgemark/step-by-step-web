import { getCreatedPosts, getFollows, getUser, useFollow, useUser } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
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
import UserCard from "../../components/primitives/UserCard";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";

const UserCardControlled: FC<{ userId: string }> = styled(({ userId, ...props }) => {
  const router = useRouter();
  const { data: user } = useUser(userId);
  const onClickHandler = () => {
    router.push(`/user/${userId}`);
  };
  return <UserCard {...user} {...props} variant="small" onClick={onClickHandler} />;
})`
  cursor: pointer;
`;

const Users: FC<{ userIds: Array<string> }> = ({ userIds = [] }) => {
  return (
    <ResponsiveGrid>
      {userIds.map((userId) => (
        <UserCardControlled key={`user-${userId}`} userId={userId} />
      ))}
    </ResponsiveGrid>
  );
};

const StyledLayout = styled(Layout)`
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user-card {
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

const UserPage = ({ posts, user, userIds, uid, tabValue }) => {
  const router = useRouter();
  const theme = useTheme();

  // ToDo: isFollowing is not showinng correct if uid changes!
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
        <UserCard variant="big" className="user-card" {...user}>
          {isFollowing ? (
            <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
              Unfollow
            </LoadingButton>
          ) : (
            <LoadingButton className="button-follow" variant="contained" onClick={onFollowHandler} loading={isLoading}>
              Follow
            </LoadingButton>
          )}
        </UserCard>
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
  const userResp = await getUser(uid);
  const user = userResp.data;
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
      user,
      posts,
      userIds,
      tabValue,
    },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <UserPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
