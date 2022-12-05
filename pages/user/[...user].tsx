import { getCreatedPosts, getPostsByState, getSavedPosts } from "../../utils/firebase/api";
import Profile from "./user";

const Index = (props) => {
  return <Profile {...props} />;
};

export async function getServerSideProps({ query }) {
  const uid = query.user[0];
  const tabValue = query.user[1] || "saved";
  let posts = [];
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
  }

  return { props: { tabValue, uid, posts } };
}

export default Index;
