import Head from "next/head";
import Layout from "../../components/Layout";
import PostEditable from "../../components/posts/PostEditable";
import StepEditable from "../../components/steps/StepEditable";
import { useStateObject } from "../../utils/object";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider, Fade } from "@mui/material";
import styled from "styled-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import { getLists, getPost, getSteps, setPostAndSteps, deleteList } from "../../utils/firebase/api";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FC, useEffect, useState } from "react";
import * as dataModels from "../../utils/firebase/models";
import { toSanitizedArray } from "../../utils/stringUtils";
import { v4 as uuid } from "uuid";
import { List, ListResponse, Post } from "../../utils/firebase/interface";
import { Lists, Steps } from "../../utils/firebase/type";

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

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

const StyledBottomBar = styled.div`
  display: flex;
  justify-content: center;
`;

const Create: FC<{ id: string; post: Post; steps: Steps; lists: Lists }> = ({ id, post, steps, lists }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [createdStep, setCreatedStep] = useState({});
  // POST
  const { object: dataPost, setValue: setPostValue, replace: replacePost } = useStateObject(post);
  // POST LISTS
  const [dataLists, setDataLists] = useState(lists);
  // STEPS
  const { object: dataSteps, setValue: setStepsValue, replace: replaceSteps } = useStateObject(steps);

  // Neccesery to force a reload of data if user clicks "CREATE"
  useEffect(() => {
    replacePost(post);
    replaceSteps(steps);
    setDataLists(lists);
  }, [id]);

  const onClickAddStepHandler = () => {
    const steps = [...dataSteps.steps];
    const newStep = dataModels.createStep();
    steps.push(newStep);
    setStepsValue("steps", steps);
    setCreatedStep(newStep);
  };

  const onClickSaveHandler = async () => {
    const resp = await setPostAndSteps(id, dataPost, dataSteps, dataLists);
    if (!resp.error) {
      // Success...
      setSuccessMessage("Post saved!");
    } else {
      console.warn(resp.error);
    }
  };

  const onAddTagHandler = (value) => {
    setPostValue("tags", toSanitizedArray(value, dataPost.tags));
  };

  const onChangePrerequisitesHandler = (prerequisites) => {
    setPostValue("prerequisites", prerequisites);
  };

  const onDeleteStepHandler = (e) => {
    const { index } = e;
    const steps = [...dataSteps.steps];
    _.pullAt(steps, index);
    setStepsValue("steps", steps);
  };

  const onAddStepAtIndexHandler = (e) => {
    const { index } = e;
    const steps = [...dataSteps.steps];
    const newStep = dataModels.createStep();
    steps.splice(index + 1, 0, newStep);
    setStepsValue("steps", steps);
    setCreatedStep(newStep);
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
          onChangePrerequisites={onChangePrerequisitesHandler}
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
        {dataSteps.steps.map((dataStep, index) => (
          <div key={"step-" + index + "-" + dataStep.id}>
            <StepEditable
              index={index}
              onChangeBody={(value) => setStepsValue("steps." + index + ".body", value)}
              onChangeTitle={(value) => setStepsValue("steps." + index + ".title", value)}
              onChangeImage={(value) => setStepsValue("steps." + index + ".media.imageURI", value)}
              onDelete={() => onDeleteStepHandler({ ...dataStep, index })}
              onAddStep={() => onAddStepAtIndexHandler({ ...dataStep, index })}
              mediaLocationPath={[
                "post",
                id,
                _.kebabCase(dataPost.title) + "_step-" + (index + 1) + "_" + _.kebabCase(dataStep.title || "image"),
              ]}
              // scrollIntoView={dataSteps.steps.length - 1 === index}
              scrollIntoView={createdStep.id === dataStep.id}
              {...dataStep}
            />
            <StyledDivider />
          </div>
        ))}
        {/* BUTTONS */}
        <Fade in={dataPost.title != "" && dataPost.descr != "" && dataPost.media.imageURI != ""}>
          <StyledBottomBar>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button endIcon={<SaveIcon />} onClick={onClickSaveHandler}>
                Save
              </Button>
              <Button endIcon={<AddIcon />} onClick={onClickAddStepHandler}>
                Step
              </Button>
            </ButtonGroup>
          </StyledBottomBar>
        </Fade>
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
  const steps = await getSteps(id);
  const listsResp: ListResponse = await getLists(id);
  return {
    props: {
      post: post?.data || dataModels.post,
      steps: steps?.data || dataModels.steps,
      lists: listsResp.data,
      id,
    },
  };
}

export default Create;
