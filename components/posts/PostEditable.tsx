import { Card, Chip } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePaste } from "../../utils/imageUtils";
import { useUploadFileAsBlob } from "../../utils/firebase/api";
import styled from "styled-components";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import MediaEditable from "../primitives/MediaEditable";

const PostEditable = ({
  title,
  descr,
  media = {},
  tags = [],
  onChangeTitle,
  onChangeBody,
  onAddTag,
  onRemoveTag,
  onChangeImage,
}) => {
  const [tag, setTag] = useState();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            A
          </Avatar>
        }
        title={<TextField fullWidth label="Title" value={title} onChange={(e) => onChangeTitle(e.target.value)} />}
        // subheader="September 14, 2016"
      />
      <MediaEditable onChangeImage={onChangeImage} media={media} />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            label="Description"
            value={descr}
            onChange={(e) => {
              onChangeBody(e.target.value);
            }}
          />
          <Stack spacing={1} direction="row" flexWrap={"wrap"}>
            {tags.map((tag, index) => (
              <Chip key={"key-" + tag + index} label={tag} onDelete={() => onRemoveTag(tag)} />
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="standard"
              size="small"
              fullWidth
              value={tags.join(" ")}
              placeholder="Tags"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value.toLowerCase());
              }}
            />
            <Fab
              size="small"
              disabled={!tag}
              onClick={() => {
                onAddTag(tag);
                setTag("");
              }}
            >
              <AddIcon />
            </Fab>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="save">
          <SaveIcon />
        </IconButton> */}
      </CardActions>
    </Card>
  );
};

export default PostEditable;
