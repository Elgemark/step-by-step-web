import Layout from "../../../../components/Layout";
import styled from "styled-components";
import { getSteps, getLists } from "../../../../utils/firebase/api";
import Step from "../../../../components/steps/Step";
import Post from "../../../../components/posts/Post";
import { v4 as uuid } from "uuid";
import { FC, useState } from "react";
import { PostVisibility, Steps } from "../../../../utils/firebase/type";
import FirebaseWrapper from "../../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../../components/wrappers/MUIWrapper";
import DialogDeletePost from "../../../../components/DialogDeletePost";
import BottomBar from "../../../../components/primitives/BottomBar";
import { LoadingButton } from "@mui/lab";
import { Alert, ButtonGroup, Snackbar } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { updatePost, useGetPost } from "../../../../utils/firebase/api/post";
import Loader from "../../../../components/Loader";
import DoneIcon from "@mui/icons-material/Done";
import { Lists, ListsResponse } from "../../../../utils/firebase/api/list";
import SteppoHead from "../../../../components/SteppoHead";

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

const ReviewPostPage: FC<{ id: string; lists: Lists; steps: Steps }> = ({ id, steps, lists }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { data: post, isLoading: isLoadingPost } = useGetPost(id);

  const changeVisibility = async (visibility: PostVisibility) => {
    setIsLoading(true);
    const resp = await updatePost(post.id, { visibility });
    if (!resp.error) {
      setSuccessMessage(`Post visibility ${visibility}`);
    }
    setIsLoading(false);
  };

  if (isLoadingPost) {
    return <Loader></Loader>;
  }

  return (
    <>
      <SteppoHead title="Review" description="Admin review page">
        <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
      </SteppoHead>
      <StyledLayout>
        <Post {...post} enableLink={false} lists={lists} />
        {/* STEPS */}
        {steps.map((step, index) => (
          <StyledStep key={`step-${index}`} {...step} index={index} />
        ))}
        <BottomBar show={true}>
          <ButtonGroup variant="text" aria-label="text button group">
            {/* BUTTON PUBLISH */}
            <LoadingButton
              disabled={post.visibility === "public"}
              loading={isLoading}
              endIcon={<DoneIcon />}
              onClick={() => changeVisibility("public")}
            >
              {"Publish"}
            </LoadingButton>
            {/* BUTTON REJECT */}
            <LoadingButton
              disabled={post.visibility === "rejected"}
              loading={isLoading}
              endIcon={<BlockIcon />}
              onClick={() => changeVisibility("rejected")}
            >
              {"Reject"}
            </LoadingButton>
          </ButtonGroup>
        </BottomBar>
      </StyledLayout>
      {/* DELETE DIALOG */}
      <DialogDeletePost open={showDeleteDialog} onClose={() => setShowDeleteDialog(null)} />
      {/* SNACKBAR */}
      <Snackbar open={successMessage != null} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id || uuid();
  const stepsResponse = await getSteps(id);
  const listsResp: ListsResponse = await getLists(id);
  return {
    props: {
      steps: stepsResponse.data,
      lists: listsResp.data,
      id,
    },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <ReviewPostPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
