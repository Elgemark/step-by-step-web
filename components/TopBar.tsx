import { AppBar, Toolbar, Button, Typography, IconButton, Box, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import StepsLogo from "./primitives/StepsLogo";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useContext } from "react";
import { v4 as uuid } from "uuid";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "./Layout";

const TopBar: FC<{ className?: string; actions?: ReactNode }> = ({ className, actions, ...props }) => {
  const [user] = useAuthState(getAuth());
  const router = useRouter();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

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
        {/* SPACER */}
        <div style={{ flexGrow: 1 }}>{actions}</div>
        <Typography component="div" />

        {/* CREATE */}
        {user && (
          <Button
            color="inherit"
            onClick={() => {
              router.push("/create/" + uuid());
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
            color="inherit"
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
            <UserAvatar size={32} realtime />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
