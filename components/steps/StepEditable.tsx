import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import MediaEditable from "../primitives/MediaEditable";
import { useRef, useEffect } from "react";
import StepMoreMenu from "../StepMoreMenu";

const StepEditable = ({
  mediaLocationPath,
  index,
  title,
  body,
  media = {},
  onChangeTitle,
  onChangeBody,
  onChangeImage,
  onDelete,
  onAddStep,
  scrollIntoView = false,
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
    <Card ref={ref}>
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
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        }
      />
      <MediaEditable onChangeImage={onChangeImage} media={media} locationPath={mediaLocationPath} />
      <CardContent>
        <TextField
          fullWidth
          multiline
          label="body"
          value={body}
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
