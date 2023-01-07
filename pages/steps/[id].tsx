import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, deletePost, likePost, getLists } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";
import { post as postModel } from "../../utils/firebase/models";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import StepsProgress from "../../components/StepsProgress";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import Dialog from "../../components/primitives/Dialog";
import { useState } from "react";
import { ListResponse } from "../../utils/firebase/interface";

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

const Steps = ({ post, steps, lists }) => {
  const [showDialog, setShowDialog] = useState({ open: false, content: "", onOkClick: () => {} });
  const router = useRouter();
  const [user] = useAuthState(getAuth());
  const stepsCompleted = steps.filter((step) => step.completed);
  const showButton = (index) => stepsCompleted.length < steps.length;
  const showDone = (index) => index === steps.length - 1;

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
  };

  const onDeleteHandler = ({ id }) => {
    setShowDialog({
      ...showDialog,
      open: true,
      content: "Are you sure you want to delete this post?",
      onOkClick: () => deletePost(id),
    });
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onStartOverHandler = async () => {
    debugger;
  };

  return (
    <>
      <Head>
        <title>{"STEPS | " + (post?.title || "untitled")}</title>
      </Head>
      <StyledLayout
        propsTopbar={{ actions: <StyledStepsProgress label={`${stepsCompleted.length}/${steps.length}`} /> }}
      >
        <Post
          {...post}
          currentUserId={user?.uid}
          lists={lists}
          onEdit={
            user?.uid === post.userId
              ? () => {
                  onEditHandler(post);
                }
              : undefined
          }
          onDelete={
            user?.uid === post.userId
              ? () => {
                  onDeleteHandler(post);
                }
              : undefined
          }
          onLike={() => onLikeHandler(post)}
          onStartOver={onStartOverHandler}
        />
        <RevealNext
          open
          showButton={stepsCompleted.length === 0}
          label="Start"
          onClick={() => {
            debugger;
          }}
        />
        {steps.map((step, index) => {
          return (
            <RevealNext
              key={"step-" + index}
              label="Next"
              open={index < stepsCompleted.length}
              showButton={showButton(index)}
              showDone={showDone(index)}
              onClick={() => {
                debugger;
              }}
            >
              <StyledStep {...step} index={index} />
            </RevealNext>
          );
        })}
      </StyledLayout>
      {/* DELETE DIALOG */}
      <Dialog
        open={showDialog.open}
        onClose={() => setShowDialog({ ...showDialog, open: false })}
        onClickOk={() => {
          showDialog.onOkClick();
          setShowDialog({ ...showDialog, open: false });
        }}
        onClickCancel={() => setShowDialog({ ...showDialog, open: false })}
        content={showDialog.content}
      />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id || uuid();
  const post = await getPost(id);
  const stepsResponse = await getSteps(id);
  const listsResp: ListResponse = await getLists(id);
  return {
    props: {
      post: post?.data || { ...postModel, id },
      steps: stepsResponse.data,
      lists: listsResp.data,
    },
  };
}

export default Steps;
