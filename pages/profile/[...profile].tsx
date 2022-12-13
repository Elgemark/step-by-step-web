import { getCreatedPosts, getFollows, getPostsByState, getSavedPosts } from "../../utils/firebase/api";
import Profile from "./Profile";

const Index = (props) => {
  return <Profile {...props} />;
};

export async function getServerSideProps({ query }) {
  const uid = query.profile[0];
  const tabValue = query.profile[1] || "saved";
  let posts = [];
  let users = [];
  switch (tabValue) {
    case "saved":
      const { posts: savedPosts } = await getSavedPosts(uid);
      posts = savedPosts;
      break;
    case "created":
      const { posts: createdPosts } = await getCreatedPosts(uid);
      posts = createdPosts;
      break;
    case "completed":
      const { posts: completedPosts } = await getPostsByState(uid, "completed");
      posts = completedPosts;
      break;
    case "incompleted":
      const { posts: incompletedPosts } = await getPostsByState(uid, "incompleted");
      posts = incompletedPosts;
      break;
    case "follows":
      const { data: follows } = await getFollows(uid);
      users = follows;
      break;
  }

  return { props: { tabValue, uid, posts, users } };
}

export default Index;
