import TopBar from "./TopBar"
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";

const Root = styled("div")(() => ({ display: "flex", justifyContent: "center" }));
const Content = styled(Container)(() => ({ marginTop:"70px"}));



const Layout = ({children,onSearch}) => {
    return <Root><TopBar onSearch={onSearch}/><Content>{children}</Content></Root>
}

export default Layout