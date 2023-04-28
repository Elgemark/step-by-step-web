import { getPostByFollows, getPostByCategories, getPostsForAnonymousUser } from "../../../utils/firebase/api/post";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { useEffect, useState } from "react";
import { useCollection } from "../../../utils/collectionUtils";
import { useScrolledToBottom } from "../../../utils/scrollUtils";
import Layout from "../../../components/Layout";
import Posts from "../../../components/posts/Posts";
import { Posts as PostsType } from "../../../utils/firebase/type";
import { useUser } from "../../../utils/firebase/api/user";
import { getFollows } from "../../../utils/firebase/api/follow";
import SteppoHead from "../../../components/SteppoHead";

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
  // posts by categories...
  const [lastDocByCategories, setLastDocByCategories] = useState();
  const [hasMorePostsByCategories, setHasMorePostsByCategories] = useState(true);
  // posts by exclude...
  const [lastDocByAnonymousUser, setLastDocByAnonymousUser] = useState();
  const [hasMorePostsByAnonymousUser, setHasMorePostsByAnonymousUser] = useState(true);

  const LIMIT = 5;

  const fetchPostsByFollows = async () => {
    if (!hasMorePostsByFollows || !follows.length) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostByFollows(follows, LIMIT, lastDocByFollows);
    addPosts(response.data);
    setLastDocByFollows(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByFollows(hasMorePosts);
    console.log("fetch by follows", response.data.length);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPostsByCategories = async () => {
    if (!hasMorePostsByCategories || !user.categories?.length) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostByCategories(user.categories, LIMIT, lastDocByCategories);
    addPosts(response.data);
    setLastDocByCategories(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByCategories(hasMorePosts);
    console.log("fetch by categories", response.data.length);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPostForAnonymousUser = async () => {
    if (!hasMorePostsByAnonymousUser) {
      return { hasMorePosts: false, posts: [] };
    }
    //
    const response = await getPostsForAnonymousUser({}, LIMIT, lastDocByAnonymousUser);
    addPosts(response.data);
    setLastDocByAnonymousUser(response.lastDoc);
    const hasMorePosts = response.data.length > 0;
    setHasMorePostsByAnonymousUser(hasMorePosts);
    console.log("fetch by anonymous user", hasMorePosts);
    return { hasMorePosts, posts: response.data };
  };

  const fetchPosts = async () => {
    console.log("fetchPosts");
    setIsFetching(true);
    let resp: FetchResponse = { hasMorePosts: false, posts: [] };
    let aggregatedPosts: PostsType = [];
    // posts by follows
    if (!resp.hasMorePosts || aggregatedPosts.length < LIMIT) {
      resp = await fetchPostsByFollows();
      aggregatedPosts = aggregatedPosts.concat(resp.posts);
    }
    // posts by categories
    if (!resp.hasMorePosts || aggregatedPosts.length < LIMIT) {
      resp = await fetchPostsByCategories();
      aggregatedPosts = aggregatedPosts.concat(resp.posts);
    }
    // If no post found, try
    if (!resp.posts.length) {
      resp = await fetchPostForAnonymousUser();
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isLoadingUser) {
      !isFetching && fetchPosts();
    }
  }, [isLoadingUser]);

  useEffect(() => {
    if (isBottom) {
      if (!isLoadingUser) {
        !isFetching && fetchPosts();
      }
    }
  }, [isBottom]);

  return (
    <>
      <SteppoHead description="User generated feed" />
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
