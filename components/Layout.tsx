import TopBar from "./TopBar";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext, useState } from "react";
import { useMessages } from "../hooks/message";
import { Alert, Drawer, Snackbar, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import SideMenu from "./primitives/SideMenu";
import { useRouter } from "next/router";
import { useUser } from "../utils/firebase/api/user";

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
    @media (min-width: 600px) {
      margin: 74px ${({ theme }) => theme.spacing(1)};
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
  const router = useRouter();
  const theme = useTheme();
  const { messages, removeMessage } = useMessages();
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <Root theme={theme} {...props}>
      {/* TOPBAR */}
      <TopBar onClickLogo={() => setShowSideMenu(true)} className="top-bar" {...propsTopbar} />
      <Box className="content" {...propsContent}>
        <Stack direction={"row"} justifyContent="center">
          <Alert className="info" severity="info" color="warning">
            This is site is under development. Please come back later!
          </Alert>
        </Stack>
        {children}
      </Box>
      {/* SIDEMENU */}
      <Drawer anchor={"left"} open={showSideMenu} onClose={() => setShowSideMenu(false)}>
        <SideMenu
          onClose={() => setShowSideMenu(false)}
          onClickFeed={() => {
            if (user) {
              router.push("/posts/user/" + user.uid);
            } else {
              router.push("/posts/");
            }
          }}
          onClickSearch={() => {
            router.push("/posts/search/");
          }}
          onClickLogin={
            !user &&
            (() => {
              router.push("/login/");
            })
          }
          onClickProfile={
            user &&
            (() => {
              router.push("/profile/" + user.uid);
            })
          }
          onClickBookmarks={
            user &&
            (() => {
              router.push("/profile/" + user.uid + "/saved/");
            })
          }
        />
      </Drawer>
      {/* SNACKBAR */}
      <Snackbar open={messages.alert} autoHideDuration={6000} onClose={() => removeMessage("alert")}>
        <Alert
          onClose={() => {
            removeMessage("alert");
            messages.alert?.onRemove();
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          {messages.alert?.message}
        </Alert>
      </Snackbar>
    </Root>
  );
};

export default Layout;
