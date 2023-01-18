import { AppBar, Toolbar, Button, Typography, IconButton, Box, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import StepsLogo from "./primitives/StepsLogo";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "./Layout";
import Search from "./primitives/Search";
import styled from "styled-components";

const TopBar: FC<{ className?: string; actions?: ReactNode; search?: string }> = ({
  className,
  actions,
  search,
  ...props
}) => {
  const [user] = useAuthState(getAuth());
  const router = useRouter();
  const [searchStr, setSearchStr] = useState();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const onSearchEnterHandler = () => {
    router.push({ pathname: "/posts/search/", query: { search: searchStr } });
  };

  return (
    <AppBar {...props}>
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => {
            router.push("/");
          }}
        >
          <StepsLogo width={100}></StepsLogo>
        </Button>
        {/* SEARCH */}
        <Search
          onEnter={onSearchEnterHandler}
          onChange={(e) => setSearchStr(e.currentTarget.value)}
          value={search}
        ></Search>
        {/* CREATE */}
        {user && (
          <Button
            size="small"
            startIcon={<CreateIcon />}
            variant="contained"
            onClick={() => {
              router.push("/create/" + uuid()).then(() => {
                router.reload();
              });
            }}
          >
            Create
          </Button>
        )}
        {/* THEME */}
        {/* <IconButton size="small" onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="12px" /> : <Brightness4Icon fontSize="12px" />}
        </IconButton> */}
        {/* LOGIN */}
        {!user && (
          <Button
            size="small"
            startIcon={<LoginIcon />}
            variant="contained"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
        )}
        {/* PROFILE */}
        {user && (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            onClick={() => {
              router.push("/profile/" + user.uid);
            }}
            color="inherit"
          >
            <UserAvatar size={36} realtime />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
