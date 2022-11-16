import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, useUserStepsProgress } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

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

const Steps = ({ post, steps }) => {
  const [user] = useAuthState(getAuth());
  const { step: stepIndex, setStep } = useUserStepsProgress(user?.uid, steps?.id);

  return (
    <>
      <Head>
        <title>{"STEPS | " + post?.title}</title>
      </Head>
      <StyledLayout>
        <Post {...post} />
        <RevealNext
          open
          showButton={stepIndex === 0}
          label="Start"
          onClick={() => {
            stepIndex < 1 && setStep(1);
          }}
        />
        {steps.steps.map((step, index) => {
          return (
            <RevealNext
              key={"step-" + index}
              open={index < stepIndex}
              showButton={index == stepIndex - 1 && index != steps.steps.length - 1}
              onClick={() => setStep(index + 2)}
            >
              <Step {...step} index={index} />
            </RevealNext>
          );
        })}
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
      steps: steps.data,
    },
  };
}

export default Steps;
