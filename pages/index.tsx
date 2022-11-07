
import { useInit } from "../utils/firebase"
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../config/theme';
import Head from "next/head";

export default function IndexPage(props) {
  
  const { isInitialized: isFirebaseInitialized } = useInit()
  const content = isFirebaseInitialized ? <Layout /> : <div/>
  
  return (<>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}><CssBaseline />
        {content}
    </ThemeProvider>
  </>);
}
