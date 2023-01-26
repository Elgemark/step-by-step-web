import TopBar from "./TopBar";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext } from "react";
import { useMessages } from "../hooks/message";
import { Alert, Snackbar } from "@mui/material";
import { useTheme } from "@emotion/react";

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
`;

const Layout: FC<{
  propsTopbar?: Object;
  propsContent?: Object;
  children?: ReactNode;
}> = ({ children, propsTopbar, propsContent, ...props }) => {
  const theme = useTheme();
  const { messages, removeMessage } = useMessages();

  return (
    <Root theme={theme} {...props}>
      <TopBar className="top-bar" {...propsTopbar} />
      <Box className="content" {...propsContent}>
        {children}
      </Box>
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
