import Head from "next/head";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, likePost, getLists } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";
import { post as postModel } from "../../utils/firebase/models";
import StepsProgress from "../../components/StepsProgress";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { FC, useState } from "react";
import { ListsResponse, Post as PostType } from "../../utils/firebase/interface";
import { Lists, Steps } from "../../utils/firebase/type";
import { useProgress } from "../../utils/firebase/api/progress";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import PostMoreMenu from "../../components/PostMoreMenu";
import DialogDeletePost from "../../components/DialogDeletePost";
import DialogReport, { ReportData } from "../../components/DialogReport";

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

const StepsPage: FC<{ id: string; post: PostType; lists: Lists; steps: Steps }> = ({ id, post, steps, lists }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<string>();
  const router = useRouter();
  const { user, progress, updateProgress, isLoading } = useProgress(id, true);
  const [report, setReport] = useState<ReportData>();

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
  };

  const onDeleteHandler = ({ id }) => {
    setShowDeleteDialog(id);
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onStartOverHandler = async () => {
    await updateProgress(user.uid, id, { step: -1, completed: false });
  };

  const onRevelNextClickHandler = async ({ index }) => {
    const nextStep = steps[index + 1];
    const nextNextStep = steps[index + 2];
    if (nextStep) {
      await updateProgress(user.uid, id, {
        step: index + 1,
        completed: nextNextStep ? false : true,
        completions: nextNextStep ? progress.completions : progress.completions + 1,
      });
    }
  };
  const onReviewHandler = () => {
    router.push("/admin/review/post/" + id);
  };

  return (
    <>
      <Head>
        <title>{"STEPS | " + (post?.title || "untitled")}</title>
      </Head>
      <StyledLayout propsTopbar={{ actions: <StyledStepsProgress label={`${progress.step}/${steps.length}`} /> }}>
        <Post
          {...post}
          action={
            <PostMoreMenu
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
              onStartOver={onStartOverHandler}
              onReport={() => setReport({ postId: id, userId: user.uid })}
              onReview={user.roles.includes("admin") && onReviewHandler}
            />
          }
          enableLink={false}
          currentUserId={user?.uid}
          lists={lists}
          onLike={() => onLikeHandler(post)}
        />
        {/* START BUTTON */}
        <RevealNext
          open
          showButton={progress.step === -1}
          label="Start"
          onClick={() => {
            onRevelNextClickHandler({ index: -1 });
          }}
        />
        {/* NEXT BUTTON */}
        {steps.map((step, index) => {
          return (
            <RevealNext
              isLoading={isLoading}
              key={"step-" + index}
              label="Next"
              open={index <= progress.step}
              showButton={index == progress.step && index !== steps.length - 1}
              showDone={index === steps.length - 1}
              onClick={() => {
                onRevelNextClickHandler({ index });
              }}
            >
              <StyledStep {...step} index={index} />
            </RevealNext>
          );
        })}
      </StyledLayout>
      {/* DELETE DIALOG */}
      <DialogDeletePost open={showDeleteDialog} onClose={() => setShowDeleteDialog(null)} />
      {/* REPORT DIALOG */}
      <DialogReport open={report} onClose={() => setReport(null)} />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id || uuid();
  const post = await getPost(id);
  const stepsResponse = await getSteps(id);
  const listsResp: ListsResponse = await getLists(id);
  return {
    props: {
      post: post.data || { ...postModel, id },
      steps: stepsResponse.data,
      lists: listsResp.data,
      id,
    },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <StepsPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
