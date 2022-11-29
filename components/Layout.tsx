import TopBar from "./TopBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "../config/theme";
import styled from "styled-components";
import { FC } from "react";

const Root = styled.div`
  display: flex;
  justify-content: center;
`;
const Content = styled(Box)`
  margin: 80px 10px 0;
  width: 1024px;
`;

const Layout: FC<{ children: any; onSearch: Function | undefined; propsTopbar: Object; propsContent: Object }> = ({
  children,
  onSearch,
  propsTopbar,
  propsContent,
  ...rest
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root {...rest}>
        <TopBar className="top-bar" {...propsTopbar} />
        <Content className="content" {...propsContent}>
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
};

export default Layout;
