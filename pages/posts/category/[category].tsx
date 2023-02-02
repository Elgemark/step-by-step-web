import { getPostsByCategory } from "../../../utils/firebase/api/post";
import PageMain from "../../../components/PageMain";
import _ from "lodash";
import { PostsResponse } from "../../../utils/firebase/interface";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { getCategories } from "../../../utils/firebase/api";

const collection = new Collection();
let lastDoc;

const CategoryPage = (props) => {
  const { category } = props;
  return <PageMain {...props} title={"STEPS | " + _.capitalize(category)} enableLink={true} />;
};

export async function getServerSideProps({ query }) {
  const { category } = query;

  const categories = await getCategories();

  const response: PostsResponse = await getPostsByCategory(category, 10, lastDoc);
  lastDoc = response.lastDoc;
  //
  const items = collection.union(response.data, [category], () => {
    lastDoc = null;
  });

  return { props: { posts: items, category, categories: categories.data } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <CategoryPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
