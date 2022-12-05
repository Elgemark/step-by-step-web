import { getSavedPosts } from "../../utils/firebase/api";
import Profile from "./user";

const Index = (props) => {
  return <Profile {...props} />;
};

export async function getServerSideProps({ query }) {
  const uid = query.user[0];
  const tabValue = query.user[1] || "saved";
  const { posts } = await getSavedPosts(uid);
  return { props: { tabValue, uid, posts } };
}

export default Index;
