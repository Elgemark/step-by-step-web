import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsByQuery } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { useUser } from "../../../utils/firebase/api";
import Loader from "../../../components/Loader";
import { limit, startAfter, where } from "firebase/firestore";
import PageMain from "../../../components/PageMain";

const collection = new Collection();
let lastDoc;

const ReviewPage = (props) => {
  const { isLoading, data: user } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (!user.roles.includes("admin")) {
    return <h1>Access denied!</h1>;
  }

  return <PageMain {...props} title="STEPS" enableLink={true} />;
};

export async function getServerSideProps({ query }) {
  const { search, category } = query;
  let response: PostsResponse = { data: [], error: null };

  const queries: Array<any> = [limit(10), where("visibility", "==", "audit")];

  if (lastDoc) {
    queries.push(startAfter(lastDoc));
  }

  response = await getPostsByQuery(queries);

  lastDoc = response.lastDoc;

  const items = collection.union(response.data, [category, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <ReviewPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
