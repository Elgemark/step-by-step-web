
import Layout from '../components/Layout'
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils"
import { getPostsByTags,getPosts } from '../utils/firebase/api';

export default function IndexPage({posts = []}) {
  
  const {set:setQuery} =  useDebouncedQuery(1000)
  

  return (<>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    
      <Layout onSearch={(value) => { setQuery({search:value}) }}>
        {posts.map((data, index) => <h3 key={index}>{data.title}</h3>)}
        </Layout>
    
  </>);
}

export async function getServerSideProps({ query }) {
  const tags = query.search?.split(" ");
  const posts = tags ? await getPostsByTags(tags) : await getPosts();
  return {props:{posts}}
}
