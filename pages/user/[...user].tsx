import { getCreatedPosts, useFollow } from "../../utils/firebase/api";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Posts from "../../components/posts/Posts";
import UserCard from "../../components/UserCard";
import { SyntheticEvent } from "react";

const Index = ({ posts, uid, tabValue }) => {
  const router = useRouter();
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
      <Layout>
        <UserCard
          onTabChange={onTabChangehandle}
          userId={uid}
          tabValue={tabValue}
          onFollow={onFollowHandler}
          onUnfollow={onFollowHandler}
          isFollowing={isFollowing}
          loadingFollower={isLoading}
        />
        <Posts posts={posts} enableLink />
      </Layout>
    </>
  );
};

export async function getServerSideProps(props) {
  const { query } = props;
  const uid = query.user[0];
  const tabValue = query.user[1] || "created";
  let posts = [];
  switch (tabValue) {
    case "created":
      const { posts: createdPosts } = await getCreatedPosts(uid);
      posts = createdPosts;
      break;
    case "saved":
      posts = [];
      break;
    case "follows":
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
