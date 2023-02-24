import { getFollows, getPostsByState, getBookmarkedPosts, useUser as fbUseUser } from "../../utils/firebase/api";
import { Divider, useTheme, Box, Chip, Stack } from "@mui/material";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
import { useEffect, FC, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GridViewIcon from "@mui/icons-material/GridView";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PublishIcon from "@mui/icons-material/Publish";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import styled from "styled-components";
import ResponsiveGrid from "../../components/primitives/ResponsiveGrid";
import UserCard from "../../components/primitives/UserCard";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { useUser } from "reactfire";
import { getReviewPosts, getDraftedPosts, getPublishedPosts, getCreatedPosts } from "../../utils/firebase/api/post";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TabContext, TabPanel } from "@mui/lab";
import FilterListIcon from "@mui/icons-material/FilterList";

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
    /* width: 100%; */
  }
  .tab-container {
    position: sticky;
    top: 70px;
    z-index: 1;
    backdrop-filter: blur(10px);
    border-radius: 20px;
  }
  .tabs {
    margin: ${({ theme }) => theme.spacing(4)} 0;
  }
  .MuiTab-root {
    min-width: 40px;
  }
  .MuiTabPanel-root {
    width: 100%;
    padding: 0;
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

const Filter: FC<{ onClick?: Function; values: Array<string>; selectedValue: string }> = ({
  onClick,
  values,
  selectedValue,
}) => {
  return (
    <Stack direction={"row"} spacing={1} sx={{ marginBottom: 1 }}>
      <FilterListIcon></FilterListIcon>
      {values.map((value) => (
        <Chip
          label={value}
          variant={value === selectedValue ? "filled" : "outlined"}
          clickable={Boolean(onClick)}
          onClick={() => onClick && onClick({ value })}
        />
      ))}
    </Stack>
  );
};

const TabPanelCompleted = ({ posts = [] }) => {
  return (
    <TabPanel value="completed" tabIndex={3}>
      <Filter values={["completed", "incomplete"]} selectedValue="completed"></Filter>
      <Posts posts={posts} enableLink />
    </TabPanel>
  );
};

const ProfilePage = ({ tabValue, filterValue, uid, posts = [], userIds = [] }) => {
  const theme = useTheme();
  const { status, data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && user === undefined) {
      router.replace("/");
    }
  }, [status, user]);

  const onTabChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    router.push("/profile/" + uid + "/" + newValue);
  };

  const onClickFilterHandler = ({ value }) => {
    router.push("/profile/" + uid + "/" + tabValue + "/" + value);
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

        <TabContext value={tabValue}>
          <div className="tab-container">
            <Tabs
              className="tabs"
              value={tabValue}
              onChange={onTabChangeHandler}
              aria-label="tabs"
              centered
              sx={{ width: "100%" }}
            >
              <Tab icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
              <Tab icon={<GridViewIcon />} {...tabProps(1)} value="published" />
              <Tab icon={<CreateIcon />} {...tabProps(2)} value="created" />
              {/* <Tab icon={<VisibilityIcon />} {...tabProps(3)} value="reviews" /> */}
              <Tab icon={<CheckCircleIcon />} {...tabProps(3)} value="completed" />
              {/* <Tab icon={<UnpublishedIcon />} {...tabProps(4)} value="incompleted" /> */}
              <Tab icon={<AssistantDirectionIcon />} {...tabProps(4)} value="follows" />
            </Tabs>
          </div>

          <TabPanel value="saved" tabIndex={0}>
            <Posts posts={posts} enableLink />
          </TabPanel>
          <TabPanel value="published" tabIndex={1}>
            <Posts posts={posts} enableLink />
          </TabPanel>
          <TabPanel value="created" tabIndex={2}>
            <Posts posts={posts} enableLink />
          </TabPanel>
          <TabPanel value="completed" tabIndex={3}>
            <Filter
              values={["completed", "incomplete"]}
              selectedValue={filterValue}
              onClick={onClickFilterHandler}
            ></Filter>
            <Posts posts={posts} enableLink />
          </TabPanel>
          <TabPanel value="follows" tabIndex={4}>
            <Users userIds={userIds} />
          </TabPanel>
        </TabContext>
      </StyledLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const uid = query.profile[0];
  const tabValue = query.profile[1] || "saved";
  let filterValue = query.profile[2] || null;
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
    case "created":
      const visibility = filterValue || "published";
      const { posts: draftedPosts } = await getCreatedPosts(uid, filterValue || visibility);
      posts = draftedPosts;
      break;
    case "completed":
      const status = filterValue || "completed";
      const { posts: completedPosts } = await getPostsByState(uid, status);
      posts = completedPosts;
      break;
    case "follows":
      const { data: follows } = await getFollows(uid);
      userIds = follows.map((follow) => follow.id);
      break;
  }

  return { props: { tabValue, filterValue, uid, posts, userIds } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <ProfilePage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
