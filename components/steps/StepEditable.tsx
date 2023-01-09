import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import MediaEditable from "../primitives/MediaEditable";
import { useRef, useEffect, FC } from "react";
import StepMoreMenu from "../StepMoreMenu";
import { Step } from "../../utils/firebase/interface";

const StepEditable: FC<{
  mediaLocationPath: Array<string>;
  step: Step;
  scrollIntoView: boolean;
  onChangeTitle: any;
  onChangeBody: any;
  onChangeImage: any;
  onDelete: any;
  onAddStep: any;
}> = ({
  mediaLocationPath,
  step,
  scrollIntoView = false,
  onChangeTitle,
  onChangeBody,
  onChangeImage,
  onDelete,
  onAddStep,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref && scrollIntoView) {
      setTimeout(() => {
        ref.current.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [ref, scrollIntoView]);

  return (
    <Card ref={ref} {...props}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {step.index + 1}
          </Avatar>
        }
        action={<StepMoreMenu onDelete={onDelete} onAddStep={onAddStep} />}
        title={
          <TextField
            fullWidth
            label="Title"
            placeholder="Title"
            value={step.title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        }
      />
      <MediaEditable onChangeImage={onChangeImage} media={step.media} locationPath={mediaLocationPath} />
      <CardContent>
        <TextField
          fullWidth
          multiline
          label="body"
          value={step.body}
          placeholder="Description"
          onChange={(e) => onChangeBody(e.target.value)}
        />
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="save">
          <SaveIcon />
        </IconButton> */}
      </CardActions>
    </Card>
  );
};

export default StepEditable;
