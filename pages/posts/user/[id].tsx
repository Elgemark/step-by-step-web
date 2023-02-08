import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostByExlude, getPostByFollows, getPostByInterests } from "../../../utils/firebase/api/post";
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

const UserPage = ({ follows }) => {
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
  // posts by exclude...
  const [lastDocByExclude, setLastDocByExclude] = useState();
  const [hasMorePostsByExclude, setHasMorePostsByExclude] = useState(true);

  const fetchPostsByFollows = async () => {
    if (!hasMorePostsByFollows) {
      return { hasMorePosts: false };
    }
    //
    const response = await getPostByFollows(follows, 5, lastDocByFollows);
    addPosts(response.data);
    setLastDocByFollows(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByFollows(hasMorePosts);
    console.log("fetch by follows");
    return { hasMorePosts };
  };

  const fetchPostsByInterests = async () => {
    if (!hasMorePostsByInterests) {
      return { hasMorePosts: false };
    }
    //
    const response = await getPostByInterests(user.interests, 5, lastDocByInterests);
    addPosts(response.data);
    setLastDocByInterests(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByInterests(hasMorePosts);
    console.log("fetch by interests");
    return { hasMorePosts };
  };

  const fetchPostsByExclude = async () => {
    if (!hasMorePostsByExclude) {
      return { hasMorePosts: false };
    }
    //
    const exclude = posts.map((post) => post.id);
    const response = await getPostByExlude(exclude, 5, lastDocByInterests);
    addPosts(response.data);
    setLastDocByExclude(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByExclude(hasMorePosts);
    console.log("fetch by exclude");
    return { hasMorePosts };
  };

  const fetchPosts = async () => {
    let resp = await fetchPostsByInterests();
    if (!resp.hasMorePosts) {
      resp = await fetchPostsByFollows();
    }
    if (!resp.hasMorePosts) {
      resp = await fetchPostsByExclude();
    }
  };

  useEffect(() => {
    if (!isLoadingUser && user.interests && user.interests.length) {
      fetchPosts();
    }
  }, [isLoadingUser, user]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser && user.interests && user.interests.length) {
        // posts by interests...
        fetchPosts();
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
  const followsResp = await getFollows(uid);
  const follows = followsResp.data.map((doc) => doc.id);

  return { props: { follows } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <UserPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
