import Head from "next/head";
import Layout from "../../components/Layout";
import SplashEditable from "../../components/splashes/SplashEditable";
import StepEditable from "../../components/steps/StepEditable";
import { useStateObject } from "../../utils/object";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider } from "@mui/material";
import styled from "styled-components";

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

const Create = () => {
  // post object:
  const { object: dataPost, setValue: setPostValue } = useStateObject({
    title: "Title",
    descr: "Description",
    media: { imageURI: "" },
    steps: "ref",
  });

  // step object: {title: "Title",body: "Description",media: { imageURI: "" }}
  const { object: dataSteps, setValue: setStepsValue } = useStateObject({
    steps: [],
  });

  const onPressAddStep = () => {
    const steps = [...dataSteps.steps];
    steps.push({});
    setStepsValue("steps", steps);
  };

  return (
    <>
      <Head>
        <title>create</title>
      </Head>
      <StyledLayout>
        <SplashEditable
          onChangeTitle={(value) => setPostValue("title", value)}
          onChangeBody={(value) => setPostValue("description", value)}
        />
        <StyledDivider />
        {dataSteps.steps.map((dataStep, index) => (
          <>
            <StepEditable
              index={index}
              onChangeBody={(value) => setStepsValue("steps." + index + ".body", value)}
              onChangeTitle={(value) => setStepsValue("steps." + index + ".title", value)}
              {...dataStep}
            />
            <StyledDivider />
          </>
        ))}
        <section>
          <IconButton size="large" onClick={onPressAddStep}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </section>
      </StyledLayout>
    </>
  );
};

export default Create;
