import { AppBar, Toolbar, Button, Typography, IconButton, Box } from "@mui/material";
import { useRouter } from "next/router";
import StepsLogo from "./primitives/StepsLogo";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import UserAvatar from "./UserAvatar";

const TopBar = ({ actions }) => {
  const [user, loading, error] = useAuthState(getAuth());
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => {
            router.push("/");
          }}
        >
          <StepsLogo width={100}></StepsLogo>
        </Button>
        <Typography component="div" />
        {/* Actions */}
        <Box sx={{ flexGrow: 1 }}>{actions}</Box>
        {/* CREATE */}
        {user && (
          <Button
            color="inherit"
            onClick={() => {
              router.push("/create");
            }}
          >
            Create
          </Button>
        )}
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
              router.push("/profile");
            }}
            color="inherit"
          >
            <UserAvatar size={32} />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
