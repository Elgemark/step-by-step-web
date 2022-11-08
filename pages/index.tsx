
import { useGetPostsByString, useInit } from "../utils/firebase"
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../config/theme';
import Head from "next/head";
import { useState } from "react";

export default function IndexPage() {
  
  const { isInitialized: isFirebaseInitialized } = useInit()
  const [searchStr, setSearchStr] = useState("");
  const { steps } = useGetPostsByString(searchStr);
  

  //const content = isFirebaseInitialized ? <Layout onSearch={(value) => setSearchStr(value)}/> : <div/>


  return (<>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}><CssBaseline />
      {isFirebaseInitialized && <Layout onSearch={(value) => setSearchStr(value)}>
        {steps.map((data, index) => <h3 key={index}>{data.title}</h3>)}
        </Layout>}
    </ThemeProvider>
  </>);
}
