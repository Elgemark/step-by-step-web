import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { getPostsByTags, getPosts, deletePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";

export default function IndexPage({ posts = [] }) {
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();

  const onEditHandler = ({ id }) => {
    router.push("/create?id=" + id);
  };

  const onDeleteHandler = async ({ id }) => {
    await deletePost(id);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Layout
        onSearch={(value) => {
          setQuery({ search: value });
        }}
      >
        {posts.map((data, index) => (
          <Post
            key={index}
            onEdit={() => {
              onEditHandler(data);
            }}
            onDelete={() => {
              onDeleteHandler(data);
            }}
            {...data}
          />
        ))}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const tags = query.search?.split(" ");
  const posts = tags ? await getPostsByTags(tags) : await getPosts();
  return { props: { posts } };
}
