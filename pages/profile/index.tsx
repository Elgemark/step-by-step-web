import Head from "next/head";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import Link from "next/link";
import Layout from "../../components/Layout";
import UserAvatar from "../../components/UserAvatar";
import ProfileCard from "../../components/ProfileCard";
import { useState } from "react";
import styled from "styled-components";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ReactNode } from "react";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
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

const Profile = ({ user, onChangeAlias }) => {
  const [signOut, signOutLoading, signOutError] = useSignOut(getAuth());
  const [alias, setAlias] = useState(user?.displayName || "Anonymous");
  // tab menu...
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <ProfileCard
          alias={alias}
          actions={
            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Favourites" {...tabProps(0)} />
              <Tab label="My Posts" {...tabProps(1)} />
              <Tab label="Completed Posts" {...tabProps(2)} />
              <Tab label="Uncompleted Posts" {...tabProps(3)} />
            </Tabs>
          }
        />
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

const LogIn = ({ res }) => {
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
    return <Profile user={user} onChangeAlias={onChangeAliasHandler}></Profile>;
  }
};

export default LogIn;
