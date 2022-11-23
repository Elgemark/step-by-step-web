import { searchPosts } from "../../utils/firebase/api";
import { toSanitizedArray } from "../../utils/stringUtils";
import PageMain from "../../components/PageMain";
import _ from "lodash";

export default function CategoryPage(props) {
  const { category } = props;
  return <PageMain {...props} title={"STEPS | " + _.capitalize(category)} />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const category = query.category[0];
  const posts = await searchPosts(tags, category);
  return { props: { posts, query, category } };
}
