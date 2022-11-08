
import { getPostsByString,getPostsByTags, useInit } from "../utils/firebase"
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../config/theme';
import Head from "next/head";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import {useDebouncedQuery} from "../utils/queryUtils"

export default function IndexPage({posts = []}) {
  
  const { isInitialized: isFirebaseInitialized } = useInit()
  const [searchStr, setSearchStr] = useState("");
  const {set:setQuery} =  useDebouncedQuery(1000)


  return (<>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}><CssBaseline />
      {isFirebaseInitialized && <Layout onSearch={(value) => { setQuery({search:value}); setSearchStr(value) }}>
        {posts.map((data, index) => <h3 key={index}>{data.title}</h3>)}
        </Layout>}
    </ThemeProvider>
  </>);
}

export async function getServerSideProps({query}) {
  const posts = await getPostsByTags(query.search.split(" "));
  return {props:{posts}}
}
