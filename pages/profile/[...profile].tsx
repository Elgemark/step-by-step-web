import { getFollows, getPostsByState, getBookmarkedPosts, useUser as fbUseUser } from "../../utils/firebase/api";
import { Divider, useTheme } from "@mui/material";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
import { useEffect, FC } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PublishIcon from "@mui/icons-material/Publish";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import styled from "styled-components";
import ResponsiveGrid from "../../components/primitives/ResponsiveGrid";
import UserCard from "../../components/primitives/UserCard";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { useUser } from "reactfire";
import { getAuditPosts, getDraftedPosts, getPublishedPosts } from "../../utils/firebase/api/post";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UserCardControlled: FC<{ userId: string }> = styled(({ userId, ...props }) => {
  const router = useRouter();
  const { data: user } = fbUseUser(userId);
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

  const { status, data: user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && user === undefined) {
      router.replace("/");
    }
  }, [status, user]);

  console.log({ status, user });

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
          <Tab label="Published" icon={<PublishIcon />} {...tabProps(1)} value="published" />
          <Tab label="Drafts" icon={<CreateIcon />} {...tabProps(2)} value="drafts" />
          <Tab label="Reviews" icon={<VisibilityIcon />} {...tabProps(3)} value="audits" />
          <Tab label="Completed" icon={<CheckCircleIcon />} {...tabProps(4)} value="completed" />
          <Tab label="Incompleted" icon={<UnpublishedIcon />} {...tabProps(5)} value="incompleted" />
          <Tab label="Follows" icon={<AssistantDirectionIcon />} {...tabProps(6)} value="follows" />
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
    case "published":
      const { posts: createdPosts } = await getPublishedPosts(uid);
      posts = createdPosts;
      break;
    case "drafts":
      const { posts: draftedPosts } = await getDraftedPosts(uid);
      posts = draftedPosts;
      break;
    case "audits":
      const { posts: auditPosts } = await getAuditPosts(uid);
      posts = auditPosts;
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
