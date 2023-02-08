import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostByExclude, getPostByFollows, getPostByInterests } from "../../../utils/firebase/api/post";
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

type FetchResponse = {
  hasMorePosts: boolean;
  numPosts: number;
};

const UserPage = ({ follows }) => {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const isBottom = useScrolledToBottom(100);
  const router = useRouter();
  const { collection: posts, addItems: addPosts } = useCollection();
  const [isFetching, setIsFetching] = useState(false);
  // posts by follows...
  const [lastDocByFollows, setLastDocByFollows] = useState();
  const [hasMorePostsByFollows, setHasMorePostsByFollows] = useState(true);
  // posts by interests...
  const [lastDocByInterests, setLastDocByInterests] = useState();
  const [hasMorePostsByInterests, setHasMorePostsByInterests] = useState(true);
  // posts by exclude...
  const [lastDocByExclude, setLastDocByExclude] = useState();
  const [hasMorePostsByExclude, setHasMorePostsByExclude] = useState(true);

  const LIMIT = 5;

  const fetchPostsByFollows = async (fromTimeStamp) => {
    if (!hasMorePostsByFollows) {
      return { hasMorePosts: false, numPosts: 0 };
    }
    //
    console.log({ follows });
    const response = await getPostByFollows(follows, fromTimeStamp, LIMIT, lastDocByFollows);
    addPosts(response.data);
    setLastDocByFollows(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByFollows(hasMorePosts);
    console.log("fetch by follows", response.data.length);
    return { hasMorePosts, numPosts: response.data.length };
  };

  const fetchPostsByInterests = async (fromTimeStamp) => {
    if (!hasMorePostsByInterests) {
      return { hasMorePosts: false, numPosts: 0 };
    }
    //
    const response = await getPostByInterests(user.interests, fromTimeStamp, LIMIT, lastDocByInterests);
    addPosts(response.data);
    setLastDocByInterests(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByInterests(hasMorePosts);
    console.log("fetch by interests", response.data.length);
    return { hasMorePosts, numPosts: response.data.length };
  };

  const fetchPostsByExclude = async () => {
    if (!hasMorePostsByExclude) {
      return { hasMorePosts: false, numPosts: 0 };
    }
    //
    const exclude = posts.map((post) => post.id);
    const response = await getPostByExclude(exclude, LIMIT, lastDocByExclude);
    addPosts(response.data);
    setLastDocByExclude(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByExclude(hasMorePosts);
    console.log("fetch by exclude", response.data.length);
    return { hasMorePosts, numPosts: response.data.length };
  };

  const fetchPosts = async (fromTimeStamp) => {
    setIsFetching(true);
    let resp: FetchResponse = { hasMorePosts: false, numPosts: 0 };
    // posts by follows
    if (!resp.hasMorePosts) {
      resp = await fetchPostsByFollows(fromTimeStamp);
    }
    // posts by interests
    if (!resp.hasMorePosts) {
      resp = await fetchPostsByInterests(fromTimeStamp);
    }
    // posts by follows
    if (!resp.hasMorePosts) {
      resp = await fetchPostsByExclude();
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isLoadingUser && user.interests && user.interests.length) {
      !isFetching && fetchPosts(user.lastFeedFetch);
    }
  }, [isLoadingUser, user]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser && user.interests && user.interests.length) {
        // posts by interests...
        !isFetching && fetchPosts(user.lastFeedFetch);
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
