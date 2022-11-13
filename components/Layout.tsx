import TopBar from "./TopBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../config/theme";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
`;
const Content = styled.div`
  margin-top: 80px;
  max-width: 800px;
`;

const Layout = ({ children, onSearch, propsTopbar, propsContent, ...rest }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root {...rest}>
        <TopBar className="top-bar" onSearch={onSearch} {...propsTopbar} />
        <Content className="content" {...propsContent}>
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
};

export default Layout;
