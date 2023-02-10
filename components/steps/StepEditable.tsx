import { Card, Collapse, IconButton } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { useRef, useEffect, FC, useState } from "react";
import StepMoreMenu from "../StepMoreMenu";
import { Step } from "../../utils/firebase/interface";
import { useStateObject } from "../../utils/object";
import ImageEditable from "../primitives/ImageEditable";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styled from "styled-components";

const ButtonAddMediaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StepEditable: FC<{
  step: Step;
  index: number;
  scrollIntoView: boolean;
  lists?: Lists;
  onListChange?: (id) => void;
  onChange: any;
  onDelete: any;
  onAddStep: any;
}> = ({ step, index, scrollIntoView = false, lists = [], onListChange, onChange, onDelete, onAddStep, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { object: data, setValue } = useStateObject(step);
  const [openMediaEdit, setOpenMediaEdit] = useState(false);

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
    <Card ref={ref} {...props}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        action={
          <StepMoreMenu
            index={index}
            lists={lists}
            onListChange={onListChange}
            onDelete={onDelete}
            onAddStep={onAddStep}
          />
        }
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
          media={data.media}
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
    </Card>
  );
};

export default StepEditable;
