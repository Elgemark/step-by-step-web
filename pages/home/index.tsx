import { useState } from "react";
import Layout from "../../components/Layout";
import { useGetPostsByString } from "../../utils/firebase";

const Home = () => {
  const [searchStr, setSearchStr] = useState("");
  const { steps } = useGetPostsByString(searchStr);
  console.log("steps",steps)
  
  return (
    <Layout onSearch={(value) => setSearchStr(value)}>
      <h3>Home</h3>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Home;
