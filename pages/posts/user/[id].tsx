import PageMain from "../../../components/PageMain";
import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsForUser } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";

const collection = new Collection();
let lastDoc;

const UserPage = (props) => {
  return <PageMain {...props} title="STEPS" enableLink={true} />;
};

export async function getServerSideProps({ query }) {
  const { id } = query;
  let response: PostsResponse = { data: [], error: null };

  response = await getPostsForUser(id);

  const items = collection.union(response.data, [], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <UserPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
