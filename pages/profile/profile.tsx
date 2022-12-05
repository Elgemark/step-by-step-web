import Head from "next/head";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import Layout from "../../components/Layout";
import ProfileCard from "../../components/ProfileCard";
import { ReactNode } from "react";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: string;
  tabValue: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== tabValue}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === tabValue && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

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

const LoggedIn = ({ user, tabValue, onChangeAlias }) => {
  const router = useRouter();

  const onTabChangehandle = (event: React.SyntheticEvent, newValue: string) => {
    router.push("/profile/" + newValue);
  };

  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <ProfileCard onTabChange={onTabChangehandle} tabValue={tabValue} />
        <TabPanel value={tabValue} tabValue="saved" index={0}>
          Saved
        </TabPanel>
        <TabPanel value={tabValue} tabValue="created" index={1}>
          Created
        </TabPanel>
        <TabPanel value={tabValue} tabValue="completed" index={2}>
          Completed Posts
        </TabPanel>
        <TabPanel value={tabValue} tabValue="incompleted" index={2}>
          Incompleted Posts
        </TabPanel>
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
