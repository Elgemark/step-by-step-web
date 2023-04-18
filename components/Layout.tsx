import TopBar from "./TopBar";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext, useState } from "react";
import Messages, { useMessages } from "./Messages";
import { Alert, Drawer, Snackbar, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import SideMenu from "./primitives/SideMenu";
import { useRouter } from "next/router";
import { useUser } from "../utils/firebase/api/user";
import { useSigninCheck } from "reactfire";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const Root = styled.div`
  display: flex;
  justify-content: center;
  .firebaseui-card-content:nth-child(1) {
    display: none;
  }
  .content {
    margin-top: 68px;
    width: 1024px;
    padding: 0 ${({ theme }) => theme.spacing(1)};
    @media (min-width: 1024px) {
      padding: 0 ${({ theme }) => theme.spacing(2)};
    }
    @media (min-width: 600px) {
      margin: 74px 0;
    }
  }
  .info {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const Layout: FC<{
  propsTopbar?: Object;
  propsContent?: Object;
  children?: ReactNode;
}> = ({ children, propsTopbar, propsContent, ...props }) => {
  const { data: user } = useUser();
  const { data: signInCheckResult } = useSigninCheck();

  const router = useRouter();
  const theme = useTheme();
  const { messages, removeMessage } = useMessages();
  const [showSideMenu, setShowSideMenu] = useState(false);

  const isSignedId = signInCheckResult?.signedIn && user;

  return (
    <Root theme={theme} {...props}>
      {/* TOPBAR */}
      <TopBar onClickLogo={() => setShowSideMenu(true)} className="top-bar" {...propsTopbar} />
      <Box className="content" {...propsContent}>
        {/* <Stack direction={"row"} justifyContent="center">
          <Alert className="info" severity="info" color="warning">
            This is site is under development. Please come back later!
          </Alert>
        </Stack> */}
        {children}
      </Box>
      {/* SIDEMENU */}
      <Drawer anchor={"left"} open={showSideMenu} onClose={() => setShowSideMenu(false)}>
        <SideMenu
          onClose={() => setShowSideMenu(false)}
          onClickFeed={() => {
            if (isSignedId) {
              router.push("/posts/user/" + user.uid);
            } else {
              router.push("/posts/");
            }
          }}
          onClickSearch={() => {
            router.push("/posts/search/");
          }}
          onClickLogin={
            !isSignedId &&
            (() => {
              router.push("/login/");
            })
          }
          onClickProfile={
            isSignedId &&
            (() => {
              router.push("/profile/" + user.uid);
            })
          }
          onClickBookmarks={
            isSignedId &&
            (() => {
              router.push("/profile/" + user.uid + "/saved/");
            })
          }
          onClickReview={
            isSignedId &&
            user?.roles?.includes("admin") &&
            (() => {
              router.push("/admin/review");
            })
          }
        />
      </Drawer>
      {/* SNACKBAR */}
      <Messages />
    </Root>
  );
};

export default Layout;
