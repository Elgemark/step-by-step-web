import Head from "next/head";
import Layout from "../../components/Layout";
import PostEditable from "../../components/posts/PostEditable";
import StepEditable from "../../components/steps/StepEditable";
import { useStateObject } from "../../utils/object";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider, Fade, Slide } from "@mui/material";
import styled from "styled-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getLists, getPost, getSteps, setPostAndSteps, deleteList, uploadImage } from "../../utils/firebase/api";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FC, useEffect, useState } from "react";
import * as dataModels from "../../utils/firebase/models";
import { toSanitizedArray } from "../../utils/stringUtils";
import { v4 as uuid } from "uuid";
import { List, ListResponse, Post, Step } from "../../utils/firebase/interface";
import { ImageUploads, Lists, Steps } from "../../utils/firebase/type";
import { deleteStep, setStep, setSteps, useSteps } from "../../utils/firebase/api/step";
import { getAuth } from "firebase/auth";
import { uploadImages } from "../../utils/firebase/api/storage";

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

let saveData = { steps: null, post: null, lists: null };

const Create: FC<{ id: string; post: Post; lists: Lists }> = ({ id, post, lists }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showAddStepButton, setShowAddStepButton] = useState(true);
  const [hasSaveData, setHasSaveData] = useState(false);
  // POST
  const { object: dataPost, setValue: setPostValue, replace: replacePost } = useStateObject(post);
  // POST LISTS
  const [dataLists, setDataLists] = useState(lists);
  // STEPS
  const steps = useSteps(id);
  // Set save data
  const setSaveData = (path: Array<string | number> | string, value: any) => {
    _.set(saveData, path, value);
    setHasSaveData(true);
  };

  const resetSaveData = () => {
    saveData = { steps: null, post: null, lists: null };
    setHasSaveData(false);
  };

  // Neccesery to force a reload of data if user clicks "CREATE"
  useEffect(() => {
    replacePost(post);
    setDataLists(lists);
  }, [id]);

  useEffect(() => {
    if (dataPost.title != "" && dataPost.descr != "" && dataPost.media.imageURI != "") {
      setShowSaveButton(true);
      setShowAddStepButton(true);
    } else {
      setShowSaveButton(false);
      setShowAddStepButton(false);
    }
  }, [dataPost, dataLists]);

  const onClickAddStepHandler = async () => {
    const stepId = uuid();
    const index = steps.length === 0 ? 0 : steps[steps.length - 1].index + 1;
    const step: Step = { id: stepId, index, body: "", title: "", media: { imageURI: "" }, completed: false };
    await setStep(id, stepId, step);
  };

  const onClickSaveHandler = async () => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    // Save post...
    // Save lists...
    // Upload images...
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
    const stepsResponse = await setSteps(id, steps);
    // Reset all saveData
    resetSaveData();
    //
    console.log({ responseImageUploads, saveData, stepsResponse });
  };

  const onAddTagHandler = (value) => {
    setPostValue("tags", toSanitizedArray(value, dataPost.tags));
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

  const onAddListHandler = () => {
    const listId = uuid();
    const list: List = { id: listId, items: [{ text: "", value: "" }], title: "" };
    const newDataLists = [...dataLists, list];
    setDataLists(newDataLists);
  };

  const onAddListItemHandler = ({ id: listId, index }) => {
    const newDataLists = _.cloneDeep(dataLists);
    const listIndex = newDataLists.findIndex((list) => list.id === listId);
    newDataLists[listIndex].items.splice(index, 0, { text: "", value: "" });
    setDataLists(newDataLists);
  };

  const onEditListsHandler = (data) => {
    const newDataLists = [...dataLists];
    const index = newDataLists.findIndex((list) => list.id === data.id);
    newDataLists[index] = data;
    setDataLists(newDataLists);
  };

  const onDeleteListHandler = ({ id: listId }) => {
    const newDataLists = _.cloneDeep(dataLists);
    const listIndex = newDataLists.findIndex((list) => list.id === listId);
    newDataLists.splice(listIndex, 1);
    setDataLists(newDataLists);
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
          lists={dataLists}
          onAddList={onAddListHandler}
          onAddListItem={onAddListItemHandler}
          onEditLists={onEditListsHandler}
          onDeleteList={onDeleteListHandler}
          onChangeTitle={(value) => setPostValue("title", value)}
          onChangeBody={(value) => setPostValue("descr", value)}
          onChangeImage={(value) => setPostValue("media.imageURI", value)}
          onChangeCategory={(value) => setPostValue("category", value)}
          onAddTag={onAddTagHandler}
          onRemoveTag={(value) => {
            const tagsCopy = [...dataPost.tags];
            _.remove(tagsCopy, (tag) => tag === value);
            setPostValue("tags", tagsCopy);
          }}
          mediaLocationPath={["post", id, "splash-" + _.kebabCase(dataPost.title)]}
          {...dataPost}
        />
        <StyledDivider />
        {/* STEPS */}
        {steps.map((dataStep, index) => (
          <div key={"step-" + index + "-" + dataStep.id}>
            <StepEditable
              step={dataStep}
              index={index}
              scrollIntoView={false}
              onChange={(data) => {
                setSaveData(["steps", data.id], data);
              }}
              onDelete={() => onDeleteStepHandler(dataStep)}
              onAddStep={() => onAddStepAtIndexHandler(index)}
              mediaLocationPath={[
                "post",
                id,
                _.kebabCase(dataPost.title) + "_step-" + (index + 1) + "_" + _.kebabCase(dataStep.title || "image"),
              ]}
            />
            <StyledDivider />
          </div>
        ))}
        {/* BUTTONS */}
        <Slide className="bottom-bar" direction="up" in={showSaveButton || showAddStepButton}>
          <StyledBottomBar>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button disabled={!showSaveButton} endIcon={<SaveIcon />} onClick={onClickSaveHandler}>
                Save
              </Button>

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
  const stepsResponse = await getSteps(id);
  const listsResp: ListResponse = await getLists(id);
  return {
    props: {
      post: post?.data || dataModels.post,
      steps: stepsResponse.data,
      lists: listsResp.data,
      id,
    },
  };
}

export default Create;
