import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePaste } from "../../utils/imageUtils";
import { useUploadFileAsBlob } from "../../utils/firebase/api";
import styled from "styled-components";
import OpenDialog from "./OpenDialog";
import { CircularProgress } from "@mui/material";

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
  object-fit: contain;
`;

const MediaEditable = ({ locationPath = [], media = {}, onChangeImage }) => {
  const { blob, imageURI, onPaste } = usePaste();
  const { upload, isLoading } = useUploadFileAsBlob(locationPath);
  const [emptyrStr, setEmptyStr] = useState("");

  useEffect(() => {
    if (blob) {
      upload(blob).then((e) => {
        onChangeImage(e.url);
      });
    }
  }, [blob]);

  const onFileSelectedHandler = (file) => {
    upload(file)
      .then((e) => {
        onChangeImage(e.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledCardMediaContainer onPaste={onPaste} hasImage={imageURI || media.imageURI}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <StyledCardMedia component="img" height="300" image={imageURI || media.imageURI} />
          <TextField
            size="small"
            className="paste"
            label="Paste image here..."
            value={emptyrStr}
            onChange={() => setEmptyStr("")}
            onPaste={onPaste}
          />
          <OpenDialog onFileSelected={onFileSelectedHandler}>
            <IconButton className="select-file" aria-label="browse">
              <FolderOpenIcon />
            </IconButton>
          </OpenDialog>
        </>
      )}
    </StyledCardMediaContainer>
  );
};

export default MediaEditable;
