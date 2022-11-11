import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
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

const MediaEditable = ({ media = {}, onChangeImage }) => {
  const { imageURI, blob, onPaste } = usePaste();
  const { upload, downloadURL } = useUploadFileAsBlob();

  useEffect(() => {
    if (blob) {
      upload(blob).then((e) => {
        onChangeImage(downloadURL);
      });
    }
  }, [blob]);

  console.log("downloadURL", downloadURL);

  return (
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
  );
};

export default MediaEditable;
