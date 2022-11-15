import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { getPostsByTags, getPosts, deletePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
import styled from "styled-components";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";

const StyledMasonry = styled(Masonry)`
  width: 100%;
`;

export default function IndexPage({ posts = [] }) {
  const [user] = useAuthState(getAuth());
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();

  console.log("user", user);

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
        <StyledMasonry columns={4} spacing={2}>
          {posts.map((data, index) => (
            <Post
              key={index}
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
              {...data}
            />
          ))}
        </StyledMasonry>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const tags = query.search?.split(" ");
  const posts = tags ? await getPostsByTags(tags) : await getPosts();
  return { props: { posts } };
}
