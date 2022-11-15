import Head from "next/head";
import Avatar from "@mui/material/Avatar";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import Link from "next/link";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";

import Layout from "../../components/Layout";
import { useState } from "react";

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
  const [alias, setAlias] = useState(user?.displayName);
  return (
    <>
      <Head>
        <title>STEPS | Profile</title>
      </Head>
      <Layout>
        <Stack direction="column" gap={2}>
          <Avatar alt={user?.displayName} src={user?.photoURL}>
            {user?.displayName.charAt(0) || "A"}
          </Avatar>
          <Stack gap={2} direction="row">
            <TextField
              dense
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

  console.log("user", user);

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
