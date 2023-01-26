import TopBar from "./TopBar";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext, useMemo, useState } from "react";
import { useUser } from "../utils/firebase/api";
import { useCurrentUser } from "../utils/firebase/api/user";
import { useMessages } from "../hooks/message";
import { Alert, Snackbar } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const Root = styled.div`
  display: flex;
  justify-content: center;
  .firebaseui-card-content:nth-child(1) {
    display: none;
  }
`;
const Content = styled(Box)`
  margin: 62px 10px 0;
  width: 1024px;
  @media (min-width: 600px) {
    margin: 74px 10px 0;
  }
`;

const Layout: FC<{
  propsTopbar?: Object;
  propsContent?: Object;
  children?: ReactNode;
}> = ({ children, propsTopbar, propsContent, ...props }) => {
  const { messages, removeMessage } = useMessages();

  return (
    <Root {...props}>
      <TopBar className="top-bar" {...propsTopbar} />
      <Content className="content" {...propsContent}>
        {children}
      </Content>
      {/* SNACKBAR */}
      <Snackbar open={messages.alert} autoHideDuration={6000} onClose={() => removeMessage("alert")}>
        <Alert onClose={() => removeMessage("alert")} severity="success" sx={{ width: "100%" }}>
          {messages.alert?.message}
        </Alert>
      </Snackbar>
    </Root>
  );
};

export default Layout;
