import Head from "next/head";
import { Box, CircularProgress } from "@mui/material";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/ProfileCard";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Posts from "../../components/posts/Posts";
import { useEffect } from "react";

const Loading = () => {
  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      </Layout>
    </>
  );
};

const LoggedIn = ({ tabValue, uid, posts = [] }) => {
  const router = useRouter();

  const onTabChangehandle = (event: React.SyntheticEvent, newValue: string) => {
    router.push("/user/" + uid + "/" + newValue);
  };

  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <ProfileCard onTabChange={onTabChangehandle} tabValue={tabValue} userId={uid} />
        <Posts posts={posts} enableLink />
      </Layout>
    </>
  );
};

const User = (props) => {
  const [user, userLoading, userError] = useAuthState(getAuth());
  const [_, signOutLoading, signOutError] = useSignOut(getAuth());
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/");
    }
  }, [userLoading, user]);

  if (userLoading || signOutLoading) {
    return <Loading></Loading>;
  } else {
    return <LoggedIn {...props}></LoggedIn>;
  }
};

export default User;
