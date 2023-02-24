import {
  getPostByExclude,
  getPostByFollows,
  getPostByInterests,
  getPostsForAnonymousUser,
} from "../../../utils/firebase/api/post";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { useEffect, useState } from "react";
import { useCollection } from "../../../utils/collectionUtils";
import { useScrolledToBottom } from "../../../utils/scrollUtils";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Posts from "../../../components/posts/Posts";
import { Posts as PostsType } from "../../../utils/firebase/type";
import { useUser } from "../../../utils/firebase/api/user";
import { getFollows } from "../../../utils/firebase/api/follow";

type FetchResponse = {
  hasMorePosts: boolean;
  posts: PostsType;
};

const UserPage = ({ follows }) => {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const isBottom = useScrolledToBottom(100);
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
  // posts by exclude...
  const [lastDocByAnonymousUser, setLastDocByAnonymousUser] = useState();
  const [hasMorePostsByAnonymousUser, setHasMorePostsByAnonymousUser] = useState(true);

  const LIMIT = 5;

  const fetchPostsByFollows = async (fromTimeStamp) => {
    if (!hasMorePostsByFollows || !follows.length) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostByFollows(follows, fromTimeStamp, LIMIT, lastDocByFollows);
    addPosts(response.data);
    setLastDocByFollows(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByFollows(hasMorePosts);
    console.log("fetch by follows", response.data.length);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPostsByInterests = async (fromTimeStamp) => {
    if (!hasMorePostsByInterests || !user.interests?.length) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostByInterests(user.interests, fromTimeStamp, LIMIT, lastDocByInterests);
    addPosts(response.data);
    setLastDocByInterests(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByInterests(hasMorePosts);
    console.log("fetch by interests", response.data.length);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPostsByExclude = async (exclude: Array<string>, fromTimeStamp = null) => {
    if (!hasMorePostsByExclude || !exclude.length) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostByExclude(exclude, fromTimeStamp, LIMIT, lastDocByExclude);
    addPosts(response.data);
    setLastDocByExclude(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByExclude(hasMorePosts);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPostForAnonymousUser = async (fromTimeStamp = null) => {
    if (!hasMorePostsByAnonymousUser) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostsForAnonymousUser(LIMIT, lastDocByAnonymousUser, { fromTimeStamp });
    addPosts(response.data);
    setLastDocByAnonymousUser(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByAnonymousUser(hasMorePosts);
    console.log("fetch by anonymous user", hasMorePosts);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPosts = async (fromTimeStamp) => {
    console.log("fetchPosts");
    setIsFetching(true);
    let resp: FetchResponse = { hasMorePosts: false, posts: [] };
    let aggregatedPosts: PostsType = [];
    // posts by follows
    if (!resp.hasMorePosts || aggregatedPosts.length < LIMIT) {
      resp = await fetchPostsByFollows(fromTimeStamp);
      aggregatedPosts = aggregatedPosts.concat(resp.posts);
    }
    // posts by interests
    if (!resp.hasMorePosts || aggregatedPosts.length < LIMIT) {
      resp = await fetchPostsByInterests(fromTimeStamp);
      aggregatedPosts = aggregatedPosts.concat(resp.posts);
    }
    // posts by exclude
    if (!resp.hasMorePosts || aggregatedPosts.length < LIMIT) {
      const exclude = posts.concat(aggregatedPosts).map((post) => post.id);
      resp = await fetchPostsByExclude(exclude);
    }
    // If no post found, try
    if (!resp.posts.length) {
      resp = await fetchPostForAnonymousUser(fromTimeStamp);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isLoadingUser) {
      !isFetching && fetchPosts(user.lastFeedFetch);
    }
  }, [isLoadingUser]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser) {
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
