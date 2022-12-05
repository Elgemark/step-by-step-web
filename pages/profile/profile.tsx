import Head from "next/head";
import { Box, Button, CircularProgress, Typography, Stack, TextField } from "@mui/material";
import Link from "next/link";
import Layout from "../../components/Layout";
import UserAvatar from "../../components/UserAvatar";
import ProfileCard from "../../components/ProfileCard";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ReactNode } from "react";
import { useRouter } from "next/router";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: string;
  tabValue: string;
}

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

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

const LoggedIn = ({ user, onChangeAlias }) => {
  const router = useRouter();
  const [signOut, signOutLoading, signOutError] = useSignOut(getAuth());
  const [alias, setAlias] = useState(user?.displayName || "Anonymous");
  // tab menu...
  const [value, setValue] = useState("");

  const onTabChangehandle = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push("/profile/" + newValue, undefined, { shallow: true });
  };

  console.log("value", value);
  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <ProfileCard onTabChange={onTabChangehandle} tabValue={value} />
        <Stack direction="column" gap={2}>
          <UserAvatar />
          <Stack gap={2} direction="row">
            <TextField
              value={alias}
              placeholder="Change alias"
              onChange={(e) => {
                setAlias(e.currentTarget.value);
              }}
            ></TextField>
            <Button onClick={() => onChangeAlias(alias)}>Update</Button>
          </Stack>
          <Button onClick={signOut}>Sign out</Button>
        </Stack>
        <TabPanel value={value} tabValue="favourites" index={0}>
          Favourits
        </TabPanel>
        <TabPanel value={value} tabValue="my-posts" index={1}>
          My Posts
        </TabPanel>
        <TabPanel value={value} tabValue="completed-posts" index={2}>
          Completed Posts
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

const Profile = ({ res }) => {
  const [user, userLoading, userError] = useAuthState(getAuth());
  const [_, signOutLoading, signOutError] = useSignOut(getAuth());

  const onChangeAliasHandler = (newAlias) => {
    updateProfile(user, { displayName: newAlias });
  };

  if (userLoading || signOutLoading) {
    return <Loading></Loading>;
  } else if (!user || userError || signOutError) {
    return <LoggedOut />;
  } else {
    return <LoggedIn user={user} onChangeAlias={onChangeAliasHandler}></LoggedIn>;
  }
};

export default Profile;
