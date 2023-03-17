import { getPostsBySearch } from "../../../utils/firebase/api/post";
import PageMain from "../../../components/PageMain";
import _ from "lodash";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { getCategories } from "../../../utils/firebase/api";

const CategoryPage = (props) => {
  const { category, search } = props;
  console.log("search", search);
  return <PageMain {...props} title={"STEPS | " + _.capitalize(category)} enableLink={true} />;
};

export async function getServerSideProps({ query }) {
  const { category, search } = query;

  const categories = await getCategories();

  const response = await getPostsBySearch(search, { category });

  const items = response.data || [];

  return { props: { posts: items, category, categories: categories.data, search: search || null } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <CategoryPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
