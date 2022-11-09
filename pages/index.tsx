
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../config/theme';
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils"
import { getPostsByTags } from '../utils/firebase/api';

export default function IndexPage({posts = []}) {
  
  const {set:setQuery} =  useDebouncedQuery(1000)
  

  return (<>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}><CssBaseline />
      <Layout onSearch={(value) => { setQuery({search:value}) }}>
        {posts.map((data, index) => <h3 key={index}>{data.title}</h3>)}
        </Layout>
    </ThemeProvider>
  </>);
}

export async function getServerSideProps({ query }) {
  const tags = query.search?.split(" ");
  const posts = tags ? await getPostsByTags(tags) : [];
  return {props:{posts}}
}
