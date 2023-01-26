import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CropIcon from "@mui/icons-material/Crop";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { pasteHandler } from "../../utils/imageUtils";
import styled from "styled-components";
import OpenDialog from "./OpenDialog";
import { CircularProgress, Stack } from "@mui/material";
import { FC } from "react";
import Modal from "@mui/material/Modal";
import ImageEditor from "../ImageEditor";
import settings from "../../config";

const StyledCardMediaContainer = styled.div`
  position: relative;
  user-select: initial;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover img {
    opacity: ${({ hasImage }) => (hasImage ? 0.2 : 1)};
    transition: 0.2s opacity;
  }
  .actions-overlay {
    opacity: ${({ hasImage }) => (hasImage ? 0 : 1)};
  }
  &:hover .actions-overlay {
    opacity: 1;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  position: absolute;
  object-fit: cover;
`;

interface Media {
  imageURI?: String;
}

const ImageEditable: FC<{
  media: Media;
  onBlobChange?: Function;
}> = ({ media = { imageURI: "" }, onBlobChange, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [blob, setBlob] = useState();
  const [previewImageURI, setPreviewImageURI] = useState();
  const [selectedImageURI, setSelectedImageURI] = useState();
  // Prevents typing in paste textField
  const [emptyrStr, setEmptyStr] = useState("");
  const [cropSettings, setCropSettings] = useState({ crop: { x: 0, y: 0 }, zoom: 1 });

  const hasImage = previewImageURI || selectedImageURI || media?.imageURI;

  useEffect(() => {
    if (blob) {
      onBlobChange(blob);
    }
  }, [blob]);

  const onPasteHandler = async (e) => {
    setIsLoading(true);
    try {
      const pasteResult = await pasteHandler(e);
      setSelectedImageURI(pasteResult.url);
      setPreviewImageURI(pasteResult.url);
      setBlob(pasteResult.blob);
      setIsLoading(false);
      setOpenEditor(true);
    } catch (error) {
      setIsLoading(false);
      setOpenEditor(false);
    }
  };

  const onFileSelectedHandler = ({ file, url }) => {
    setSelectedImageURI(url);
    setPreviewImageURI(url);
    setCropSettings({ crop: { x: 0, y: 0 }, zoom: 1 });
    setBlob(file);
    setOpenEditor(true);
  };

  const onClickEditHandler = () => {
    setOpenEditor(true);
  };

  const onCloseEditorHandle = () => {
    setOpenEditor(false);
  };

  const onCropDoneHandler = ({ blob: imageBlob, url, settings }) => {
    setCropSettings(settings);
    setOpenEditor(false);
    setPreviewImageURI(url);
    setBlob(imageBlob);
  };

  return (
    <StyledCardMediaContainer onPaste={onPasteHandler} hasImage={hasImage} {...props} height={settings.image.height}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <StyledCardMedia
          className="card-media"
          component="img"
          image={previewImageURI || selectedImageURI || media?.imageURI}
        />
      )}
      <Stack direction="row" className="actions-overlay" spacing={1}>
        <TextField
          size="small"
          className="paste"
          label="Paste image here..."
          value={emptyrStr}
          onChange={() => setEmptyStr("")}
          onPaste={onPasteHandler}
        />
        <OpenDialog onFileSelected={onFileSelectedHandler}>
          <IconButton className="select-file" aria-label="browse">
            <FolderOpenIcon />
          </IconButton>
        </OpenDialog>
        {selectedImageURI && (
          <IconButton className="button-edit-image" aria-label="edit" onClick={onClickEditHandler}>
            <CropIcon />
          </IconButton>
        )}
      </Stack>

      <Modal open={openEditor} onClose={onCloseEditorHandle}>
        <>
          <ImageEditor
            src={selectedImageURI}
            onDone={onCropDoneHandler}
            onClose={() => setOpenEditor(false)}
            settings={cropSettings}
          />
        </>
      </Modal>
    </StyledCardMediaContainer>
  );
};

export default ImageEditable;
