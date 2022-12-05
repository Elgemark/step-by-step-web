import TopBar from "./TopBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "../config/theme";
import styled from "styled-components";
import { FC, ReactNode } from "react";

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root {...props}>
        <TopBar className="top-bar" {...propsTopbar} />
        <Content className="content" {...propsContent}>
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
};

export default Layout;
