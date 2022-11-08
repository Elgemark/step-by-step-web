import TopBar from "./TopBar"
import styled from "styled-components"

const Root = styled.div`
    display:flex;
    justify-content: center;
`

const Container = styled.div`
    max-width: 800px;
    background-color: #CCC;
`

const Layout = ({children,onSearch}) => {
    return <Root><Container><TopBar onSearch={onSearch}/>{children}</Container></Root>
}

export default Layout