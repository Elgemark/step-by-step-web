import Profile from "./profile";

const Index = (props) => {
  console.log("props tabValue", props.tabValue);
  return <Profile {...props} />;
};

export async function getServerSideProps({ query }) {
  const tabValue = query.profile[0];
  return { props: { tabValue } };
}

export default Index;
