import Head from "next/head";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/ProfileCard";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Posts from "../../components/posts/Posts";

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
        <ProfileCard onTabChange={onTabChangehandle} tabValue={tabValue} />
        <Posts posts={posts} enableLink />
      </Layout>
    </>
  );
};

const LoggedOut = () => {
  return (
    <>
      <Head>
        <title>STEPS | Signed out!</title>
      </Head>
      <Layout>
        <Box sx={{ display: "flex" }}>
          <Link href="/login">Login</Link>
        </Box>
      </Layout>
    </>
  );
};

const Profile = (props) => {
  const [user, userLoading, userError] = useAuthState(getAuth());
  const [_, signOutLoading, signOutError] = useSignOut(getAuth());

  if (userLoading || signOutLoading) {
    return <Loading></Loading>;
  } else if (!user || userError || signOutError) {
    return <LoggedOut />;
  } else {
    return <LoggedIn {...props}></LoggedIn>;
  }
};

export default Profile;
