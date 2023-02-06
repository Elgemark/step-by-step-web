import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostByInterests, getPostsForUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { getCategories } from "../../../utils/firebase/api";
import { useEffect, useState } from "react";
import { useCollection } from "../../../utils/collectionUtils";
import SelectChips from "../../../components/primitives/SelectChips";
import { Divider } from "@mui/material";
import styled from "styled-components";
import { useScrolledToBottom } from "../../../utils/scrollUtils";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Posts from "../../../components/posts/Posts";
import { Posts as PostsType } from "../../../utils/firebase/type";
import { useUser } from "../../../utils/firebase/api/user";

const collection = new Collection();
let lastDoc;

const getPostsByInterest = async () => {};

const UserPage = ({ categories }) => {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const isBottom = useScrolledToBottom(100);
  const router = useRouter();
  //
  const { collection: postsByIntersts, addItems: addPostsByInterests } = useCollection();
  const [lastDocByInterests, setLastDocByInterests] = useState();

  const fetchPostsByInterests = () => {
    getPostByInterests(user.interests, 2, lastDocByInterests).then((response) => {
      addPostsByInterests(response.data);
      setLastDocByInterests(response.lastDoc);
    });
  };

  useEffect(() => {
    if (!isLoadingUser && user.interests && user.interests.length) {
      fetchPostsByInterests();
    }
  }, [isLoadingUser, user]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser && user.interests && user.interests.length) {
        fetchPostsByInterests();
      }
    }
  }, [isBottom]);

  return (
    <>
      <Head>
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
        <title>{"Title"}</title>
      </Head>
      <Layout>
        <Posts enableLink={true} posts={postsByIntersts as PostsType} />
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const categories = await getCategories();

  // let response: PostsResponse = { data: [], error: null };
  // response = await getPostsForUser(id);

  // const items = collection.union(response.data, [], () => {
  //   lastDoc = null;
  // });

  return { props: { categories: categories.data } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <UserPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
