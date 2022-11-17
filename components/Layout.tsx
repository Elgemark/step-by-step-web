import TopBar from "./TopBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "../config/theme";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
`;
const Content = styled(Box)`
  margin: 80px 10px 0;
  /* max-width: 800px;
  width: 100%; */
`;

const Layout = ({ children, onSearch, propsTopbar, propsContent, ...rest }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root {...rest}>
        <TopBar className="top-bar" onSearch={onSearch} {...propsTopbar} />
        <Content className="content" sx={{ width: 1024, minHeight: 393 }} {...propsContent}>
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
};

export default Layout;
