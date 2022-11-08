import { useState } from "react";
import Layout from "../../components/Layout";
import { useGetPostsByString } from "../../utils/firebase";
import Splash from "../../components/splashes/Splash";

const Home = () => {
  const [searchStr, setSearchStr] = useState("");
  const { steps } = useGetPostsByString(searchStr);
  console.log("steps",steps)
  
  return (
    <Layout onSearch={(value) => setSearchStr(value)}>
      {steps.map(() => <Splash />)}
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Home;
