import Head from "next/head";
import Layout from "../../components/Layout";
import PostEditable from "../../components/posts/PostEditable";
import StepEditable from "../../components/steps/StepEditable";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider } from "@mui/material";
import styled from "styled-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getPost, deleteList, uploadImage, setLists } from "../../utils/firebase/api";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FC, useEffect, useState } from "react";
import * as dataModels from "../../utils/firebase/models";
import { v4 as uuid } from "uuid";
import { Post, Step } from "../../utils/firebase/interface";
import { ImageUploads, Steps } from "../../utils/firebase/type";
import { deleteStep, setStep, setSteps, useSteps } from "../../utils/firebase/api/step";
import { uploadImages } from "../../utils/firebase/api/storage";
import { setPost, updatePost } from "../../utils/firebase/api/post";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { useUser } from "../../utils/firebase/api/user";
import Loader from "../../components/Loader";
import PublishIcon from "@mui/icons-material/Publish";
import Dialog from "../../components/primitives/Dialog";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { useRefresh } from "../../utils/firebaseUtils";
import BottomBar from "../../components/primitives/BottomBar";
import { useCollection, saveAll as saveAllLists } from "../../utils/firebase/hooks/collections";

const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  .content {
    width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 40px;
  }
  section {
    display: flex;
    justify-content: center;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

let saveData = { post: null, steps: null };

const CreatePage: FC<{ id: string; post: Post }> = ({ id, post }) => {
  const router = useRouter();
  const steps = useSteps(id);
  const {
    data: lists,
    updateItem: updateList,
    addItem: addList,
  } = useCollection(["posts", id, "lists"], (e) => {
    if (e) {
      setHasSaveData(true);
    }
  });
  const [prevId, setPrevId] = useState(id);
  const [successMessage, setSuccessMessage] = useState(null);
  const [postIsValid, setPostIsValid] = useState(false);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isLoading: isLoadingUser, data: user } = useUser();
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const refresh = useRefresh();

  useEffect(() => {
    if (prevId != id) {
      router.replace(router.asPath);
      setPrevId(id);
    }
  }, [id]);

  useEffect(() => {
    validatePost();
  }, [steps, post]);

  // Set save data
  const setSaveData = (path: Array<string | number> | string, value: any) => {
    _.set(saveData, path, value);
    validatePost();
    setHasSaveData(true);
  };

  const resetSaveData = () => {
    saveData = { post: null, steps: null };
    setHasSaveData(false);
  };

  const validatePost = () => {
    setPostIsValid(
      Boolean(
        steps.length > 0 ||
          (post.category && post.tags?.length && post.media?.imageURI) ||
          (_.get(saveData, "post.category") &&
            _.get(saveData, "post.tags") &&
            _.get(saveData, "post.title") &&
            _.get(saveData, "post.descr") &&
            _.get(saveData, "post.blob")) ||
          _.get(saveData, "post.media.imageURI")
      )
    );
  };

  const onClickAddStepHandler = async () => {
    const stepId = uuid();
    const index = steps.length === 0 ? 0 : steps[steps.length - 1].index + 1;
    const step: Step = { id: stepId, index, body: "", title: "", media: { imageURI: "" }, completed: false };
    await setStep(id, stepId, step);
  };

  const onClickSaveHandler = async () => {
    setIsSaving(true);
    const userId = user.uid;
    // Save lists...
    await saveAllLists();
    // Upload splash image...
    const splashImage = _.get(saveData, "post.blob");
    if (splashImage) {
      const responseUploadSplash = await uploadImage(splashImage, "1024x1024", [
        "users",
        userId,
        "post",
        id,
        "splash_",
      ]);
      _.set(saveData, "post.media.imageURI", responseUploadSplash.url);
      _.unset(saveData, "post.blob");
    }
    // Save post...
    if (saveData.post) {
      await setPost(id, { ...saveData.post, uid: userId });
    }
    // Uploas steps images
    const imageUploads: ImageUploads = [];
    _.forIn(saveData.steps, (value) => {
      // Prepare image uploads...
      if (value.blob) {
        imageUploads.push({
          blob: value.blob,
          imageSize: "1024x1024",
          locationPath: ["users", userId, "post", id, `step_${value.id}`],
          id: value.id,
        });
        // Remove blob...
        delete value.blob;
      }
    });

    const responseImageUploads = await uploadImages(imageUploads);
    // Get upload url
    responseImageUploads.forEach((imageUpload) => {
      _.set(saveData, `steps.${imageUpload.id}.media.imageURI`, imageUpload.url);
    });
    // Save steps...
    const steps: Steps = [];
    _.forIn(saveData.steps, (value) => {
      steps.push(value);
    });
    await setSteps(id, steps);
    // Reset all saveData
    resetSaveData();
    //
    setIsSaving(false);
  };

  const onDeleteStepHandler = async (step) => {
    await deleteStep(id, step.id);
    ["steps", step.id];
  };

  const onAddStepAtIndexHandler = async (index) => {
    // Calc index
    const indexCurrStep = index;
    const indexNextStep = index + 1 < steps.length && steps[index + 1].index;
    const newIndex = indexNextStep ? (indexCurrStep + indexNextStep) * 0.5 : indexCurrStep + 1;
    // Create step
    const stepId = uuid();
    const step: Step = { id: stepId, index: newIndex, body: "", title: "", media: { imageURI: "" }, completed: false };
    await setStep(id, stepId, step);
  };

  const onAddListHandler = async () => {
    // const listId = uuid();
    // const list: List = { id: listId, title: "", items: [] };
    // await setList(id, listId, list);
    addList({ id: uuid(), title: "" }, lists.length);
  };

  const onChangeListHandler = (id, hasSaveData, save) => {
    if (hasSaveData) {
      setHasSaveData(true);
    }
  };

  const onChangeListTitleHandler = (listId: string, title: string) => {
    //const list = lists.find((item) => item.id === listId);
    updateList(listId, { title });
  };

  const onDeleteListHandler = (listId) => {
    deleteList(id, listId).then((e) => {
      setSuccessMessage("List deleted!");
    });
  };

  const onClickPublishHandler = () => {
    setOpenPublishDialog(true);
  };

  const onClickPublish = async () => {
    if (hasSaveData) {
      await onClickSaveHandler();
    }

    const resp = await updatePost(id, { visibility: "review" });
    if (!resp.error) {
      setSuccessMessage("Post sent for review!");
      refresh();
    }
  };

  const onClickUnpublish = async () => {
    const resp = await updatePost(id, { visibility: "draft" });
    if (!resp.error) {
      setSuccessMessage("Post unpublished!");
      refresh();
    }
  };

  return (
    <>
      <Head>
        <title>STEPS | Create</title>
      </Head>
      {isLoadingUser ? (
        <Loader />
      ) : (
        <StyledLayout>
          {/* SETTINGS & POST */}
          <PostEditable
            post={post}
            lists={lists}
            onAddList={onAddListHandler}
            onChangeListTitle={onChangeListTitleHandler}
            onChangeListItems={onChangeListHandler}
            onDeleteList={onDeleteListHandler}
            onChange={(value) => {
              setSaveData("post", value);
            }}
          />
          <StyledDivider />
          {/* STEPS */}
          {steps.map((dataStep, index) => (
            <div key={"step-" + index + "-" + dataStep.id}>
              <StepEditable
                postId={id}
                step={dataStep}
                index={index}
                scrollIntoView={true}
                lists={lists}
                onChange={(data) => {
                  setSaveData(["steps", data.id], data);
                }}
                onDelete={() => onDeleteStepHandler(dataStep)}
                onAddStep={() => onAddStepAtIndexHandler(index)}
              />
              <StyledDivider />
            </div>
          ))}
          {/* BUTTONS */}
          <BottomBar show={postIsValid}>
            <ButtonGroup variant="text" aria-label="text button group">
              {/* BUTTON SAVE */}
              <LoadingButton
                loading={isSaving}
                disabled={!hasSaveData}
                endIcon={<SaveIcon />}
                onClick={onClickSaveHandler}
              >
                Save
              </LoadingButton>
              {/* BUTTON ADD STEP */}
              <Button endIcon={<AddIcon />} onClick={onClickAddStepHandler}>
                Step
              </Button>
              {/* BUTTON PUBLISH / UNPUBLISH */}
              <Button
                endIcon={post.visibility === "draft" ? <PublishIcon /> : <UnpublishedIcon />}
                onClick={onClickPublishHandler}
              >
                {post.visibility === "draft" ? "Publish" : "Unpublish"}
              </Button>
            </ButtonGroup>
          </BottomBar>
          {/* SNACKBAR */}
          <Snackbar open={successMessage != null} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
            <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
              {successMessage}
            </Alert>
          </Snackbar>
          {/* DIALOG PUBLISH */}
          <Dialog
            open={openPublishDialog}
            title={post.visibility === "draft" ? "Publish?" : "Unpublish?"}
            labelButtonOk={post.visibility === "draft" ? "Publish" : "Unpublish"}
            content={
              post.visibility === "draft"
                ? "Every published posts must first reviewed. The review can take up to 48 hours. You will recevie a mail when the post is live or if the post was rejected. Ready to publish?"
                : "Are you sure you want to unpublis this post? The post must be reviewed again once you decide to publish the post again."
            }
            onClose={() => {
              setOpenPublishDialog(false);
            }}
            onClickCancel={() => {
              setOpenPublishDialog(false);
            }}
            onClickOk={post.visibility === "draft" ? onClickPublish : onClickUnpublish}
          />
        </StyledLayout>
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id;
  const post = await getPost(id);
  return {
    props: {
      post: post?.data || dataModels.post,
      id,
    },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <CreatePage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
