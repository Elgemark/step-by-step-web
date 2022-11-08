import Layout from "../../components/Layout"

const Home = () => {
    return <Layout><h3>Home</h3></Layout>
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default Home