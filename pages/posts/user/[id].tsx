import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostByFollows, getPostByInterests, getPostsForUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { getCategories, getFollows } from "../../../utils/firebase/api";
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

const UserPage = ({ categories, follows }) => {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const isBottom = useScrolledToBottom(100);
  const router = useRouter();
  const { collection: posts, addItems: addPosts } = useCollection();
  // posts by follows...
  const [lastDocByFollows, setLastDocByFollows] = useState();
  const [hasMorePostsByFollows, setHasMorePostsByFollows] = useState(true);
  // posts by interests...
  const [lastDocByInterests, setLastDocByInterests] = useState();
  const [hasMorePostsByInterests, setHasMorePostsByInterests] = useState(true);

  const fetchPostsByFollows = async () => {
    const response = await getPostByFollows(follows, 2, lastDocByFollows);
    addPosts(response.data);
    setLastDocByFollows(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByFollows(hasMorePosts);
    return { hasMorePosts };
  };

  const fetchPostsByInterests = async () => {
    const response = await getPostByInterests(user.interests, 2, lastDocByInterests);
    addPosts(response.data);
    setLastDocByInterests(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByInterests(hasMorePosts);
    return { hasMorePosts };
  };

  useEffect(() => {
    if (!isLoadingUser && user.interests && user.interests.length) {
      fetchPostsByInterests();
    }
  }, [isLoadingUser, user]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser && user.interests && user.interests.length) {
        // posts by interests...
        hasMorePostsByInterests && fetchPostsByInterests();
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
        <Posts enableLink={true} posts={posts as PostsType} />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const uid = query.id;
  const categories = await getCategories();
  const followsResp = await getFollows(uid);
  const follows = followsResp.data.map((doc) => doc.id);

  // let response: PostsResponse = { data: [], error: null };
  // response = await getPostsForUser(id);

  // const items = collection.union(response.data, [], () => {
  //   lastDoc = null;
  // });

  return { props: { categories: categories.data, follows } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <UserPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
