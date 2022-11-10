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

const StyledCardMediaContainer = styled.div`
  position: relative;
  user-select: initial;
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover img {
    opacity: ${({ hasImage }) => (hasImage ? 0.2 : 1)};
    transition: 0.2s opacity;
  }
  .paste,
  .select-file {
    opacity: ${({ hasImage }) => (hasImage ? 0 : 1)};
  }
  &:hover .paste,
  &:hover .select-file {
    opacity: 1;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  position: absolute;
`;

const StyledTags = styled.div`
  margin: 16px 0;
`;

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
  const { imageURI, blob, onPaste } = usePaste();
  const { upload, downloadURL } = useUploadFileAsBlob();

  useEffect(() => {
    if (blob) {
      upload(blob).then((e) => {
        onChangeImage(downloadURL);
      });
    }
  }, [blob]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            A
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
        // subheader="September 14, 2016"
      />
      <StyledCardMediaContainer onPaste={onPaste} hasImage={downloadURL || imageURI || media.imageURI}>
        <StyledCardMedia component="img" height="300" image={downloadURL || imageURI || media.imageURI} />
        <TextField
          size="small"
          className="paste"
          label="Paste image here..."
          placeholder="Paste image here..."
          onPaste={onPaste}
        />
        <IconButton className="select-file" aria-label="browse">
          <DriveFolderUploadIcon />
        </IconButton>
      </StyledCardMediaContainer>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            label="Description"
            value={descr}
            placeholder="Description"
            onChange={(e) => {
              onChangeBody(e.target.value);
            }}
          />
          <Stack spacing={1} direction="row" flexWrap={"wrap"}>
            {tags.map((tag) => (
              <Chip label={tag} onDelete={() => onRemoveTag(tag)} />
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
                setTag(e.target.value);
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
