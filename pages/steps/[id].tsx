import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, useUserStepsProgress } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";
import { post as postModel, steps as stepsModel } from "../../utils/firebase/models";
// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import StepsProgress from "../../components/StepsProgress";

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

const StyledStep = styled(Step)`
  margin: 10px 0;
`;

const StyledStepsProgress = styled(StepsProgress)`
  margin: 0, 40px;
`;

const Steps = ({ post, steps }) => {
  const [user] = useAuthState(getAuth());
  const { step: stepIndex, setStep } = useUserStepsProgress(user?.uid, steps?.id);
  const showButton = (index) => index == stepIndex - 1 && index != steps.steps.length - 1;
  const showDone = (index) => index === steps.steps.length - 1;
  return (
    <>
      <Head>
        <title>{"STEPS | " + post?.title}</title>
      </Head>
      <StyledLayout propsTopbar={{ actions: <StyledStepsProgress label={`${stepIndex}/${steps.steps.length}`} /> }}>
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
              showButton={showButton(index)}
              showDone={showDone(index)}
              onClick={() => setStep(index + 2)}
            >
              <StyledStep {...step} index={index} />
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
      post: post?.data || postModel,
      steps: steps?.data || stepsModel,
    },
  };
}

export default Steps;
