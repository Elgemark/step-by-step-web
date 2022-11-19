import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import MediaEditable from "../primitives/MediaEditable";

const StepEditable = ({ index, title, body, media = {}, onChangeTitle, onChangeBody, onChangeImage }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
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
      <MediaEditable onChangeImage={onChangeImage} media={media} />
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
