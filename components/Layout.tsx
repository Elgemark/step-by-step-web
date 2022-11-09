import TopBar from "./TopBar"
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "../config/theme";


const Root = styled("div")(() => ({ display: "flex", justifyContent: "center" }));
const Content = styled(Container)(() => ({ marginTop:"70px"}));



const Layout = ({children,onSearch}) => {
    return <ThemeProvider theme={theme}><CssBaseline /><Root><TopBar onSearch={onSearch}/><Content>{children}</Content></Root></ThemeProvider>
}

export default Layout