import Profile from "./user";

const Index = (props) => {
  console.log("props tabValue", props.tabValue);
  return <Profile {...props} />;
};

export async function getServerSideProps({ query }) {
  const tabValue = query.user[0];
  return { props: { tabValue } };
}

export default Index;
