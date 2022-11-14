import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";

const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  .content {
    width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  section {
    display: flex;
    justify-content: center;
  }
`;

const Steps = ({ post, steps, stepsData }) => {
  console.log("stepsData", stepsData);
  return (
    <>
      <Head>
        <title>{"STEPS | " + post?.title}</title>
      </Head>
      <StyledLayout>
        <Post {...post} />
        <RevealNext open label="Start" />
        {steps.map((step, index) => (
          <RevealNext key={"step-" + index}>
            <Step {...step} />
          </RevealNext>
        ))}
      </StyledLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const postId = query.id;
  const post = await getPost(postId);
  const steps = await getSteps(post?.data?.stepsId);
  return {
    props: {
      post: post?.data || {
        title: "Title",
        descr: "Description",
        media: { imageURI: "" },
        tags: [],
        likes: 0,
      },
      steps: steps?.data?.steps || [],
      stepsData: steps?.data,
    },
  };
}

export default Steps;
