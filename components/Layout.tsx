import TopBar from "./TopBar";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext, useState } from "react";
import Messages from "./Messages";
import { Alert, Drawer, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import SideMenu from "./primitives/SideMenu";
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
  const theme = useTheme();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const isSignedId = signInCheckResult?.signedIn && user;

  return (
    <Root theme={theme} {...props}>
      {/* TOPBAR */}
      <TopBar onClickLogo={() => setShowSideMenu(true)} className="top-bar" {...propsTopbar} />
      <Box className="content" component="main" {...propsContent}>
        <Stack direction={"row"} justifyContent="center">
          <Alert className="info" severity="info" color="warning">
            This is site is under development. Please come back later!
          </Alert>
        </Stack>
        {children}
      </Box>
      {/* SIDEMENU */}
      <Drawer
        anchor={"left"}
        open={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        ModalProps={{ keepMounted: true }}
      >
        <SideMenu
          hrefFeed={isSignedId ? "/posts/user/" + user.uid : "/posts/"}
          hrefDiscover={"/posts/search/"}
          hrefLogin={!isSignedId ? "/login/" : null}
          hrefProfile={isSignedId ? "/profile/" : null}
          hrefBookmarks={isSignedId ? "/profile/" + user.uid + "/saved/" : null}
          hrefAbout={"/about/"}
          hrefReview={isSignedId && user?.roles?.includes("admin") ? "/admin/review" : null}
          onClose={() => setShowSideMenu(false)}
        />
      </Drawer>
      {/* SNACKBAR */}
      <Messages />
    </Root>
  );
};

export default Layout;
