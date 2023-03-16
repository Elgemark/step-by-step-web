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
import { Post as PostType } from "../../utils/firebase/interface";
import { Steps } from "../../utils/firebase/type";
import { useProgress } from "../../utils/firebase/api/progress";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import PostMoreMenu from "../../components/PostMoreMenu";
import DialogDeletePost from "../../components/DialogDeletePost";
import DialogReport, { ReportData } from "../../components/DialogReport";
import { useTheme } from "@mui/material";
import { Lists, ListsResponse } from "../../utils/firebase/api/list";
import _ from "lodash";
import StepsDone from "../../components/StepsDone";
import { ratePost, useRatesForPostAndUser } from "../../utils/firebase/api/rate";

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
  #pinned-lists {
    position: sticky;
    top: 60px;
    z-index: 999;
    backdrop-filter: blur(5px);
    padding-bottom: 1rem;
  }
`;

const StyledStep = styled(Step)`
  margin: 10px 0;
`;

const StyledStepsProgress = styled(StepsProgress)`
  margin: 0, 40px;
  flex-grow: 1;
`;

const StepsPage: FC<{ id: string; post: PostType; lists: Lists; steps: Steps }> = ({ id, post, steps, lists }) => {
  const theme = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string>();
  const router = useRouter();
  const { user, progress, updateProgress, isLoading } = useProgress(id, true);
  const { value: userRateValue, isLoading: isUserRateLoading } = useRatesForPostAndUser(id, user?.uid);
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
    await updateProgress(user.uid, id, { completed: false, stepsCompleted: [] });
  };

  const onRevelNextClickHandler = async ({ index }) => {
    const nextStep = steps[index + 1];
    const nextNextStep = steps[index + 2];
    let stepsCompleted = progress?.stepsCompleted || [];
    stepsCompleted.push(nextStep.id);
    stepsCompleted = _.uniq(stepsCompleted);
    if (nextStep) {
      await updateProgress(user.uid, id, {
        completed: nextNextStep ? false : true,
        completions: nextNextStep ? progress.completions : progress.completions + 1,
        stepsCompleted,
      });
    }
  };
  const onReviewHandler = () => {
    router.push("/admin/review/post/" + id);
  };

  const onClickAvatarHandler = () => {
    if (user.isCurrentUser) {
      router.push("/profile/" + user.uid);
    } else {
      router.push("/user/" + user.uid);
    }
  };

  const onRollBackHandler = async ({ stepId }) => {
    let stepsCompleted = progress?.stepsCompleted || [];
    const index = stepsCompleted.findIndex((id) => id === stepId);
    stepsCompleted = stepsCompleted.slice(0, index + 1);
    await updateProgress(user.uid, id, { completed: false, stepsCompleted });
  };

  const onClickRateHandler = async (value) => {
    await ratePost(id, user.uid, value);
  };

  return (
    <>
      <Head>
        <title>{"STEPS | " + (post?.title || "untitled")}</title>
      </Head>
      <StyledLayout
        theme={theme}
        propsTopbar={{
          actions: (
            <StyledStepsProgress
              label={`${progress.stepsCompleted.length}/${steps.length}`}
              value={(progress.stepsCompleted.length / steps.length) * 100}
              complete={progress.stepsCompleted.length === steps.length}
            />
          ),
        }}
      >
        {/* This div is the portal target for pinned lists */}
        <div id="pinned-lists"></div>
        <Post
          {...post}
          action={
            <PostMoreMenu
              onEdit={
                user?.uid === post.uid
                  ? () => {
                      onEditHandler(post);
                    }
                  : undefined
              }
              onDelete={
                user?.uid === post.uid
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
          onClickAvatar={onClickAvatarHandler}
        />
        {/* START BUTTON */}
        <RevealNext
          open
          showButton={!progress.stepsCompleted.length}
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
              open={index < progress.stepsCompleted.length}
              showButton={index == progress.stepsCompleted.length - 1 && index !== steps.length - 1}
              onClick={() => {
                onRevelNextClickHandler({ index });
              }}
            >
              <StyledStep postId={id} {...step} index={index} onRollBack={onRollBackHandler} />
            </RevealNext>
          );
        })}
        {/* STEPS DONE */}
        <StepsDone open={progress.completed} onClickRate={onClickRateHandler} rateValue={userRateValue} />
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
