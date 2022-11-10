import TopBar from "./TopBar";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../config/theme";

const Root = styled("div")(() => ({ display: "flex", justifyContent: "center" }));
const Content = styled("div")(() => ({ marginTop: "70px" }));

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
