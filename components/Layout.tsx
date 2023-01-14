import TopBar from "./TopBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { FC, ReactNode, createContext, useMemo, useState } from "react";
import { useUser } from "../utils/firebase/api";
import { useCurrentUser } from "../utils/firebase/api/user";
import { useMessages } from "../hooks/message";
import { Alert, Snackbar } from "@mui/material";
import ReportDialogContent from "./primitives/ReportDialogContent";
import MUIDialog from "@mui/material/Dialog";

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
  // const { data: user, save: saveUser, update: updateUser, isLoading: isLoadingUser } = useCurrentUser(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  // const mode: "dark" | "light" = (!isLoadingUser && user?.theme) || "dark";

  console.log("messages", messages);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        // if (user?.id) {
        //   saveUser({ theme: newMode });
        // } else {
        //   updateUser({ theme: newMode });
        // }
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
          {/* REPORT */}

          <MUIDialog open={messages.report} onClose={() => removeMessage("report")}>
            <ReportDialogContent onClickCancel={() => {}} onClickSend={() => {}} />
          </MUIDialog>
        </Root>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Layout;
