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
import { useStateObject } from "../../utils/object";
import ImageEditable from "../primitives/ImageEditable";

const StepEditable: FC<{
  mediaLocationPath: Array<string>;
  step: Step;
  index: number;
  scrollIntoView: boolean;
  onChange: any;
  onDelete: any;
  onAddStep: any;
}> = ({ mediaLocationPath, step, index, scrollIntoView = false, onChange, onDelete, onAddStep, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { object: data, setValue } = useStateObject(step);

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
            {index + 1}
          </Avatar>
        }
        action={<StepMoreMenu onDelete={onDelete} onAddStep={onAddStep} />}
        title={
          <TextField
            fullWidth
            label="Title"
            placeholder="Title"
            value={data.title}
            onChange={(e) => setValue("title", e.target.value)}
          />
        }
      />
      <ImageEditable
        onBlobChange={(blob) => {
          const updatedData = setValue("blob", blob);
          onChange(updatedData);
        }}
        media={data.media}
        locationPath={mediaLocationPath}
      />
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
      <CardActions disableSpacing>
        {/* <IconButton aria-label="save">
          <SaveIcon />
        </IconButton> */}
      </CardActions>
    </Card>
  );
};

export default StepEditable;
