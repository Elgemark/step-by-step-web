import TopBar from "./TopBar"
import styled from "styled-components"
import Head from "next/head"

const Root = styled.div`
    display:flex;
    justify-content: center;
`

const Container = styled.div`
    max-width: 800px;
    background-color: #CCC;
`

const Layout = ({children}) => {
    return <Root><Container><TopBar/>{children}</Container></Root>
}

export default Layout