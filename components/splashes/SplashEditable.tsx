import { Button, Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import SaveIcon from "@mui/icons-material/Save";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePaste } from "../../utils/imageUtils";
import { useUploadFileAsBlob } from "../../utils/firebase/api";
import styled from "styled-components";

const StyledCardMediaContainer = styled.div`
  position: relative;
  user-select: initial;
  width: 100%;
  height: 194px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCardMedia = styled(CardMedia)`
  position: absolute;
`;

const SplashEditable = ({ title, description, media = {}, onChangeTitle, onChangeDescription, onChangeImage }) => {
  const { imageURI, blob, onPaste } = usePaste();
  const { upload, downloadURL } = useUploadFileAsBlob();

  useEffect(() => {
    if (blob) {
      upload(blob).then(() => {
        onChangeImage(downloadURL);
      });
    }
  }, [blob]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            R
          </Avatar>
        }
        title={<TextField fullWidth label="Title" placeholder="Title" value={title} onChange={() => onChangeTitle} />}
        // subheader="September 14, 2016"
      />
      <StyledCardMediaContainer onPaste={onPaste}>
        <StyledCardMedia component="img" height="194" image={downloadURL || imageURI || media.imageURI} />
        <TextField
          size="small"
          className="paste"
          label="Paste image here..."
          placeholder="Paste image here..."
          onPaste={onPaste}
        />
        <IconButton aria-label="browse">
          <DriveFolderUploadIcon />
        </IconButton>
      </StyledCardMediaContainer>
      <CardContent>
        <TextField
          fullWidth
          multiline
          label="body"
          value={description}
          placeholder="Description"
          onChange={onChangeDescription}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <SaveIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SplashEditable;
