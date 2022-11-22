import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { getPostsByTags, getPosts, deletePost, likePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

export default function IndexPage({ posts = [] }) {
  const [user] = useAuthState(getAuth());
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();

  const onEditHandler = ({ id }) => {
    router.push("/create?id=" + id);
  };

  const onDeleteHandler = async ({ id }) => {
    await deletePost(id);
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
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
        <Masonry spacing={2} columns={{ lg: 4, md: 3, sm: 2, xs: 1 }}>
          {posts.map((data, index) => (
            <Post
              key={index}
              style={{ width: "100%" }}
              onEdit={
                user?.uid === data.userId
                  ? () => {
                      onEditHandler(data);
                    }
                  : undefined
              }
              onDelete={
                user?.uid === data.userId
                  ? () => {
                      onDeleteHandler(data);
                    }
                  : undefined
              }
              onLike={() => onLikeHandler(data)}
              {...data}
            />
          ))}
        </Masonry>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const tags = query.search?.split(" ");
  const posts = tags ? await getPostsByTags(tags) : await getPosts();
  return { props: { posts } };
}
