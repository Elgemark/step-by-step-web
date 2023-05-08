import Layout from "../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, getLists } from "../../utils/firebase/api";
import RevealNext from "../../components/RevealNext";
import Step from "../../components/steps/Step";
import Post from "../../components/posts/Post";
import { post as postModel } from "../../utils/firebase/models";
import StepsProgress from "../../components/StepsProgress";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { Post as PostType } from "../../utils/firebase/interface";
import { Steps } from "../../utils/firebase/type";
import { Progress, useProgress } from "../../utils/firebase/api/progress";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import PostMoreMenu from "../../components/PostMoreMenu";
import DialogDeletePost from "../../components/DialogDeletePost";
import DialogReport, { ReportData } from "../../components/DialogReport";
import { Alert, Box, Stack, useTheme } from "@mui/material";
import { Lists, ListsResponse } from "../../utils/firebase/api/list";
import _ from "lodash";
import StepsDone from "../../components/StepsDone";
import { ratePost, useRatesForPostAndUser } from "../../utils/firebase/api/rate";
import { getPostBySlug } from "../../utils/firebase/api/post";
import { getCategory } from "../../utils/firebase/api/categories";
import SteppoHead from "../../components/SteppoHead";
import ListCard from "../../components/lists/ListCard";
import PostAd from "../../components/client/ads/PostAd";

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

  .post-ad {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledStep = styled(Step)`
  margin: 10px 0;
`;

const StyledStepsProgress = styled(StepsProgress)`
  flex-grow: 1;
`;

const StepsPage: FC<{ id: string; post: PostType; lists: Lists; steps: Steps; metaTags: string }> = ({
  id,
  post,
  steps,
  lists,
  metaTags,
}) => {
  const theme = useTheme();

  if (!post) {
    return (
      <>
        <StyledLayout theme={theme}></StyledLayout>
        <Box className="content" component="main">
          <Stack direction={"row"} justifyContent="center">
            <Alert className="info" severity="info" color="warning">
              Sorry... Steppo can't find this post anymore!
            </Alert>
          </Stack>
        </Box>
      </>
    );
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState<string>();
  const router = useRouter();
  const { user, progress, updateProgress, isLoading } = useProgress(id, true);
  const { value: userRateValue } = useRatesForPostAndUser(id, user?.uid);
  const [report, setReport] = useState<ReportData>();

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
  };

  const onDeleteHandler = () => {
    router.back();
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
      <SteppoHead title={post?.title} description={post.descr} titleTags={metaTags} image={post?.media?.imageURI} />
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
        {/* AD */}
        <PostAd />
        <Post
          {...post}
          progress={progress as Progress}
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
                      setShowDeleteDialog(post.id);
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
          // lists={lists}
          onClickAvatar={onClickAvatarHandler}
        />
        {/* LIST */}
        <ListCard postId={post.id} lists={lists} progress={progress as Progress}></ListCard>
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
              <>
                <PostAd index={index} occurrence={3} skip={[0]} />
                <StyledStep postId={id} {...step} index={index} onRollBack={onRollBackHandler} />
              </>
            </RevealNext>
          );
        })}
        {/* STEPS DONE */}
        <StepsDone
          open={progress.completed}
          onClickRate={user?.uid && onClickRateHandler}
          rateValue={userRateValue}
          rateLabel={user?.uid ? undefined : "Login to rate!"}
        />
      </StyledLayout>
      {/* DELETE DIALOG */}
      <DialogDeletePost onDelete={onDeleteHandler} open={showDeleteDialog} onClose={() => setShowDeleteDialog(null)} />
      {/* REPORT DIALOG */}
      <DialogReport open={report} onClose={() => setReport(null)} />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id;
  let post = await getPostBySlug(id);
  post = post.error ? await getPost(id) : post;

  if (!post.data) {
    return {
      props: {
        post: null,
        steps: [],
        lists: [],
        metaTags: "",
        id: null,
      },
    };
  }
  const postId = post.data?.id || id;
  const stepsResponse = await getSteps(postId);
  const listsResp: ListsResponse = await getLists(postId);
  const categoryResp = await getCategory(post.data.category);
  // extract meta
  const metaTags = categoryResp.data?.meta ? categoryResp.data?.meta["en-global"] : "";
  return {
    props: {
      post: post.data || { ...postModel, id: postId },
      steps: stepsResponse.data,
      lists: listsResp.data,
      metaTags,
      id: postId,
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
