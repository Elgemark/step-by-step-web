import Head from "next/head";
import Layout from "../../components/Layout";
import PostEditable from "../../components/posts/PostEditable";
import StepEditable from "../../components/steps/StepEditable";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider, Slide } from "@mui/material";
import styled from "styled-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getPost, deleteList, uploadImage, setLists } from "../../utils/firebase/api";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FC, useEffect, useState } from "react";
import * as dataModels from "../../utils/firebase/models";
import { v4 as uuid } from "uuid";
import { List, Post, Step } from "../../utils/firebase/interface";
import { ImageUploads, Lists, Steps } from "../../utils/firebase/type";
import { deleteStep, setStep, setSteps, useSteps } from "../../utils/firebase/api/step";
import { getAuth } from "firebase/auth";
import { uploadImages } from "../../utils/firebase/api/storage";
import { setPost } from "../../utils/firebase/api/post";
import { setList, useLists } from "../../utils/firebase/api/list";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";

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
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    backdrop-filter: blur(5px);
    background-color: rgba(18, 18, 18, 0.4);
  }
`;

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

const StyledBottomBar = styled.div`
  display: flex;
  justify-content: center;
`;

let saveData = { post: null, steps: null, lists: null };

const CreatePage: FC<{ id: string; post: Post }> = ({ id, post }) => {
  const router = useRouter();
  const steps = useSteps(id);
  const lists = useLists(id);
  const [prevId, setPrevId] = useState(id);
  const [successMessage, setSuccessMessage] = useState(null);
  const [postIsValid, setPostIsValid] = useState(false);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    saveData = { post: null, steps: null, lists: null };
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
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    // Save lists...
    const lists: Lists = [];
    _.forIn(saveData.lists, (value) => {
      lists.push(value);
    });
    await setLists(id, lists);
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
      await setPost(id, saveData.post);
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
    const listId = uuid();
    const list: List = { id: listId, title: "", items: [] };
    await setList(id, listId, list);
  };

  const onChangeListHandler = (data: List) => {
    setSaveData(`lists.${data.id}`, data);
  };

  const onDeleteListHandler = (listId) => {
    deleteList(id, listId).then((e) => {
      setSuccessMessage("List deleted!");
    });
  };

  return (
    <>
      <Head>
        <title>STEPS | Create</title>
      </Head>
      <StyledLayout>
        {/* SETTINGS & POST */}
        <PostEditable
          post={post}
          lists={lists}
          onAddList={onAddListHandler}
          onChangeList={onChangeListHandler}
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
              step={dataStep}
              index={index}
              scrollIntoView={true}
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
        <Slide className="bottom-bar" direction="up" in={postIsValid}>
          <StyledBottomBar>
            <ButtonGroup variant="text" aria-label="text button group">
              <LoadingButton
                loading={isSaving}
                disabled={!hasSaveData}
                endIcon={<SaveIcon />}
                onClick={onClickSaveHandler}
              >
                Save
              </LoadingButton>
              <Button endIcon={<AddIcon />} onClick={onClickAddStepHandler}>
                Step
              </Button>
            </ButtonGroup>
          </StyledBottomBar>
        </Slide>
        {/* SNACKBAR */}
        <Snackbar open={successMessage != null} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
          <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </StyledLayout>
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
