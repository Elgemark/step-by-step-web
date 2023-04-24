import { Card, Collapse, IconButton, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { useRef, useEffect, FC, useState } from "react";
import StepEditableMoreMenu from "../StepEditableMoreMenu";
import { Step } from "../../utils/firebase/interface";
import { useStateObject } from "../../utils/object";
import ImageEditable from "../primitives/ImageEditable";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styled from "styled-components";
import { CollectionItems } from "../../utils/firebase/hooks/collections";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const StyledCard = styled(Card)`
  ${backgroundBlurMixin}
`;

const ButtonAddMediaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StepEditable: FC<{
  postId: string;
  step: Step;
  index: number;
  scrollIntoView: boolean;
  lists?: CollectionItems;
  onChange: any;
  onDelete: any;
  onAddStep: any;
}> = ({ postId, step, index, scrollIntoView = false, lists = [], onChange, onDelete, onAddStep, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { object: data, setValue } = useStateObject(step);
  const [openMediaEdit, setOpenMediaEdit] = useState(step.media.imageURI ? true : false);
  const theme = useTheme();

  console.log("annotation", data.annotation);

  useEffect(() => {
    if (ref && scrollIntoView) {
      setTimeout(() => {
        ref.current.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [ref, scrollIntoView]);

  const onClickAlternatePhoto = () => {
    setOpenMediaEdit(!openMediaEdit);
  };

  return (
    <StyledCard ref={ref} theme={theme} {...props}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#FF5733" }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        action={<StepEditableMoreMenu postId={postId} stepId={step.id} onDelete={onDelete} onAddStep={onAddStep} />}
        title={
          <TextField
            fullWidth
            label="Title"
            placeholder="Title"
            value={data.title}
            onChange={(e) => {
              const updatedData = setValue("title", e.target.value);
              onChange(updatedData);
            }}
          />
        }
      />
      <ButtonAddMediaContainer>
        <IconButton className="button-add-media" onClick={onClickAlternatePhoto}>
          {openMediaEdit ? <ExpandLessIcon /> : <AddPhotoAlternateIcon />}
        </IconButton>
      </ButtonAddMediaContainer>
      <Collapse in={openMediaEdit}>
        <ImageEditable
          onBlobChange={(blob) => {
            const updatedData = setValue("blob", blob);
            onChange(updatedData);
          }}
          onAnnotationChange={(annotation) => {
            const updatedData = setValue("annotation", annotation);
            onChange(updatedData);
          }}
          onDelete={() => {
            const updatedData = setValue("media.imageURI", null);
            onChange(updatedData);
          }}
          media={data.media}
          annotation={data.annotation && JSON.parse(data.annotation)}
        />
      </Collapse>
      <CardContent>
        <TextField
          fullWidth
          multiline
          label="body"
          value={data.body}
          placeholder="Body"
          onChange={(e) => {
            const updatedData = setValue("body", e.target.value);
            onChange(updatedData);
          }}
        />
      </CardContent>
    </StyledCard>
  );
};

export default StepEditable;
