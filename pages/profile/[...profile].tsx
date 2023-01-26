import { getCreatedPosts, getFollows, getPostsByState, getBookmarkedPosts, useUser } from "../../utils/firebase/api";
import { Divider, useTheme } from "@mui/material";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Posts from "../../components/posts/Posts";
import { useEffect, FC } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import styled from "styled-components";
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
  if (!userIds.length) {
    return null;
  }

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
    width: 100%;
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

const ProfilePage = ({ tabValue, uid, posts = [], userIds = [] }) => {
  const theme = useTheme();
  const [user, userLoading, userError] = useAuthState(getAuth());
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/");
    }
  }, [userLoading, user]);

  const onTabChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    router.push("/profile/" + uid + "/" + newValue);
  };

  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <StyledLayout theme={theme}>
        {/* LOGGED IN */}
        <ProfileCard userId={uid} />
        <Divider className="divider" />
        <Tabs className="tabs" value={tabValue} onChange={onTabChangeHandler} aria-label="tabs">
          <Tab label="Saved" icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
          <Tab label="Created" icon={<CreateIcon />} {...tabProps(1)} value="created" />
          <Tab label="Completed" icon={<CheckCircleIcon />} {...tabProps(2)} value="completed" />
          <Tab label="Incompleted" icon={<UnpublishedIcon />} {...tabProps(3)} value="incompleted" />
          <Tab label="Follows" icon={<AssistantDirectionIcon />} {...tabProps(4)} value="follows" />
        </Tabs>
        <Posts posts={posts} enableLink />
        <Users userIds={userIds} />
      </StyledLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const uid = query.profile[0];
  const tabValue = query.profile[1] || "saved";
  let posts = [];
  let userIds = [];
  switch (tabValue) {
    case "saved":
      const { posts: savedPosts } = await getBookmarkedPosts(uid);
      posts = savedPosts;
      break;
    case "created":
      const { posts: createdPosts } = await getCreatedPosts(uid);
      posts = createdPosts;
      break;
    case "completed":
      const { posts: completedPosts } = await getPostsByState(uid, "completed");
      posts = completedPosts;
      break;
    case "incompleted":
      const { posts: incompletedPosts } = await getPostsByState(uid, "incompleted");
      posts = incompletedPosts;
      break;
    case "follows":
      const { data: follows } = await getFollows(uid);
      userIds = follows.map((follow) => follow.id);
      break;
  }

  return { props: { tabValue, uid, posts, userIds } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <ProfilePage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
